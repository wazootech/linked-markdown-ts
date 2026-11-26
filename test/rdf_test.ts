import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { extract } from "../src/mod.ts";
import jsonld from "jsonld";
import type { Quad } from "@rdfjs/types";

const conformanceRoot = new URL(
  "./linked-markdown-spec/conformance/",
  import.meta.url,
);

test("valid-yaml-marker loads into RDF/JS quads", async () => {
  const input = await readFile(
    new URL("cases/valid-yaml-marker/input.md", conformanceRoot),
    "utf8",
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assert.ok(quads.length > 0);

  const hasType = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/fixture" &&
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
      q.object.value === "https://schema.org/Article",
  );
  assert.equal(hasType, true);

  const hasName = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/fixture" &&
      q.predicate.value === "https://schema.org/name" &&
      q.object.value === "Delimiter Fixture",
  );
  assert.equal(hasName, true);
});

test("missing-id generates blank node", async () => {
  const input = await readFile(
    new URL("cases/missing-id/input.md", conformanceRoot),
    "utf8",
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assert.ok(quads.length > 0);
  const hasBlankNode = quads.some(
    (q: Quad) => q.subject.termType === "BlankNode",
  );
  assert.equal(hasBlankNode, true);
});

test("missing-type produces no rdf:type quad", async () => {
  const input = await readFile(
    new URL("cases/missing-type/input.md", conformanceRoot),
    "utf8",
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  const typeQuads = quads.filter(
    (q: Quad) =>
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  );
  assert.equal(typeQuads.length, 0);
});

test("canonical-type produces correct quads", async () => {
  const input = await readFile(
    new URL("cases/canonical-type/input.md", conformanceRoot),
    "utf8",
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  const hasType = quads.some(
    (q: Quad) =>
      q.subject.value === "https://example.org/docs/canonical-type" &&
      q.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
      q.object.value === "https://schema.org/Note",
  );
  assert.equal(hasType, true);
});

test("bare-keywords-preserved produces no quads without context", async () => {
  const input = await readFile(
    new URL("cases/bare-keywords-preserved/input.md", conformanceRoot),
    "utf8",
  );
  const result = extract<Record<string, unknown>>(input);

  const quads = await jsonld.toRDF(result.attrs);

  assert.equal(quads.length, 0);
});
