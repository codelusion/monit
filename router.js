'use strict';

const parser = require('url');
const commandRunner = require('./run');

var Router = (req, res) => {
    if (req.method === 'GET') {
        switch (true) {
            case req.url === '/cmd':
            case req.url === '/cmd/':
                routeSuccess(req, res, listAllCommands());
                break;
            case validCommand(req.url) !== false:
                runCommand(req, res);
                break;
            default:
                handleUnknownRoute(req, res);
        }
    } else {
        handleUnknownRoute(req, res);
    }

};

var runCommand = (req, res) => {
    var reqUrl = parser.parse(req.url, true);
    try {
        routeSuccess(req, res, commandRunner.runCommand(parseCommand(req.url), reqUrl.query));
    } catch(e) {
        return handleInvalid(req, res, e);
    }
};


var validCommand = (path) => {
    return (parseCommand(path));
};

var parseCommand = (path) => {
    var reqUrl = parser.parse(path, true);
    if (reqUrl.pathname.charAt(reqUrl.pathname.length -1) === '/'){
        reqUrl.pathname = reqUrl.pathname.slice(0, -1);
    }
    var parts = reqUrl.pathname.split('/');
    if (
        parts.length == 3 &&
        parts[1] === 'cmd' &&
        commandRunner.listCommands().indexOf(parts[2]) > -1
    )
    {
        return parts[2];
    } else {
        return false;
    }
};

var listAllCommands = () => {
    return commandRunner.listCommands()
};

var handleUnknownRoute = (req, res) => {
    var result = {
        url: req.url,
        status: 'NotFound'
    };
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
};

var routeSuccess = function (req, res, result) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
};

var handleInvalid = function (req, res, error) {
    res.writeHead(422, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(error));
};


module.exports.Router = Router;