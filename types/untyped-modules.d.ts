// jsonld ships no TypeScript types, so tsc (bun check) needs a declaration;
// test/rdf_test.ts types the quads it reads itself.
declare module "jsonld";
