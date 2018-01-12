/**
 * 获取git的用户名和信息
 */

let exec = require('child_process').execSync,
    name = '',
    email = '';

try {
    name = exec('git config --get user.name');
    email = exec('git config --get user.email');
} catch (e) {
    console.log('gitUser Error: ' + e);
}

module.exports = {
    name: getString(name),
    email: ' | Email:' + getString(email),
};

function getString (val) {
    return val && JSON.stringify(val.toString().trim()).slice(1, -1);
}
