import { a as GitGraphGeneratedModule, c as PacketGeneratedModule, d as TreemapGeneratedModule, f as __name, g as createDefaultSharedCoreModule, h as createDefaultCoreModule, i as CommonValueConverter, l as PieGeneratedModule, m as inject, n as AbstractMermaidValueConverter, o as InfoGeneratedModule, p as EmptyFileSystem, r as ArchitectureGeneratedModule, s as MermaidGeneratedSharedModule, t as AbstractMermaidTokenBuilder, u as RadarGeneratedModule } from "./chunk-FPAJGGOC-BHXv2XjH.js";
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-O7ZBX7Z2.mjs
var ArchitectureTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "ArchitectureTokenBuilder");
	}
	constructor() {
		super(["architecture"]);
	}
};
var ArchitectureValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "ArchitectureValueConverter");
	}
	runCustomConverter(rule, input, _cstNode) {
		if (rule.name === "ARCH_ICON") return input.replace(/[()]/g, "").trim();
		else if (rule.name === "ARCH_TEXT_ICON") return input.replace(/["()]/g, "");
		else if (rule.name === "ARCH_TITLE") return input.replace(/[[\]]/g, "").trim();
	}
};
var ArchitectureModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new ArchitectureTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new ArchitectureValueConverter(), "ValueConverter")
} };
function createArchitectureServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Architecture = inject(createDefaultCoreModule({ shared }), ArchitectureGeneratedModule, ArchitectureModule);
	shared.ServiceRegistry.register(Architecture);
	return {
		shared,
		Architecture
	};
}
__name(createArchitectureServices, "createArchitectureServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-S6J4BHB3.mjs
var GitGraphTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "GitGraphTokenBuilder");
	}
	constructor() {
		super(["gitGraph"]);
	}
};
var GitGraphModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new GitGraphTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new CommonValueConverter(), "ValueConverter")
} };
function createGitGraphServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const GitGraph = inject(createDefaultCoreModule({ shared }), GitGraphGeneratedModule, GitGraphModule);
	shared.ServiceRegistry.register(GitGraph);
	return {
		shared,
		GitGraph
	};
}
__name(createGitGraphServices, "createGitGraphServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-LBM3YZW2.mjs
var InfoTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "InfoTokenBuilder");
	}
	constructor() {
		super(["info", "showInfo"]);
	}
};
var InfoModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new InfoTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new CommonValueConverter(), "ValueConverter")
} };
function createInfoServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Info = inject(createDefaultCoreModule({ shared }), InfoGeneratedModule, InfoModule);
	shared.ServiceRegistry.register(Info);
	return {
		shared,
		Info
	};
}
__name(createInfoServices, "createInfoServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-76Q3JFCE.mjs
var PacketTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "PacketTokenBuilder");
	}
	constructor() {
		super(["packet"]);
	}
};
var PacketModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new PacketTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new CommonValueConverter(), "ValueConverter")
} };
function createPacketServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Packet = inject(createDefaultCoreModule({ shared }), PacketGeneratedModule, PacketModule);
	shared.ServiceRegistry.register(Packet);
	return {
		shared,
		Packet
	};
}
__name(createPacketServices, "createPacketServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-T53DSG4Q.mjs
var PieTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "PieTokenBuilder");
	}
	constructor() {
		super(["pie", "showData"]);
	}
};
var PieValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "PieValueConverter");
	}
	runCustomConverter(rule, input, _cstNode) {
		if (rule.name !== "PIE_SECTION_LABEL") return;
		return input.replace(/"/g, "").trim();
	}
};
var PieModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new PieTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new PieValueConverter(), "ValueConverter")
} };
function createPieServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Pie = inject(createDefaultCoreModule({ shared }), PieGeneratedModule, PieModule);
	shared.ServiceRegistry.register(Pie);
	return {
		shared,
		Pie
	};
}
__name(createPieServices, "createPieServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-LHMN2FUI.mjs
var RadarTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "RadarTokenBuilder");
	}
	constructor() {
		super(["radar-beta"]);
	}
};
var RadarModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new RadarTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new CommonValueConverter(), "ValueConverter")
} };
function createRadarServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Radar = inject(createDefaultCoreModule({ shared }), RadarGeneratedModule, RadarModule);
	shared.ServiceRegistry.register(Radar);
	return {
		shared,
		Radar
	};
}
__name(createRadarServices, "createRadarServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FWNWRKHM.mjs
var TreemapTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "TreemapTokenBuilder");
	}
	constructor() {
		super(["treemap"]);
	}
};
var classDefRegex = /classDef\s+([A-Z_a-z]\w+)(?:\s+([^\n\r;]*))?;?/;
var TreemapValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "TreemapValueConverter");
	}
	runCustomConverter(rule, input, _cstNode) {
		if (rule.name === "NUMBER2") return parseFloat(input.replace(/,/g, ""));
		else if (rule.name === "SEPARATOR") return input.substring(1, input.length - 1);
		else if (rule.name === "STRING2") return input.substring(1, input.length - 1);
		else if (rule.name === "INDENTATION") return input.length;
		else if (rule.name === "ClassDef") {
			if (typeof input !== "string") return input;
			const match = classDefRegex.exec(input);
			if (match) return {
				$type: "ClassDefStatement",
				className: match[1],
				styleText: match[2] || void 0
			};
		}
	}
};
function registerValidationChecks(services) {
	const validator = services.validation.TreemapValidator;
	const registry = services.validation.ValidationRegistry;
	if (registry) {
		const checks = { Treemap: validator.checkSingleRoot.bind(validator) };
		registry.register(checks, validator);
	}
}
__name(registerValidationChecks, "registerValidationChecks");
var TreemapValidator = class {
	static {
		__name(this, "TreemapValidator");
	}
	/**
	* Validates that a treemap has only one root node.
	* A root node is defined as a node that has no indentation.
	*/
	checkSingleRoot(doc, accept) {
		let rootNodeIndentation;
		for (const row of doc.TreemapRows) {
			if (!row.item) continue;
			if (rootNodeIndentation === void 0 && row.indent === void 0) rootNodeIndentation = 0;
			else if (row.indent === void 0) accept("error", "Multiple root nodes are not allowed in a treemap.", {
				node: row,
				property: "item"
			});
			else if (rootNodeIndentation !== void 0 && rootNodeIndentation >= parseInt(row.indent, 10)) accept("error", "Multiple root nodes are not allowed in a treemap.", {
				node: row,
				property: "item"
			});
		}
	}
};
var TreemapModule = {
	parser: {
		TokenBuilder: /* @__PURE__ */ __name(() => new TreemapTokenBuilder(), "TokenBuilder"),
		ValueConverter: /* @__PURE__ */ __name(() => new TreemapValueConverter(), "ValueConverter")
	},
	validation: { TreemapValidator: /* @__PURE__ */ __name(() => new TreemapValidator(), "TreemapValidator") }
};
function createTreemapServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Treemap = inject(createDefaultCoreModule({ shared }), TreemapGeneratedModule, TreemapModule);
	shared.ServiceRegistry.register(Treemap);
	registerValidationChecks(Treemap);
	return {
		shared,
		Treemap
	};
}
__name(createTreemapServices, "createTreemapServices");
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/mermaid-parser.core.mjs
var parsers = {};
var initializers = {
	info: /* @__PURE__ */ __name(async () => {
		const { createInfoServices: createInfoServices2 } = await import("./info-NVLQJR56-DjapqDKf.js");
		parsers.info = createInfoServices2().Info.parser.LangiumParser;
	}, "info"),
	packet: /* @__PURE__ */ __name(async () => {
		const { createPacketServices: createPacketServices2 } = await import("./packet-BFZMPI3H-V-drk88L.js");
		parsers.packet = createPacketServices2().Packet.parser.LangiumParser;
	}, "packet"),
	pie: /* @__PURE__ */ __name(async () => {
		const { createPieServices: createPieServices2 } = await import("./pie-7BOR55EZ-BGX7vmx4.js");
		parsers.pie = createPieServices2().Pie.parser.LangiumParser;
	}, "pie"),
	architecture: /* @__PURE__ */ __name(async () => {
		const { createArchitectureServices: createArchitectureServices2 } = await import("./architecture-U656AL7Q-BzVWatGV.js");
		parsers.architecture = createArchitectureServices2().Architecture.parser.LangiumParser;
	}, "architecture"),
	gitGraph: /* @__PURE__ */ __name(async () => {
		const { createGitGraphServices: createGitGraphServices2 } = await import("./gitGraph-F6HP7TQM-DH6pZGHs.js");
		parsers.gitGraph = createGitGraphServices2().GitGraph.parser.LangiumParser;
	}, "gitGraph"),
	radar: /* @__PURE__ */ __name(async () => {
		const { createRadarServices: createRadarServices2 } = await import("./radar-NHE76QYJ-6myMIgGX.js");
		parsers.radar = createRadarServices2().Radar.parser.LangiumParser;
	}, "radar"),
	treemap: /* @__PURE__ */ __name(async () => {
		const { createTreemapServices: createTreemapServices2 } = await import("./treemap-KMMF4GRG-C15A_Udk.js");
		parsers.treemap = createTreemapServices2().Treemap.parser.LangiumParser;
	}, "treemap")
};
async function parse(diagramType, text) {
	const initializer = initializers[diagramType];
	if (!initializer) throw new Error(`Unknown diagram type: ${diagramType}`);
	if (!parsers[diagramType]) await initializer();
	const result = parsers[diagramType].parse(text);
	if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) throw new MermaidParseError(result);
	return result.value;
}
__name(parse, "parse");
var MermaidParseError = class extends Error {
	constructor(result) {
		const lexerErrors = result.lexerErrors.map((err) => err.message).join("\n");
		const parserErrors = result.parserErrors.map((err) => err.message).join("\n");
		super(`Parsing failed: ${lexerErrors} ${parserErrors}`);
		this.result = result;
	}
	static {
		__name(this, "MermaidParseError");
	}
};
export { createRadarServices as a, PacketModule as c, createInfoServices as d, GitGraphModule as f, createArchitectureServices as h, RadarModule as i, createPacketServices as l, ArchitectureModule as m, TreemapModule as n, PieModule as o, createGitGraphServices as p, createTreemapServices as r, createPieServices as s, parse as t, InfoModule as u };
