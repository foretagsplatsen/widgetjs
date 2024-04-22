/* eslint-env commonjs */

module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	// workaround for plugin:@foretagsplatsen/main enabling many
	// unwanted environments:
	env: {
		browser: true,
		es2024: true,
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
					"./vitest.config.js",
					// List of files not exporting anything:
					"**/.eslintrc.cjs",
					"src/router/optionalParameterSegment.js",
					"src/router/staticSegment.js",
				],
			},
		],
	},
	settings: {
		"import/resolver": {
			exports: {},
			node: true,
		},
	},
};
