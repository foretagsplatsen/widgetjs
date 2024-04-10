/* eslint-env node */

module.exports = {
	overrides: [
		{
			env: {
				test: { plugins: ["@babel/plugin-transform-modules-commonjs"] },
			},
		},
	],
};
