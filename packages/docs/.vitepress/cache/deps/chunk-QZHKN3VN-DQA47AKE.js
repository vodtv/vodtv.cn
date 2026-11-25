import { B as __name } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-QZHKN3VN.mjs
var ImperativeState = class {
	/**
	* @param init - Function that creates the default state.
	*/
	constructor(init) {
		this.init = init;
		this.records = this.init();
	}
	static {
		__name(this, "ImperativeState");
	}
	reset() {
		this.records = this.init();
	}
};
export { ImperativeState as t };
