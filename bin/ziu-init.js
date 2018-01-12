#!/usr/bin/env node

/**
 * 创建项目指令
 */

let chalk = require('chalk'),
    path = require('path'),
    exists = require('fs').existsSync,
    rm = require('rimraf').sync,
    cli = require('commander'),
    request = require('request'),
    userHome = require('user-home'), // 用户根目录
    inquirer = require('inquirer'), // 交互式命令
    download = require('download-git-repo'),
    ora = require('ora'),
    conf = require('../config/index.js'),
    checkVersion = require('../lib/checkVersion.js'),
    promptUseMeta = require('../lib/promptUseMeta.js'),
    createFile = require('../lib/createFiles.js'),
    match = require('minimatch'),
    tplRender = require('consolidate').handlebars.render, // consolidate 模板引擎集合
    handlebars = require('handlebars'),
    render = require(path.resolve(__dirname, '../tpl/render.js')),
    pipe = require('../lib/pipe.js');

/**
 * Usage.
 */

cli
    .usage('[project-name]')
    .option('-c, --clone', 'use git clone(暂未开通)');

/**
 * Help.
 */

cli.on('--help', function () {
    tip();
});

function tip () {
    console.log('\n  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new vue project with an official template'));
    console.log('    $ ziu init vue my-project');
    console.log();
    console.log(chalk.gray('    # create a new usual project with an official template'));
    console.log('    $ ziu init usual my-project');
    console.log();
}
/**
 * process.argv 用户输入的参数列表
 * cli.parse(process.argv) 转换成对象
 */
let args = cli.parse(process.argv).args;

/**
 * 没有使用参数提示
 */

if (args.length <= 0) {
    cli.help();
    // console.log('  Please use "ziu init -h" to show more\n\n');
    process.exit();
}

console.log('  Loading...\n\n')

/**
 * [homeDir 用户本地根目录]
 */
let homeDir = userHome;

let projectName = args[0];

/**
 * 未传入项目名字或者传入'.'，判断是否在当前文件夹
 */
let isCurrentPlace = !projectName || projectName === '.';
/**
 * 如果在当前文件夹，则获取文件夹名称
 */
let fileName = isCurrentPlace ? path.relative('../', process.cwd()) : projectName;

/**
 * [toPath 目标目录]
 */
let toPath = path.resolve(projectName || '.');

if (exists(toPath)) {
    inquirer
        .prompt([
            {
                name: 'tip',
                type: 'confirm',
                message: isCurrentPlace ? 'Generate project in current directory?' : 'Target directory exists. Continue?'
            }
        ])
        .then((answers) => {
            if (answers.tip) {
                choiceProjectType();
            }
        });
} else {
    choiceProjectType();
}


function choiceProjectType () {
    pipe({
        data: {
            typeList: [],
            selectType: '',
            tempDir: '',
            gitName: '',
            gitUrls: {},
            githubUseName: conf.githubUseName
        }
    })
        .next(function () {
            /**
             * [获取支持的模板]
             */
            let _this = this,
                spinner = ora('get template ...').start();
            request({
                url: conf.listApi,
                timeout: 2 * 60 * 1000,
                headers: {
                    'User-Agent': _this.githubUseName
                }
            }, function (err, res, body) {
                spinner.stop();
                if (err) {
                    return _this.next(err);
                }
                let tpls = JSON.parse(body);
                if (Array.isArray(tpls)) {
                    let output = [],
                        tempUrl = {};
                    tpls.forEach((item) => {
                        tempUrl[item.name] = item.html_url;
                        output.push({
                            name: `  ${chalk.cyan('★')} ${chalk.greenBright(item.name)} - ${item.description}`,
                            value: item.name,
                            short: item.name
                        });
                    });
                    _this.gitUrls = tempUrl;
                    _this.typeList = output;
                    return _this.next();
                }
                _this.next(new Error('  empty ziu official templates'));
            });
        })
        .next(function () {
            /**
             * [用户选择类型]
             */
            inquirer
                    .prompt([{
                        name: 'typeChoice',
                        type: 'list',
                        message: 'place choice project type: ',
                        choices: this.typeList
                    }])
                    .then((answers) => {
                        this.selectType = answers.typeChoice;
                        this.next();
                    });
        })
        .next(function () {
            /**
             * [获取缓存文件夹]
             */
            this.tempDir = path.resolve(homeDir, conf.tempDir, this.selectType);
            /**
             * [获取模板名]
             */
            this.gitName = this.githubUseName + '/' + this.selectType;
            this.next();
        })
        .next(function () {
            /**
             * [检测版本是否可更新]
             */
            checkVersion(() => {
                this.next();
            });
        })
        .next(function () {
            /**
             * [下载模板]
             */
            let _this = this,
                spinner = ora('Download...').start();
            if (exists(_this.tempDir)) {
                rm(_this.tempDir);
            }
            download(_this.gitName, _this.tempDir, {clone: false}, function (err) {
                spinner.stop()
                if (err) {
                    let msg = 'Failed to download repo ' + _this.selectType + ': ' + err.message.trim();
                    console.log(chalk.red(msg));
                    _this.next(new Error(msg));
                }
                _this.next();
            });
        })
        .next(function () {
            /**
             * TODO: 
             * 渲染package.json文件
             * 复制模板到目标指定文件夹
             * 在指定文件夹安装依赖文件
             */
            promptUseMeta(this.tempDir, fileName, (data) => {
                console.log(this.tempDir);
                createFile(this.tempDir, toPath)
                .source(path.resolve(this.tempDir, './template/'))
                .init(function (metalsmith) {
                    render({
                        promptsData: {
                            name: 'ee',
                            description: 'A Vue.js project with ziu',
                            author: 'gary.zhou <gary.zhou@verystar.com> ',
                            build: 'standalone',
                            router: true,
                            lint: true,
                            lintConfig: 'standard',
                            unit: true,
                            runner: 'jest',
                            e2e: true
                        },
                        handlebars,
                        match,
                        metalsmith,
                        render: tplRender
                    });
                })
                .start()
                .end(() => {
                    console.log(666);
                });
            });
        })
        .start()
        .end(function () {
            process.exit();
        })
        .catch(function (err) {
            console.log(err);
        });
}

cli.parse(process.argv);
