import http from 'http';
import { client } from './src/setup.js';
import config from './src/config.js';
import moment from 'moment-timezone';

const GetTime = () => {
    let timezone = moment.tz.guess(true);
    let time = moment().format("LT");

    return `${timezone} ${time}`;
}

const server = http.createServer().listen(process.env.PORT);

server.on('request', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("SerBot enabled.");
    res.end();

    const time = GetTime();

    console.log(`[${time}] Pinged SerBot`);
});

server.on('close', () => {
    const time = GetTime();

    console.log(`[${time}] SerBot closing`);
});

server.on('error', (err) => {
    const time = GetTime();

    console.log(`[${time}] SerBot closing`);
});

client.login(config.token);