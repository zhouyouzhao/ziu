/**
 * 如果选择eslint，则在项目依赖包安装完成时，使用eslint格式化代码
 */

let exec = require('child_process').spawn,
    chalk = require('chalk'),
    conf = require('../config/index.js');

module.exports = function (data, toPath, next = () => {}) {
    if (!data.lint || conf.lintType.indexOf(data.lintConfig) <= -1) {
        return next();
    }
    eslintMsg();
    exec = exec('npm', ['run', 'lint', '--', '--fix'], {
        cwd: toPath,
        shell: true,
        stdio: 'inherit'
    });
    exec.on('exit', function () {
        next();
    });
};

/**
 * 提示信息
 */
function eslintMsg () {
    let msg1st = chalk.green('\n# Running eslint --fix to comply with chosen preset rules...\n'),
        msg2nd = '# ===================================\n';
    console.log(msg1st + msg2nd);
}

