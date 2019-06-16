/*
 * Copyright (c) 2017-2019 JSQL Sp. z.o.o. (Ltd, LLC) www.jsql.it
 * See LICENSE or https://jsql.it/public-packages-license
 */

const path = require("path");
const chalk = require("chalk");
const { exec } = require('child_process');

process.bin = process.title = 'jsql-server';

let execProcess = function(command) {
    const process = exec(command);

    process.stdout.on('data', (data) => {
        console.log('stdout: ' + data.toString())
    });

    process.stderr.on('data', (data) => {
        console.log('stderr: ' + data.toString())
    });

    process.on('exit', (code) => {
        console.log('child process exited with code ' + code.toString())
    })
};

let Printer = {};

Printer.printError = function (message) {

    if (message) {
        console.log(chalk.redBright('Ups! Error occurred - ' + message));
    } else {
        console.log(chalk.redBright('Ups! Error occurred - we got report and send you email with link to issue'));
    }

};

Printer.printJSQL = function (callback) {

    console.log(chalk.blueBright("       _    _____    ____    _      "));
    console.log(chalk.blueBright("      | |  / ____|  / __ \\  | |     "));
    console.log(chalk.blueBright("      | | | (___   | |  | | | |     "));
    console.log(chalk.blueBright("  _   | |  \\___ \\  | |  | | | |     "));
    console.log(chalk.blueBright(" | |__| |  ____) | | |__| | | |____ "));
    console.log(chalk.blueBright("  \\____/  |_____/   \\___\\_\\ |______|"));
    console.log(chalk.blueBright("                                    "));

    callback();

};

Printer.showHelp = function () {

    console.log('Available parameters:');
    console.log(chalk.blueBright('--port') + ' Server local port');
    console.log('For more details see ' + chalk.bold('https://jsql.it/jsql-server-docs'));

};

Printer.showVersion = function () {
    console.log('JSQL Server version is ' + chalk.blueBright('0.1.0'));
};

let Executor = {};

Executor.getParameters = function (args, cwd) {

    if (cwd === '\\' || cwd === '/') {
        cwd = '';
    }

    let params = {
        port: '9192',
        version: false,
        debug: false,
        cwd: cwd
    };

    for (let i = 0; i < args.length; i++) {

        if (args[i].indexOf("--") === 0) {

            let parameterName = args[i].substring(0, args[i].indexOf('=') > -1 ? args[i].indexOf('=') : args[i].length);
            parameterName = parameterName.replace('--', '').trim();

            let parameterValue = args[i].substring(args[i].indexOf('=') + 1, args[i].length).trim();

            switch (parameterName) {
                case 'port':
                    params[parameterName] = parameterValue;
                    break;
                case 'version':
                case 'debug':
                case 'help':
                    params[parameterName] = true;
                    break;
            }

        }

    }

    return params;

};

Executor.execCli = function (args, cwd) {

    let params = Executor.getParameters(args, cwd);

    if (params.debug) {
        console.log('params : ', params);
    }

    let opsys = process.platform + "";
    let system = "";

    if (params.debug) {
        console.log('opsys', opsys);
    }

    if (opsys === "darwin" || opsys === "linux") {
        system = "linux";
    } else if (opsys === "win32" || opsys === "win64") {
        system = "windows";
    }

    if (params.debug) {
        console.log('system', system);
    }

    if (params.debug) {
        console.log('cwd', params.cwd);
    }

    let dir = path.normalize(cwd + '/jar/jsql-api-provider');
    let cmd = ' -jar ' + dir;

    if (system === 'linux') {
        cmd = '/usr/bin/java' + cmd;
    } else {
        cmd = 'java' + cmd + ".jar";
    }

    if (params.debug) {
        console.log('cmd', cmd);
    }

    if (params.debug) {
        console.log('resolve ' + require.resolve('jsql-server'));
    }

    execProcess(cmd);

};

Executor.execCommand = function (args, cwd, welcomeMessage) {

    if (welcomeMessage) {
        Printer.printJSQL(init);
    }

    function init() {

        let params = Executor.getParameters(args, cwd);

        if (params.help) {
            Printer.showHelp();
        } else if (params.version) {
            Printer.showVersion();
        } else {
            Executor.execCli(args, cwd);
        }

    }

};

let packagePath = path.dirname(require.resolve("jsql-server/package.json"));
Executor.execCommand(process.argv, path.normalize(packagePath), true);