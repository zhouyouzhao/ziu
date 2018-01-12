#!/usr/bin/env node

let ziuInfo = require('../lib/info.js'),
    ziuList = require('../bin/ziu-list.js'),
    chalk = require('chalk'),
    cli = require('commander');



/**
 * [测试]
 */
let createFile = require('../lib/createFiles.js');
let path = require('path');
let match = require('minimatch');
var tplRender = require('consolidate').handlebars.render; // consolidate 模板引擎集合
var handlebars = require('handlebars');
let render = require(path.resolve(__dirname, '../tpl/render.js'));

// createFile(path.resolve(__dirname, '../tpl/'), path.resolve(__dirname, '../test/'))
//         .directory(path.resolve(__dirname, '../tpl/template/'))
//         .init(function (metalsmith) {
//             render({
//                 promptsData: {
//                     name: 'ee',
//                     description: 'A Vue.js project with ziu',
//                     author: 'gary.zhou <gary.zhou@verystar.com> ',
//                     build: 'standalone',
//                     router: true,
//                     lint: true,
//                     lintConfig: 'standard',
//                     unit: true,
//                     runner: 'jest',
//                     e2e: true
//                 },
//                 handlebars,
//                 match,
//                 metalsmith,
//                 render: tplRender
//             });
//         })
//         .use((files) => {
//             console.log(Object.keys(files));
//         })
//         .start()
//         .end(() => {
//             console.log(666);
//         });
// require('../lib/promptUseMeta')('../tpl/', 'ee', function (data) {
//     console.log(data);
//     createFile(path.resolve(__dirname, '../tpl/'), path.resolve(__dirname, '../test/'))
//         .source(path.resolve(__dirname, '../tpl/template/'))
//         .use(function (files, metalsmith, next) {
//             render({
//                 promptsData: data, 
//                 files,
//                 metalsmith,
//                 render: tplRender,
//                 next,
//             });
//         })
//         .start()
//         .end(() => {
//             console.log(666);
//         });
// });

// ------------------- /


ziuInfo();

cli
    .version(`print ziu Version: ${require('../package').version}`)
    .usage('<command> [options]')
    .command('init', 'generate a new project from a template')
    // .command('list', 'list available official templates')
    // .command('mock', 'run local server')
    // .command('dev', 'run development environment')
    // .command('test', 'run test environment')
    // .command('build', 'run build environments')
    // .command('deploy', 'deploy application')

/**
 * 列出所有的可用模板
 * 模板仓库：https://gitee.com/ziu-templates
 */
cli
    .command('list')
    .description('list available official templates')
    .action(() => {
        ziuList();
    });

/**
 * 本地服务器
 */
cli
    .command('mock')
    .description('run local server')
    .action(() => {
        console.log('mock');
    });

/**
 * 启动开发环境
 */
cli
    .command('dev')
    .description('run development environment')
    .action(() => {
        console.log('dev');
    });

/**
 * 启动测试环境
 */
cli
    .command('test')
    .description('run test environment')
    .action(() => {
        console.log('test');
    });

/**
 * 启动正式环境
 */
cli
    .command('build')
    .description('run build environments')
    .action(() => {
        console.log('build');
    });

/**
 * 启动正式环境
 */
cli
    .command('deploy')
    .description('deploy application')
    .usage('<options> <type>')
    .option('-e, --env [env]', 'deploy environment')
    .action((opts) => {
        if (!opts.env) {
            console.log('\n  Pls use "ziu deploy -h" to show help\n');
            console.log('  Examples:\n');
            console.log('    $ ziu deploy -e test\n');
            throw new Error('deploy need environment');
        }
        console.log(opts.env, ' -----> deploy');
    })
    .on('--help', () => {
        console.log('\n\n  Available ziu official env:\n');
        console.log(`  ${chalk.cyan('★')} test - deploy test environment\n`);
        console.log(`  ${chalk.cyan('★')} staging - deploy staging environment\n`);
        console.log(`  ${chalk.cyan('★')} build - deploy build environment\n\n`);
        console.log('  Examples:\n');
        console.log('    $ ziu deploy -e test\n');
    });


cli.parse(process.argv);
