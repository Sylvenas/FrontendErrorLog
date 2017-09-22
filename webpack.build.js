const path = require('path');
const webpack = require('webpack')

module.exports = {
    entry: [
        path.join(__dirname, './src/index.ts'),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'frontErrLog.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                loader: require.resolve('ts-loader'),

            },
        ]
    },
    plugins: [
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