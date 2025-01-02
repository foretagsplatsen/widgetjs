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
			"import/no-anonymous-default-export": "off",
			"jsdoc/check-param-names": "off",
			"jsdoc/check-tag-names": "off",
			"jsdoc/check-types": "off",
			"jsdoc/match-description": "off",
			"jsdoc/no-undefined-types": "off",
			"jsdoc/require-hyphen-before-param-description": "off",
			"jsdoc/require-jsdoc": "off",
			"jsdoc/require-param": "off",
			"jsdoc/require-param-description": "off",
			"jsdoc/require-param-type": "off",
			"jsdoc/require-returns": "off",
			"jsdoc/tag-lines": "off",
			"no-magic-numbers": "off",
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
			"sonarjs/no-duplicate-string": "off",
			"sonarjs/no-nested-functions": ["error", { threshold: 6 }],
		},
	},
	{
		name: "Disable import/no-unused-modules as it's flaky",
		rules: {
			"import/no-unused-modules": "off",
		},
	},
];
