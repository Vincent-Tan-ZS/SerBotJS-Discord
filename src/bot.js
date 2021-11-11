import http from 'http';
import { client } from './setup.js';
import config from './config.js';
import moment from 'moment-timezone';

http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write("SerBot enabled.");
    response.end();

    let timezone = moment.tz.guess(true);
    let time = moment().format("LT");

    console.log(`[${timezone} ${time}] Pinged SerBot`);
}).listen(process.env.PORT)

client.login(config.token);