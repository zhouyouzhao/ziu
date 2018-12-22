module.exports = {
    tempDir: '.ziu-templates',
    githubUseName: 'ziu-templates',
    // listApi: 'https://gitee.com/api/v5/users/ziu-templates/repos',
    listApi: 'https://api.github.com/users/ziu-templates/repos?access_token=1d462a8fc8cde3885759730951fce394961e0b69',
    ziuInfoApi: 'https://registry.npmjs.org/ziu',
    lintType: ['standard', 'airbnb'],
    commanderType: {
        cnpm: {
            options: ['--registry=https://registry.npm.taobao.org']
        }
    }
};