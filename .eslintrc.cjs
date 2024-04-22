/* eslint-env commonjs */

module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	// workaround for plugin:@foretagsplatsen/main enabling many
	// unwanted environments:
	env: {
		browser: true,
	},
	ignorePatterns: ["sample", "coverage"],
	rules: {
		"import/no-unused-modules": [
			"error",
			{
				unusedExports: true,
				missingExports: true,
				ignoreExports: [
					// List of files exporting stuff which are not imported:
					"src/widgetjs.js",
					// List of files not exporting anything:
					"**/.eslintrc.cjs",
					"./babel.config.cjs",
					"src/router/optionalParameterSegment.js",
					"src/router/staticSegment.js",
				],
			},
		],
	},
};
