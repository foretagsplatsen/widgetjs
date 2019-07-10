const config = require("./webpack.base.config.js");

config.entry = "./src/widgetjs.js";
config.output.filename = "widgetjs.js";

module.exports = config;
