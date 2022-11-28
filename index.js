import http from 'http';
import { client } from './src/setup.js';
import config from './src/config.js';
import moment from 'moment-timezone';
import discordModals from 'discord-modals';

const GetTime = () => {
    let timezone = moment.tz.guess(true);
    let time = moment().format("LT");

    return `${timezone} ${time}`;
}

const server = http.createServer().listen(process.env.PORT);

server.on('request', (req, res) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write("SerBot enabled.");
    response.end();

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

discordModals(client);

client.login(config.token);