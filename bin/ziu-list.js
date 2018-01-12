#!/usr/bin/env node

/**
 * 获取ziu中支持的模板
 * 请求GitOs上ziu-templates中存放的模板仓库数量
 */

let request = require('request'),
    chalk = require('chalk'),
    conf = require('../config/index.js');

module.exports = function () {
    request({
        url: conf.listApi,
        timeout: 2 * 60 * 1000,
        headers: {
            'User-Agent': 'ziu-templates'
        }
    }, function (err, res, body) {
        if (err) {
            return  process.stdout.write(chalk.red(err));
        }
        let tpls = JSON.parse(body);
        if (Array.isArray(tpls)) {
            let output = [];
            tpls.forEach((item) => {
                output.push(`  ${chalk.cyan('★')} ${chalk.greenBright(item.name)} - ${item.description}`);
            });
            process.stdout.write('  Available ziu official templates:\n\n');
            return process.stdout.write(output.join('\n') + '\n\n');
        }
        process.stdout.write(chalk.red('  empty ziu official templates'));
    });
}
