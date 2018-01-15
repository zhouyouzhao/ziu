#!/usr/bin/env node

let ziuInfo = require('../lib/info.js'),
    ziuList = require('../bin/ziu-list.js'),
    chalk = require('chalk'),
    exec = require('child_process').spawn,
    cli = require('commander');

ziuInfo();

cli
    .version(`print ziu Version: ${require('../package').version}`)
    .usage('<command> [options]')
    .option('-v, --version', `print ziu Version: ${require('../package').version}`)
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
        console.log('Development Environment Starting...');
        exec('npm', ['run', 'dev'], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
        });
    });

/**
 * 启动测试环境
 */
cli
    .command('test')
    .description('run test environment')
    .action(() => {
        console.log('Testing Environment Starting...');
        exec('npm', ['run', 'test'], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
        });
    });

/**
 * 启动正式环境
 */

cli
    .command('build')
    .description('run build environments')
    .action(() => {
        console.log('Build Environment Starting...');
        exec('npm', ['run', 'build'], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
        });
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
