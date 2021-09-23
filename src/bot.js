require('dotenv').config();

var http = require('http')
http.createServer(function(request, response) {}).listen(process.env.PORT)

const serbot = require('./setup');
serbot.client.login(serbot.config.token);