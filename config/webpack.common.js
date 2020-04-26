const path = require("path");
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 打包入口
    entry: {
        app: path.resolve(__dirname, "../src/index.ts")
    },
    // webpack插件
    plugins: [
        // 读取.env 文件的配置到process.env中
        new Dotenv(),
        // 热加载时直接返回更新文件名
        new webpack.NamedModulesPlugin(),
        // 模块热替换插件
        new webpack.HotModuleReplacementPlugin(),
        // 自动全局引用
        new webpack.ProvidePlugin({
            h: '@/lib/h.ts'
        }),
        // 复制插件
        new CopyWebpackPlugin([
            {
                from: "./public",
                to: "../dist",
                ignore: ['.*']
            }, {
                from: "./src/vendor/vendor.dll.js",
                to: "../dist"
            }
        ]),
        // 简单创建 HTML 文件，用于服务器访问
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    // 不打包而是直接从环境请求的模块配置
    externals: {
        //jquery: 'jQuery',
        // lodash : {
        //     commonjs: "lodash",
        //     amd: "lodash",
        //     root: "_"
        // },
    },
    // 解析模块请求的选项
    resolve: {
        // 使用的扩展名
        extensions: [ '.tsx', '.ts', '.mjs', '.js', '.jsx' ],
        // 别名配置
        alias: {
            "@": path.resolve(__dirname, "../src/")
        },
    },
    // 输出配置
    output: {
        // 输出目标路径
        path: path.resolve(__dirname, "../dist"),
        // 输出的文件名模板
        filename: "[name].[hash:8].bundle.js",
        // 导出库的名称（可选）
        library: 'hakuWorkflowDesign',
    },
    // 性能相关提示配置
    performance: {
        // 提示方式
        hints: "warning",
        // 入口点最大体积警告（2mb）
        maxEntrypointSize: 2000000,
        // 单个资源最大体积警告（2mb）
        maxAssetSize: 2000000
    }
};