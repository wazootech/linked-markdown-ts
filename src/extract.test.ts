import { assertEquals, assertStringIncludes } from "@std/assert";
import { extract } from "./extract.ts";

Deno.test("extract should parse JSON front matter", () => {
  const md = `---json
{"title": "Test Title"}
---

# Hello World

This is the content of the markdown file.
`;

  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "Test Title");
  assertEquals(
    result.body,
    "# Hello World\n\nThis is the content of the markdown file.\n",
  );
});

Deno.test("extract should parse YAML front matter", () => {
  const md = `---
title: Test Title
---

# Hello World

This is the content of the markdown file.
`;

  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "Test Title");
  assertEquals(
    result.body,
    "# Hello World\n\nThis is the content of the markdown file.\n",
  );
});

Deno.test("extract should handle empty front matter", () => {
  const md = `---
---
# Just body
`;
  const result = extract(md);
  assertEquals(result.attrs, {});
  assertEquals(result.body, "# Just body\n");
});

Deno.test("extract should handle CRLF line endings", () => {
  const md = "---\r\ntitle: CRLF Title\r\n---\r\n# Hello\r\n\r\nBody.\r\n";
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "CRLF Title");
  assertEquals(result.body, "# Hello\n\nBody.\n");
});

Deno.test("extract should handle BOM", () => {
  const md = "\ufeff---\ntitle: BOM Title\n---\n# BOM\n\nBody.\n";
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "BOM Title");
  assertEquals(result.body, "# BOM\n\nBody.\n");
});

Deno.test("extract should handle body containing dashes", () => {
  const md = `---
title: Dashes
---
# Body

Triple dashes in body:

---

More content.
`;
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "Dashes");
  assertStringIncludes(result.body, "Triple dashes in body");
});
