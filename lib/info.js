let chalk = require('chalk'),
    packageJson = require('../package');

function printInfo () {
    let info = [
        '',
        '   〓〓〓〓〓      〓      〓〓    〓〓',
        '        〓〓      〓〓     〓〓    〓〓',
        '      〓〓        〓〓     〓〓    〓〓',
        '    〓〓          〓〓     〓〓    〓〓',
        '   〓〓〓〓〓     〓〓     〓〓〓〓〓〓',
    ].join('\n');
    process.stdout.write(`\n        欢迎使用ziu前端构建工具\n${chalk.green(info)}\n\n   Version: ${packageJson.version}\n\n`);
}

module.exports = printInfo;
