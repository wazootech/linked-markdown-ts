import { assertEquals } from "@std/assert";
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
