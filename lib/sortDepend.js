/**
 * 将依赖库按照升序排列
 */
let path = require('path'),
    fs = require('fs');
module.exports = function (toPath) {
    let pkgPath = path.resolve(toPath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
        return console.error(chalk.red('sortDepend - Waring: No package.json'));
    }

    let pkg = JSON.parse(fs.readFileSync(pkgPath));
    pkg.dependencies = sort(pkg.dependencies || {});
    pkg.devDependencies = sort(pkg.devDependencies || {});
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
};

function sort (obj) {
    let temp = {};
    Object.keys(obj)
        .sort()
        .forEach((item) => {
            temp[item] = obj[item];
        });
    return temp;
}
