'use strict';

var spawnSync = require('child_process').spawnSync;
var fs = require('fs');
var path = require('path');
var Commands = {};
const ERR_CMD_GEN = 'Error: command generation failure';
const ERR_CMD_EXEC = 'Error: command execution failure';
const ERR_CMD_CMP = 'Error: unable to complete command';

((cmdDir) => {
    fs.readdirSync(cmdDir)
        .filter((f) => {
            return path.extname(f) == '.js' && f !== 'index.js';
        })
        .map((f) => {
            var cmd = path.basename(f, '.js');
            var mod = './' + cmd;
            Commands[cmd] = require(mod);
        })
})(__dirname);


var runCommand = (cmdName, params) => {
    if (Commands[cmdName]) {
        var raw = run(cmdName, params)
            .split("\n")
            .map((line) => line.trim())
            .filter((Boolean));
        if (Commands[cmdName].format && !params.raw) {
            return Commands[cmdName].format(raw, params);
        } else {
            return raw;
        }
    }

    return null;
};

var run = (cmdName, params) => {
    var command = Commands[cmdName];
    //function that returns cmd object
    //based on external params
    if (typeof command === 'function') {
        try {
            command = command(params);
        } catch (e){
            console.log(e);
            return ERR_CMD_GEN;
        }
    }
    if (command && (command.cmd || command.args)) {
        var res = spawnSync(command.cmd, command.args, command.options);
        if (res.stdout) {
            return res.stdout.toString();
        } else {
            return ERR_CMD_EXEC;
        }
    } else {
        throw Error(command.error? command.error : ERR_CMD_CMP);
    }

};


module.exports.listCommands = () => {
    return Object.keys(Commands)
};
module.exports.runCommand = runCommand;