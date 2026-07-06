# `linked-markdown-ts`

[![JSR](https://jsr.io/badges/@wazoo/linked-markdown)](https://jsr.io/@wazoo/linked-markdown)
[![JSR Score](https://jsr.io/badges/@wazoo/linked-markdown/score)](https://jsr.io/@wazoo/linked-markdown)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

TypeScript implementation of Linked Markdown, published through JSR.

**Status:** All 40 conformance tests passing (14 unit + 26 conformance across
parse, extract, and error tiers).

## API

```ts
import { extract } from "@wazoo/linked-markdown";
import { LinkedMarkdownError } from "@wazoo/linked-markdown";

const result = extract(markdown);
// => { attrs: { "@id": "...", "@type": "...", ... }, frontMatter: "...", body: "..." }
```

### `extract<T>(content: string): { attrs: T, frontMatter: string, body: string }`

Parses frontmatter from a Linked Markdown document. Supports YAML (`---`,
`---yaml`, `= yaml =`), JSON (`---`, `---json`, `= json =`), and TOML
(`---toml`, `+++`, `= toml =`) formats.

- Strips UTF-8 BOM and normalizes CRLF to LF before parsing.
- Returns `frontMatter` with a trailing newline for non-empty frontmatter
  (matching the conformance spec).
- `frontMatter` is `""` for empty frontmatter (`---\n---`).
- `body` has leading newlines stripped (after the closing delimiter).

### `LinkedMarkdownError`

Thrown for all error conditions. Has a `code` property for programmatic
handling:

| Code                      | When                                                                           |
| ------------------------- | ------------------------------------------------------------------------------ |
| `LMD_NO_FRONTMATTER`      | No frontmatter delimiters found                                                |
| `LMD_INVALID_FRONTMATTER` | Unknown marker, unparseable content, non-object attrs, or no closing delimiter |

```ts
try {
  extract(markdown);
} catch (e) {
  if (e instanceof LinkedMarkdownError && e.code === "LMD_NO_FRONTMATTER") {
    // handle
  }
}
```

## Development

```sh
git submodule update --init --recursive

# Run all tests
deno test --allow-read --allow-env=LMD_CONFORMANCE_ROOT

# Run unit tests only
deno test --allow-read src/

# Run conformance tests only
deno test --allow-read --allow-env=LMD_CONFORMANCE_ROOT test/conformance_test.ts
```

The conformance suite is consumed from the `wazootech/linked-markdown` spec
repository as a git submodule.

## Shoulders

This implementation stands on the shoulders of:

- [`@std/front-matter`](https://jsr.io/@std/front-matter): front matter
  extraction for JSON, YAML, and TOML formats
- [`wazootech/linked-markdown`](https://github.com/wazootech/linked-markdown):
  the Linked Markdown specification and conformance suite
