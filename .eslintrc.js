module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
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
					"**/.eslintrc.js",
					"webpack*",
					"src/router/optionalParameterSegment.js",
					"src/router/staticSegment.js",
				],
			},
		],
	},
};
