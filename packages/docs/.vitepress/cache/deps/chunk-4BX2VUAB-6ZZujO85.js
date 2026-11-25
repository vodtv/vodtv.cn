import { B as __name } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4BX2VUAB.mjs
function populateCommonDb(ast, db) {
	if (ast.accDescr) db.setAccDescription?.(ast.accDescr);
	if (ast.accTitle) db.setAccTitle?.(ast.accTitle);
	if (ast.title) db.setDiagramTitle?.(ast.title);
}
__name(populateCommonDb, "populateCommonDb");
export { populateCommonDb as t };
