<p align="center">
  <a href="https://docs.wazoo.dev">
    <img src="https://wazoo.dev/assets/wazoo.svg" alt="Wazoo Worlds" width="120" />
  </a>
  <br /><br />
  <em>TypeScript implementation of Linked Markdown.</em>
  <br /><br />
  <a href="https://jsr.io/@wazoo/linked-markdown"><img src="https://jsr.io/badges/@wazoo/linked-markdown" alt="JSR" /></a>
  <a href="https://jsr.io/@wazoo/linked-markdown/score"><img src="https://jsr.io/badges/@wazoo/linked-markdown/score" alt="JSR Score" /></a>
  <a href="https://github.com/wazootech/linked-markdown-ts"><img src="https://img.shields.io/badge/GitHub-black?logo=github" alt="GitHub" /></a>
  <a href="https://deepwiki.com/wazootech/linked-markdown-ts"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" /></a>
</p>

TypeScript implementation of Linked Markdown, published through JSR.

See the
[wazootech/linked-markdown](https://github.com/wazootech/linked-markdown)
repository for the specification, conformance suite, and reference
documentation.

## Installation

### Deno

```sh
deno add linked-markdown@jsr:@wazoo/linked-markdown
```

```ts
import { extract } from "linked-markdown";
```

### Node (npm)

```sh
npx jsr add @wazoo/linked-markdown
```

```ts
import { extract } from "@wazoo/linked-markdown";
```

### Bun

```sh
bunx jsr add @wazoo/linked-markdown
```

```ts
import { extract } from "@wazoo/linked-markdown";
```

### Browser (CDN)

For no-build browser demos, import from esm.sh:

```js
import { extract } from "https://esm.sh/@jsr/wazoo__linked-markdown@0.1.0";
```

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

### RDF Compatibility

The `attrs` returned by `extract()` is valid JSON-LD, directly convertible to
RDF/JS quads:

```ts
import jsonld from "jsonld";

const result = extract(markdown);
const quads = await jsonld.toRDF(result.attrs);
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
