// eslint-disable-next-line consistent-default-export-name/default-export-match-filename -- This is the standard naming
const config = require("./webpack.base.config.js");

config.entry = "./src/test/tests.js";
config.output.filename = "jasmine.js";

module.exports = config;
