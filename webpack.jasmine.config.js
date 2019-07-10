const config = require("./webpack.base.config.js");

config.entry = "./src/test/tests.js";
config.output.filename = "jasmine.js";

module.exports = config;
