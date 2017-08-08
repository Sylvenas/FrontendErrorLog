const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        // 'webpack/hot/dev-server',
        // 'webpack/hot/only-dev-server',
        path.join(__dirname, './src/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'errlogger.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        compress: true,
        port: 3232,
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: require.resolve('babel-loader'),

            },
            {
                test: /\.(ts)$/,
                loader: require.resolve('ts-loader'),

            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
        }),
    ]
}