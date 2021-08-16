import Binance from 'node-binance-api';

class Client {
    client;
    subscribed;
    klines;

    constructor() {
        this.client = new Binance().options();
        this.subscribed = [];
        this.klines = {};
    }

    subscribe(symbol, interval) {
        if (!this.subscribed.find(e => e === symbol + interval)) {

            this.subscribed.push(symbol + interval);
            this.client.websockets.chart(symbol, interval, (symbol, interval, chart) => {
                let timeDiff = Math.abs(Object.keys(chart)[0] - Object.keys(chart)[1]);
                let newFrames = [];
                for (let openTime of Object.keys(chart)) {
                    let item = chart[openTime];
                    openTime = parseInt(openTime);
                    let closeTime = openTime + timeDiff - 1;
                    let quoteAssetVolume = parseFloat(item.volume) / ((parseFloat(item.open) + parseFloat(item.close)) / 2);
                    const frame = [
                        openTime,
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                        item.volume,
                        closeTime,
                        quoteAssetVolume.toString(),
                        100,
                        (quoteAssetVolume / 2).toString(),
                        (quoteAssetVolume / 2).toString(),
                        "1.1"];
                    newFrames.push(frame);
                }
                this.klines[symbol + interval] = newFrames;
            }, 1000);
        }
    }
    async getCandles(symbol, interval) {
        let data = this.klines[symbol + interval];
        if (!data) {
            this.subscribe(symbol, interval);
        }
        while (!data || data[data.length - 1][6] <= Date.now()) {
            await new Promise(r => setTimeout(r, 20));
            data = this.klines[symbol + interval];
        }
        return data;
    }
}


export default new Client();