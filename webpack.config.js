module.exports = {
    entry: {
        voteCookies: './src/js/jquery.voteCookies.js'
    },
    output: {
        path: __dirname + '/build',
        filename: 'jquery.[name].js',
        library: 'voteCookies',
        libraryTarget: 'umd'
    }
};