import http from 'http';
import { client } from './setup.js';
import config from './config.js';

http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write("SerBot enabled.");
    response.end();
    console.log("Pinged server");
}).listen(process.env.PORT)

client.login(config.token);