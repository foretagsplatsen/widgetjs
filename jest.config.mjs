/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
	restoreMocks: true,

	testRegex: ["./src/test/.*Test.js"],

	setupFilesAfterEnv: ["./src/test/setup.js"],

	// Use "jsdom" instead of "node" to have a "window" object in the
	// global environment:
	testEnvironment: "jsdom",

	collectCoverage: true,
	collectCoverageFrom: ["./src/**", "!./src/test/**", "!./src/widgetjs.js"],
	coverageDirectory: "coverage",

	// Files from node_modules/ are normally not transformed but we
	// need to convert some of them anyway as they only provide ES
	// modules which is not compatible with Jest
	// https://jestjs.io/docs/ecmascript-modules:
	transformIgnorePatterns: ["/node_modules/(?!(klassified|yaem))"],
};

export default config;
