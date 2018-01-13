/**
 * 安装依赖
 */

let exec = require('child_process').spawn,
    conf = require('../config/index.js')
    chalk = require('chalk');

module.exports = function (promptsData, toPath, cb = () => {}) {
    installMsg();
    console.log('Installing...');
    let options = promptsData.commanderType === 'cnpm' ? conf.commanderType[promptsData.commanderType].options : [];
    
    installDependencies('npm', ['install'].concat(options), {
        cwd: toPath
    }, function () {
        // installEndMsg();
        cb();
    });
};

/**
 * 提示安装信息
 */
function installMsg () {
    let msg1st = chalk.green('\n# Installing project dependencies ...\n'),
        msg2nd = '# ========================\n';
    console.log(msg1st + msg2nd);
}

/**
 * 执行安装
 */

function installDependencies (cmd, args, options, cb = () => {}) {
    exec = exec(cmd, args, Object.assign({
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true,
    }, options));
    exec.on('exit', () => {
        cb();
    });
}

/**
 * 安装结束信息
 */
function installEndMsg () {
    let msg1st = '\n  # ===================================\n',
        msg2nd = chalk.green('  # Project initialization finished!\n');
    console.log(msg1st + msg2nd);
}
