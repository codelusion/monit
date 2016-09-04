'use strict';

// content of index.js
const http = require('http');
const port = 3000;
const serverName = 'monit';
const Router = require('./router').Router;

const server = http.createServer(Router);

server.listen(port, (err) => {
    if (err) {
        return console.err(serverName + ': server error', err)
    }
    console.log('server ' + serverName + ' listening on port: ' + port);
});