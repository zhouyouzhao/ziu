'use strict';
const path = require('path'),
  exists = require('fs').existsSync,
  bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;

module.exports = function(config = {
  path: 'cz-conventional-changelog'
}) {
  let cliPath = '',
    globalCliPath = path.join(process.cwd(), './node_modules/commitizen'),
    localCliPath = path.join(__dirname, '../node_modules/commitizen');
  cliPath = globalCliPath;
  if (exists(localCliPath)) {
    cliPath = localCliPath;
  }
  bootstrap({
    cliPath,
    config
  });
}
