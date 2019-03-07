#!/usr/bin/env node
'use strict';

const path = require('path');
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;
console.log(444444);
bootstrap({
  cliPath: path.join(__dirname, '../node_modules/commitizen')
});