#!/usr/bin/env node

let ziuInfo = require('../lib/info.js'),
  ziuList = require('../bin/ziu-list.js'),
  chalk = require('chalk'),
  exec = require('child_process').spawn,
  cli = require('commander'),
  compressPictures = require('../lib/compressPictures');

ziuInfo();
cli.Command.prototype.missingArgument = function(name) {
  cli.rawArgs = cli.rawArgs || [];
  let commander = cli.rawArgs[2] || cli.name();
  process.stdout.write(chalk.red("error: missing required argument " + name));
  process.stdout.write(chalk.red('\nInvalid command: See --help for a list of available commands.'));
  console.log(`\nPls use "ziu ${commander} -h/--help" to show help\n`);
  process.exit(1);
};

cli
  .version(`print ziu Version: ${require('../package').version}`)
  .usage('<command> [options]')
  .option('-v, --version', `print ziu Version: ${require('../package').version}`)
  .command('init', 'generate a new project from a template')
  .command('commit', 'use angular commit message')
  .command('cl', 'generate a changelog from git metadata')
  .command('avd', 'start android virtual device')
  .command('uia', 'start uiautomatorviewer')
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

/**
 * 压缩图片
 */
cli
  .command('img <dir>')
  .description('Compress pictures')
  .usage('<dir> [options] <quality>')
  .option('-q, --quality [quality]', 'Compress pictures quality', 70)
  .action((dir, opts) => {
    // 调用压缩图片方法
    compressPictures({
      dir: dir,
      quality: opts.quality
    });
  })
  .on('--help', () => {
    console.log('\n\n  Available ziu img <dir> [options] <quality>\n');
    console.log(`  ${chalk.cyan('★')} <dir> - A folder for saving pictures\n`);
    console.log(`  ${chalk.cyan('★')} [options] - use -q/--quality (compress level)\n`);
    console.log(`  ${chalk.cyan('★')} <quality> - required number!(range: 1 ~ 100[80 is the best])\n\n`);
    console.log('  Examples:\n');
    console.log('    # "." is in current directory\n');
    console.log('    $ ziu img . -q 75\n');
  });

/**
 * git commit信息
 */
// cli
//   .command('commit')
//   .description('Angular Commit Message')
//   .action(() => {
//     gitZm();
//   })
//   .on('--help', () => {
//     console.log('\n\n  Available ziu commit \n');
//     console.log(`  ${chalk.cyan('★')} First use "git add [options]"\n`);
//     console.log('  Examples:\n');
//     console.log('    $ ziu commit\n');
//   });

/**
 * 启动安卓模拟器
 */
cli
  .command('avd')
  .description('start android virtual device')
  .usage('<name> [options]')
  .option('-l, --list', 'List available Android Virtual Device')
  .action((opts) => {
    if (typeof opts === 'object') {
      if (opts.list) {
        return exec(
          'emulator',
          ['-list-avds'], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
          });
      } else {
        avdHelp();
      }
    } else {
      if (opts) {
        exec(
          'emulator',
          ['-netdelay', 'none', '-netspeed', 'full', '-avd', opts], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
          });
      } else {
        avdHelp();
      }
    }
  })
  .on('--help', () => {
    avdHelp();
  });

function avdHelp() {
  console.log('\n\n  Available ziu avd <name> [options]\n');
  console.log(`  ${chalk.cyan('★')} <name> - Android Virtual Device Name\n`);
  console.log(`  ${chalk.cyan('★')} [options] - List Android Virtual Device Name\n`);
  console.log('  Examples:\n');
  console.log('    $ ziu avd test\n');
  console.log('    $ ziu avd -l\n');
}


/**
 * 启动uiautomatorviewer
 */
cli
  .command('uia')
  .description('start uiautomatorviewer')
  .action(() => {
    exec(
      'uiautomatorviewer',
      [], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true
      });
  })
  .on('--help', () => {
    console.log('\n\n  Available ziu uia \n');
    console.log('  Examples:\n');
    console.log('    $ ziu uia\n');
  });

cli.parse(process.argv);
