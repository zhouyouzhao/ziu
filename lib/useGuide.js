/**
 * 安装package.json中的依赖包结束后
 * 显示使用命令
 */
let chalk = require('chalk');
module.exports = function (data) {
    const message = 
    `\n# ${chalk.green('Project initialization finished!')}\n` +
    '# ======================== \n\n' +
    '    To get started: \n\n' +
    (data.isCurrentPlace ? '' : `       ${chalk.yellow(`cd ${data.fileName}\n`)}`) + 
    `       ziu dev\n\n` +
    '    To get build: \n\n' +
    (data.isCurrentPlace ? '' : `       ${chalk.yellow(`cd ${data.fileName}\n`)}`) + 
    `       ziu build\n\n`;
    console.log(message);
};
