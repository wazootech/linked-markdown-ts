import type { LinkedMarkdownLink } from "./types.ts";

const externalTarget = /^[a-z][a-z0-9+.-]*:/i;

export function extractLinks(body: string): LinkedMarkdownLink[] {
  const masked = maskCodeSpans(body);
  const links: LinkedMarkdownLink[] = [];

  for (const match of masked.matchAll(/\[([^\]\n]+)\]\(([^)\n]+)\)/g)) {
    const [raw, text, target] = match;
    const start = match.index ?? 0;
    links.push({
      linkType: "markdown",
      target,
      text,
      span: [start, start + raw.length],
      isExternal: externalTarget.test(target),
    });
  }

  for (const match of masked.matchAll(/\[\[([^\]\n]+)\]\]/g)) {
    const [raw, text] = match;
    const start = match.index ?? 0;
    links.push({
      linkType: "wikilink",
      target: text,
      text,
      span: [start, start + raw.length],
      isExternal: externalTarget.test(text),
    });
  }

  return links.sort((a, b) => a.span[0] - b.span[0]);
}

function maskCodeSpans(input: string): string {
  return input.replace(/`[^`]*`/g, (span) => " ".repeat(span.length));
}
