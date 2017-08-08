const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: path.join(__dirname, './src/index.js'),
        vendor: ['axios', 'object-assign']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'errlogger.js',
        chunkFilename: '[name].js'
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
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.js",
            minChunks: Infinity,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                reduce_vars: false,
            },
            output: {
                comments: false,
            },
            sourceMap: true,
        }),
    ]
}