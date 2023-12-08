module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module"
	},
	rules: {
		"quotes": ["error", "double"],
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
					"webpack*"
				],
			},
		]
	}
};
