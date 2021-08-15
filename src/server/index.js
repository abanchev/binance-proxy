import express from "express";
import cors from "cors";
import compression from "compression";
import { Router } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';

const getServer = async (client) => {
    const app = express();
    const router = new Router();

    app.use(cors());
    app.use(compression());
    app.use(express.json());

    router.get('/api/v3/klines', async (req, res) => {
        res.send(await client.getCandles(req.query.symbol, req.query.interval));
    });

    router.use(createProxyMiddleware({
        target: 'https://api.binance.com', changeOrigin: true
    }));

    app.use("/", router);
    return app
}

export default getServer