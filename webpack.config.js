const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");


const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const monacoOptions = {
	filename: "[name].monaco.worker.js",
	languages: [
		"css",
		"html",
		"javascript",
		"json",
		"markdown",
		"scss",
		"typescript"
	]
};

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: [
									'./theme',
									'./node_modules'
								]
							}
						}
					}
				]
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[name].[id].css"
		}),
		new MonacoWebpackPlugin(monacoOptions),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require("cssnano"),
			cssProcessorPluginOptions: {
				preset: ["default", { discardComments: { removeAll: true } }]
			},
			canPrint: true
		})
	].filter(Boolean),
	devtool: prod ? false : 'source-map'
};
