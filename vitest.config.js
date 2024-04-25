import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		restoreMocks: true,
		environment: "jsdom",
		include: ["src/test/**/*Test.js"],

		coverage: {
			enabled: true,
			include: ["src/**", "!src/test/**", "!src/widgetjs.js"],
		},
	},
});
