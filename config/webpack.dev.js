const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require('webpack');

// 开发环境配置
module.exports = merge(common, {
    // 运行环境：开发环境
    mode: 'development',
    // 配置source map添加方式
    // devtool: "inline-source-map",
    devtool: 'eval-source-map',
    // 配置模块
    module: {
        // 配置规则
        rules: [
            {
                test: /\.tsx?$/i,
                include: path.resolve(__dirname, "../src"),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env', {
                                        "targets": "last 3 Chrome versions"
                                    }
                                ]
                            ]
                        }
                    },
                    "ts-loader"
                ]
            }, {
                test: /\.m?jsx?$/i,
                include: path.resolve(__dirname, "../src"),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env', {
                                    "targets": "last 3 Chrome versions"
                                }
                            ]
                        ]
                    }
                },
            }, {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.scss$/i,
                include: path.resolve(__dirname, "../src"),
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    // 配置运行的node服务器
    devServer: {
        // 基础路径
        contentBase: "./dist",
        // 端口
        port: 4003,
        // 显示进度
        progress: false,
        // 静态路径
        contentBase: './public',
        // 内联模式：一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台
        inline: true,
        // 热替换
        hot: true,
        // 可使用ip打开
        // useLocalIp: true,

        clientLogLevel: 'none'
    },
    // webpack插件
    plugins: [
        // 允许在编译时配置的全局常量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev')
        })
    ],
    // 运行时控制台输出配置
    stats: {
        // 是否显示全部输出内容
        // all: true,
        // 是否显示打包资产信息
        assets: true,
        // 是否显示子节点信息
        children: false,
        // 信息输出类型
        logging: 'info',
        // 是否输出模块信息
        modules: false,
        // 是否输出文字颜色
        colors: true,
    }
});