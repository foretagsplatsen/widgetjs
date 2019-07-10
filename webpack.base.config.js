const path = require("path");
const webpack = require("webpack");
const aliases = require("./webpack.aliases.js");

let config = {
	mode: "development",
	devtool: "cheap-eval-source-map",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "widgetjs.js",
		libraryTarget: "umd",
		library: "widgetjs"
	},
	resolve: {
		modules: [path.resolve(__dirname, "js"), "node_modules"],
		alias: aliases
	},
	plugins: [
		new webpack.ProvidePlugin({
			"$": "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]
};

module.exports = config;
