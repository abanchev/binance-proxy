import { Router } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';
const getRouter = (client) => {
    const router = new Router()
    router.get('/api/v3/klines', async (req, res) => {
        res.send(await client.getCandles(req.query.symbol, req.query.interval || '5m'));
    });

    router.use(createProxyMiddleware({
        target: 'https://api.binance.com', changeOrigin: true
    }));

    return router;
}

export default getRouter