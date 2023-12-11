module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/eslint-plugin-ftgp/main", "plugin:import/recommended"],
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module"
	},
	rules: {
		"no-console": ["error"],
		"quotes": ["error", "double"],
		"ftgp/require-class-comment": 0,
		"import/no-absolute-path": "error",
		"import/no-self-import": "error",
		"import/no-useless-path-segments": "error",
		"import/no-cycle": "error",
	}
};
