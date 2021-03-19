import { resolve } from "path";

export default async function ExampleModule(moduleOptions) {
	this.nuxt.hook("modules:done", (arg) => {
		this.addPlugin({
			src: resolve(__dirname, "plugin.js"),
			fileName: "plugin.js",
			options: { ...moduleOptions, ...this.options },
		});
	});
}

// REQUIRED if publishing the module as npm package
module.exports.meta = require("../package.json");
