import { assertEquals, assertThrows } from "@std/assert";
import { extract } from "./extract.ts";
import {
  LinkedMarkdownError,
  LMD_INVALID_FRONTMATTER,
  LMD_NO_FRONTMATTER,
} from "./errors.ts";

Deno.test("extract YAML front matter", () => {
  const md = `---
title: Test Title
---
# Hello World

This is the content.
`;
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "Test Title");
  assertEquals(result.body, "# Hello World\n\nThis is the content.\n");
});

Deno.test("extract JSON front matter", () => {
  const md = `---json
{"title": "JSON Title"}
---
# Hello
`;
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "JSON Title");
  assertEquals(result.body, "# Hello\n");
});

Deno.test("extract TOML front matter", () => {
  const md = `---toml
title = "TOML Title"
---
# Hello
`;
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "TOML Title");
  assertEquals(result.body, "# Hello\n");
});

Deno.test("extract empty front matter", () => {
  const md = "---\n---\n# Just body\n";
  const result = extract(md);
  assertEquals(result.attrs, {});
  assertEquals(result.body, "# Just body\n");
});

Deno.test("extract handles CRLF", () => {
  const md = "---\r\ntitle: CRLF Title\r\n---\r\n# Hello\r\n\r\nBody.\r\n";
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "CRLF Title");
  assertEquals(result.body, "# Hello\n\nBody.\n");
});

Deno.test("extract handles BOM", () => {
  const md = "\ufeff---\ntitle: BOM Title\n---\n# BOM\n\nBody.\n";
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "BOM Title");
  assertEquals(result.body, "# BOM\n\nBody.\n");
});

Deno.test("extract handles body containing dashes", () => {
  const md = `---
title: Dashes
---
# Body

---

More.
`;
  const result = extract<{ title: string }>(md);
  assertEquals(result.attrs.title, "Dashes");
  assertEquals(result.body, "# Body\n\n---\n\nMore.\n");
});

Deno.test("extract throws LMD_NO_FRONTMATTER without front matter", () => {
  const md = "# Just a heading\n\nNo front matter.\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_NO_FRONTMATTER);
});

Deno.test("extract throws LMD_INVALID_FRONTMATTER for unknown marker", () => {
  const md = "---bogus\nkey: value\n---\nBody\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
});

Deno.test("extract throws LMD_INVALID_FRONTMATTER for non-object attrs", () => {
  const md = "---\nhello\n---\nBody\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
});

Deno.test("extract throws LMD_INVALID_FRONTMATTER for malformed JSON", () => {
  const md = "---json\n{invalid}\n---\nBody\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
});

Deno.test("extract throws LMD_INVALID_FRONTMATTER for malformed TOML", () => {
  const md = "---toml\nkey = [[\n---\nBody\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
});

Deno.test("extract throws LMD_INVALID_FRONTMATTER for no closing delimiter", () => {
  const md = "---\nkey: value\n";
  const err = assertThrows(
    () => extract(md),
    LinkedMarkdownError,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
});

Deno.test("LinkedMarkdownError has code and cause", () => {
  const inner = new Error("inner");
  const err = new LinkedMarkdownError(
    LMD_INVALID_FRONTMATTER,
    "message",
    inner,
  );
  assertEquals(err.code, LMD_INVALID_FRONTMATTER);
  assertEquals(err.cause, inner);
  assertEquals(err.name, "LinkedMarkdownError");
});
