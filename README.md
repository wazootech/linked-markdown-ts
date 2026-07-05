# Linked Markdown TypeScript

TypeScript implementation of Linked Markdown, built for Deno and published
through JSR.

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
