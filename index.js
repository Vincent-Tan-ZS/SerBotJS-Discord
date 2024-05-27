import http from 'http';
import { client } from './src/setup.js';
import config from './src/config.js';
import dayjstz from './src/dayjstz.js';

const timezone = dayjstz.tz.guess();

const IndexLog = (msg) => {
    let time = dayjstz().format("LT");

    return `[${timezone} ${time}] ${msg}`;
}

const server = http.createServer().listen(process.env.PORT);

server.on('request', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("SerBot enabled.");
    res.end();

    IndexLog("Pinged SerBot");
});

server.on('close', () => {
    IndexLog("SerBot closing");
});

server.on('error', (err) => {
    IndexLog(`SerBot closing with error: ${err}`);
});

client.login(config.token);