# `linked-markdown-ts`

TypeScript implementation of Linked Markdown, published through JSR.

## API

```ts
import { parse, toQuads } from "@wazoo/linked-markdown";

const doc = parse(markdown);
const quads = toQuads(doc);
```

## Development

```sh
git submodule update --init --recursive
```

The conformance suite is consumed from the `wazootech/linked-markdown` spec
repository as a git submodule.

## Shoulders

This implementation stands on the shoulders of:

- [`@std/front-matter`](https://jsr.io/@std/front-matter): front matter
  extraction for JSON, YAML, and TOML formats
- [`wazootech/linked-markdown`](https://github.com/wazootech/linked-markdown):
  the Linked Markdown specification and conformance suite
