import { assertEquals } from "@std/assert";
import { parse } from "./parse.ts";

Deno.test("parse preserves @id, @type, @context, and other attrs", () => {
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

Deno.test("parse works without @id or @type (valid JSON-LD)", () => {
  const content = `---
title: Untitled
---
Body
`;

  const result = parse(content);
  assertEquals(result, { title: "Untitled" });
});

Deno.test("parse attaches body content to bodyPredicate when specified", () => {
  const content = `---
"@id": https://example.org/docs/article
"@type": schema:Article
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
