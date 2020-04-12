const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    // 入口点配置
    entry: {
        // 用于额外引入的第三方模块
        vendor: [
            'axios',
        ]
    },
    // 输出配置
    output: {
        path: path.join(__dirname, '../src/vendor'),
        filename: '[name].dll.js',
        library: '[name]_[hash]' // vendor.dll.js中暴露出的全局变量名
    },
    plugins: [
        // 清除之前的dll文件
        new CleanWebpackPlugin(),
        // 设置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        // manifest.json 描述动态链接库包含了哪些内容
        new webpack.DllPlugin({
            path: path.join(__dirname, '../src/vendor', '[name]-manifest.json'),
            // 保持与 output.library 中名称一致
            name: '[name]_[hash]',
            // 上下文：node执行的文件夹
            context: process.cwd()
        })
    ],
    optimization: {
        minimize: true
    }
};
