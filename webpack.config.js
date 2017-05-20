const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv-webpack');

module.exports = function () {
    return {
        entry: {
            bundle: path.join(__dirname,'index.js') 
        },
        output: {
            path: path.join(__dirname, '/dist' ),
            filename:'[name].js' 
        },
        node: {
            fs: 'empty',
            __dirname: true,
            __filename: true,
            net: 'empty',
            dns: 'empty' 
        },
        devServer: {
            contentBase: './',
            port: 3001
        },
        module: {
            rules: [
              { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
              { test: /\.css$/, loader: 'style-loader!css-loader' },
              { test: /\.(png|jpg)$/, loader: 'file-loader', options:{name: 'assets/[name].[ext]'}},
              { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
              { test: /\.(eot|ttf|svg)$/, loader: 'file-loader'},
              { test: /\.(html)$/, loader: 'html-loader'}
            ]
        },
        resolve: {
            alias: {
                "~":path.resolve("./")
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({template: 'index.html'}),
            new dotenv()
        ]
    }
};