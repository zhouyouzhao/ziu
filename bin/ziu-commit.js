#!/usr/bin/env node
'use strict';

/**
 * git commit信息
 */

const chalk = require('chalk'),
  cli = require('commander'),
  gitZm = require('../git/gitZm');

/**
 * Usage.
 */

cli
  .usage('or ziu commit');
/**
 * Help.
 */

cli.on('--help', function() {
  tip();
});

function tip() {
  console.log(`  ${chalk.cyan('★')} First use "git add [options]"\n`);
  console.log('\n  Examples:');
  console.log();
  console.log('    $ ziu commit');
  console.log();
}

gitZm();

cli.parse(process.argv);
