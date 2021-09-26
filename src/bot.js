require('dotenv').config();

const http = require('http')
http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("SerBot enabled.");
  response.end();
  console.log("Pinged server");
}).listen(process.env.PORT)

const serbot = require('./setup');
serbot.client.login(serbot.config.token);