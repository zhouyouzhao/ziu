module.exports = {
    tempDir: '.ziu-templates',
    githubUseName: 'ziu-templates',
    // listApi: 'https://gitee.com/api/v5/users/ziu-templates/repos',
    listApi: 'https://api.github.com/users/ziu-templates/repos?access_token=def57247cee8cef41dcbfa4f24cfc084092d3fe7',
    ziuInfoApi: 'https://registry.npmjs.org/ziu',
    lintType: ['standard', 'airbnb'],
    commanderType: {
        cnpm: {
            options: ['--registry=https://registry.npm.taobao.org']
        }
    }
};