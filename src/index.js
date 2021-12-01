import getServer from "./server/index.js";
import client from './client.js'

const server = await getServer(client).then(app => app.listen(8080, '0.0.0.0'));


var signals = {
    'SIGINT': 2,
    'SIGTERM': 15
};

function shutdown(signal, value) {
    server.close(function () {
        console.log('server stopped by ' + signal);
        process.exit(128 + value);
    });
}

Object.keys(signals).forEach(function (signal) {
    process.on(signal, function () {
        shutdown(signal, signals[signal]);
    });
});
