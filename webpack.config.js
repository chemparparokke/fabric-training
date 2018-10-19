const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/scripts'),
    },
    module: {
        rules: [{
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
            ]
        }]
    },
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin({
            filename: '../stylesheets/[name].css?ver=[contenthash:8]'
        }),
    ]
};
