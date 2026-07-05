import { assertEquals, assertThrows } from "@std/assert";
import { parse, LmdError, LMD_MISSING_ID, LMD_MISSING_TYPE } from "./parse.ts";

Deno.test("parse preserves canonical @id, @type, and @context", () => {
  const content = `---
"@id": https://example.org/docs/1
"@type": schema:Article
"@context":
  schema: https://schema.org/
name: Test Article
---
# Hello World
`;

  const result = parse(content);

  assertEquals(result, {
    "@id": "https://example.org/docs/1",
    "@type": "schema:Article",
    "@context": {
      schema: "https://schema.org/",
    },
    name: "Test Article",
  });
});

Deno.test("parse consolidates legacy id, type, and context aliases", () => {
  const content = `---
id: https://example.org/docs/legacy
type: schema:Note
context:
  schema: https://schema.org/
title: Legacy Note
---
Body content
`;

  const result = parse(content);

  assertEquals(result, {
    "@id": "https://example.org/docs/legacy",
    "@type": "schema:Note",
    "@context": {
      schema: "https://schema.org/",
    },
    title: "Legacy Note",
  });
  assertEquals("id" in result, false);
  assertEquals("type" in result, false);
  assertEquals("context" in result, false);
});

Deno.test("parse allows ParseOptions to override frontmatter values", () => {
  const content = `---
id: https://example.org/docs/original
type: schema:Article
---
`;

  const result = parse(content, {
    id: "https://example.org/docs/overridden",
    type: "schema:TechArticle",
  });

  assertEquals(result["@id"], "https://example.org/docs/overridden");
  assertEquals(result["@type"], "schema:TechArticle");
});

Deno.test("parse merges context from options and frontmatter", () => {
  const content = `---
"@id": https://example.org/doc
"@type": schema:Article
"@context":
  schema: https://schema.org/
---
Body text
`;

  const result = parse(content, {
    context: {
      lmd: "https://wazootech.github.io/linked-markdown/ns#",
    },
  });

  assertEquals(result["@context"], {
    schema: "https://schema.org/",
    lmd: "https://wazootech.github.io/linked-markdown/ns#",
  });
});

Deno.test("parse attaches body content to bodyPredicate when specified", () => {
  const content = `---
id: https://example.org/docs/article
type: schema:Article
---
# Main Heading

Article text body goes here.
`;

  const result = parse(content, {
    bodyPredicate: "schema:articleBody",
  });

  assertEquals(
    result["schema:articleBody"],
    "# Main Heading\n\nArticle text body goes here.\n",
  );
});

Deno.test("parse throws LMD_MISSING_ID when no id or @id is present", () => {
  const content = `---
type: schema:Article
---
Body
`;

  assertThrows(
    () => parse(content),
    LmdError,
    "missing required @id or id",
  );
  try { parse(content); } catch (e: unknown) {
    assertEquals((e as LmdError).code, LMD_MISSING_ID);
  }
});

Deno.test("parse throws LMD_MISSING_TYPE when no type or @type is present", () => {
  const content = `---
id: https://example.org/doc
---
Body
`;

  assertThrows(
    () => parse(content),
    LmdError,
    "missing required @type or type",
  );
  try { parse(content); } catch (e: unknown) {
    assertEquals((e as LmdError).code, LMD_MISSING_TYPE);
  }
});
