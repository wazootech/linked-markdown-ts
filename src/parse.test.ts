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

Deno.test("parse throws LMD_MISSING_ID when no @id is present", () => {
  const content = `---
"@type": schema:Article
---
Body
`;

  assertThrows(
    () => parse(content),
    LmdError,
    "missing required @id",
  );
  try { parse(content); } catch (e: unknown) {
    assertEquals((e as LmdError).code, LMD_MISSING_ID);
  }
});

Deno.test("parse throws LMD_MISSING_TYPE when no @type is present", () => {
  const content = `---
"@id": https://example.org/doc
---
Body
`;

  assertThrows(
    () => parse(content),
    LmdError,
    "missing required @type",
  );
  try { parse(content); } catch (e: unknown) {
    assertEquals((e as LmdError).code, LMD_MISSING_TYPE);
  }
});
