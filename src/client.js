import Binance from 'node-binance-api';
import FixedQueue from './misc/FixedQueue.js';

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
                if (!this.klines[symbol + interval]) {
                    this.klines[symbol + interval] = new FixedQueue(1000, []);
                }
                let timeDiff = Math.abs(Object.keys(chart)[0] - Object.keys(chart)[1]);
                for (let openTime of Object.keys(chart)) {
                    let item = chart[openTime];
                    openTime = parseInt(openTime);
                    let quoteAssetVolume = parseFloat(item.volume) / ((parseFloat(item.open) + parseFloat(item.close)) / 2);
                    const frame = [
                        openTime,
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                        item.volume,
                        openTime + timeDiff - 1,
                        quoteAssetVolume.toString(),
                        100,
                        (quoteAssetVolume / 2).toString(),
                        (quoteAssetVolume / 2).toString(),
                        "1.1"];
                    this.klines[symbol + interval].push(frame);

                }
            }, 1000);
        }
    }
    async getCandles(symbol, interval) {
        if (!this.klines[symbol + interval]) {
            this.subscribe(symbol, interval);
            while (!this.klines[symbol + interval]) {
                await new Promise(r => setTimeout(r, 10));
            }
        }
        return this.klines[symbol + interval];
    }
}


export default new Client();