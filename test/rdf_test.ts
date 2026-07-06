import { assertEquals, assertGreater } from "@std/assert";
import { extract } from "../src/mod.ts";
import jsonld from "npm:jsonld";
import type { Quad } from "npm:@rdfjs/types";

const conformanceRoot = new URL(
  "./linked-markdown-spec/conformance/",
  import.meta.url,
);

Deno.test("valid-yaml-marker loads into RDF/JS quads", async () => {
  const input = await Deno.readTextFile(
    new URL("cases/valid-yaml-marker/input.md", conformanceRoot),
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assertGreater(quads.length, 0);

  const hasType = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/fixture" &&
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
      q.object.value === "https://schema.org/Article",
  );
  assertEquals(hasType, true);

  const hasName = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/fixture" &&
      q.predicate.value === "https://schema.org/name" &&
      q.object.value === "Delimiter Fixture",
  );
  assertEquals(hasName, true);
});

Deno.test("missing-id generates blank node", async () => {
  const input = await Deno.readTextFile(
    new URL("cases/missing-id/input.md", conformanceRoot),
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assertGreater(quads.length, 0);
  const hasBlankNode = quads.some((q: Quad) => q.subject.termType === "BlankNode");
  assertEquals(hasBlankNode, true);
});

Deno.test("missing-type produces no rdf:type quad", async () => {
  const input = await Deno.readTextFile(
    new URL("cases/missing-type/input.md", conformanceRoot),
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  const typeQuads = quads.filter(
    (q: Quad) =>
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  );
  assertEquals(typeQuads.length, 0);
});

Deno.test("canonical-type produces correct quads", async () => {
  const input = await Deno.readTextFile(
    new URL("cases/canonical-type/input.md", conformanceRoot),
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  const hasType = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/canonical-type" &&
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
      q.object.value === "https://schema.org/Note",
  );
  assertEquals(hasType, true);
});

Deno.test("bare-keywords-preserved produces no quads without context", async () => {
  const input = await Deno.readTextFile(
    new URL("cases/bare-keywords-preserved/input.md", conformanceRoot),
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assertEquals(quads.length, 0);
});
