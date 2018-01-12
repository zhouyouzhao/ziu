/**
 * 检测工具是否可以使用
 */

let semver = require('semver'),
    chalk = require('chalk'),
    request = require('request'),
    conf = require('../config/index.js'),
    packageJson = require('../package.json');

module.exports = function (cb) {
    /**
     * 检测package.json中要求的node版本是否符合
     */
    if (!semver.satisfies(process.version, packageJson.engines.node)) {
        return console.log(chalk.red(
            '  You must upgrade node to >=' + packageJson.engines.node + '.x to use ziu'
        ));
    }
    request({
        url: conf.ziuInfoApi,
        timeout: 2000
    }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            let latestVersion = JSON.parse(body)['dist-tags'].latest,
                localVersion = packageJson.version;
            if (semver.lt(localVersion, latestVersion)) {
                console.log(chalk.yellow('  A newer version of ziu is available.'))
                console.log()
                console.log('  latest:    ' + chalk.green(latestVersion))
                console.log('  installed: ' + chalk.red(localVersion))
                console.log()
            }
        }
        typeof cb === 'function' && cb();
    });
};
