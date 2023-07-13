module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	rules: {
		"jsdoc/require-param-description": "off", // we should fix them at some point
		"jsdoc/require-param-type": "off", // we should fix them at some point
		"jsdoc/check-tag-names": "off", // we should fix them at some point
		"jsdoc/require-returns-check": "off", // we should fix them at some point
		"import/no-unused-modules": [
			"error",
			{
				unusedExports: true,
				missingExports: true,
				// List of files not exporting anything:
				ignoreExports: [
					".eslintrc.js",
					"webpack.*.js",
					"src/router/optionalParameterSegment.js",
					"src/router/staticSegment.js",
					"src/test/**/*.js",
				],
			},
		],
		"no-shadow": "off", // we should fix them at some point
	},
};
