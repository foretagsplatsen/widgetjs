const globals = require("globals");

const finsitPlugin = require("@foretagsplatsen/eslint-plugin");

module.exports = [
	{
		name: "global ignores",
		ignores: ["dist/", "coverage/", "sample/"],
	},
	...finsitPlugin.configs.main,
	{
		name: "globals",
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		name: "global rules",
		rules: {
			"import/no-unused-modules": [
				"error",
				{
					unusedExports: true,
					missingExports: true,
					ignoreExports: [
						// List of files exporting stuff which are not imported:
						"src/widgetjs.js",
						"vitest.config.js",
						"eslint.config.cjs",
						".eslintrc.cjs",
						// List of files not exporting anything:
						"src/router/optionalParameterSegment.js",
						"src/router/staticSegment.js",
					],
				},
			],
		},
	},
	{
		name: "test rules",
		files: ["src/test/**/*.js"],
		rules: {
			"import/no-unused-modules": [
				"error",
				{
					unusedExports: true,
					missingExports: true,
					// List of files not exporting anything:
					ignoreExports: ["**/*Test.js"],
				},
			],
		},
	},
	{
		name: "Disable import/no-unused-modules as it's flaky",
		rules: {
			"import/no-unused-modules": "off",
		},
	},
];
