module.exports = {
    entry: {
        voteCookies: './default/js/jquery.voteCookies.js'
    },
    output: {
        path: __dirname + '/build',
        filename: 'jquery.[name].js',
        library: 'voteCookies',
        libraryTarget: 'umd'
    }
};