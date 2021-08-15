import express from "express";
import cors from "cors";
import compression from "compression";
import getRouter from "./router/index.js";

const getServer = async (client) => {
    const app = express()

    app.use(cors());
    app.use(compression());
    app.use(express.json());

    app.use("/", getRouter(client))

    return app
}

export default getServer