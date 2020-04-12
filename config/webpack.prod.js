const path = require("path");
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 参数包含--report则会打开资源分布图
if (process.argv.includes('--report')) {
    common.plugins.push(new BundleAnalyzerPlugin());
}

// 生产环境配置
module.exports = merge(common, {
    // 运行环境：生产环境
    mode: 'production',
    // 配置source map添加方式
    // devtool: '#cheap-module-eval-source-map',
    devtool: 'source-map',
    // 配置模块
    module: {
        // 配置规则
        rules: [
            {
                test: /\.tsx?$/i,
                include: path.resolve(__dirname, "../src"),
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
            }, {
                test: /\.m?jsx?$/i,
                include: path.resolve(__dirname, "../src"),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            }, {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }, {
                test: /\.scss$/i,
                include: path.resolve(__dirname, "../src"),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    // 优化配置
    optimization: {
        // 仅含有 runtime 的入口起点包配置：默认
        runtimeChunk: true,
        // 分块策略配置
        splitChunks: {
            // 表明对那些块进行优化：非异步块
            chunks: 'initial',
            // 最小大小
            minSize: 30000,
            // 最小块数量
            minChunks: 1,
            // 按需加载时并行请求最大数量
            maxAsyncRequests: 5,
            // 入口点最大并行请求数
            maxInitialRequests: 3,
            // 生成名称的界定符
            automaticNameDelimiter: '-',
            // 拆分块的名称
            name: true
        }
    },
    // webpack插件
    plugins: [
        // 导出单个css文件
        new MiniCssExtractPlugin({
            // 文件名模板
            filename: '[name].[hash:8].css',
            // 分包文件名模板
            chunkFilename: '[id].[hash:8].css',
        }),
        // js压缩
        new UglifyJSPlugin({
            sourceMap: true
        }),
        // 排除不进行依赖的公共库（使用前需单独打包）
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require("../src/vendor/vendor-manifest.json")
        }),
        // 允许在编译时配置的全局常量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 生成html文件的配置
        new HtmlWebpackPlugin({
            // 配置模板
            template: "./index.html",
            // 引入文件
            files: {
                css: [],
                js: ["vendor.dll.js"],
            }
        }),
        // 用于清理构建(dist)文件夹
        new CleanWebpackPlugin()
    ],
});