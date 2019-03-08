'use strict';
const path = require('path');
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;

module.exports = function(config = {
  path: 'cz-conventional-changelog'
}) {
  bootstrap({
    cliPath: path.join(__dirname, '../node_modules/commitizen'),
    config
  });
}
