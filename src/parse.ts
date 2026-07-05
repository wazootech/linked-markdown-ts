import { extractJson, extractYaml } from "@std/front-matter";
import { extractLinks } from "./links.ts";
import {
  type LinkedMarkdownDocument,
  LinkedMarkdownError,
  type ParseOptions,
} from "./types.ts";

export function parse(
  content: string,
  _options: ParseOptions = {},
): LinkedMarkdownDocument {
  const normalized = content.replaceAll("\r\n", "\n");
  const { attrs: frontmatter, body } = extractFrontmatter(normalized);
  const context = normalizeContext(frontmatter["@context"]);
  const id = readString(frontmatter["@id"] ?? frontmatter.id);

  if (!id) {
    throw new LinkedMarkdownError(
      "LMD_MISSING_ID",
      "Expected id or @id in frontmatter.",
    );
  }

  const rawTypes = frontmatter["@type"] ?? frontmatter.type;
  if (rawTypes === undefined) {
    throw new LinkedMarkdownError(
      "LMD_MISSING_TYPE",
      "Expected @type or type in frontmatter.",
    );
  }

  const types = normalizeStringArray(rawTypes).map((type) =>
    expandCurie(type, context)
  );
  return {
    id,
    types,
    context,
    frontmatter,
    body,
    links: extractLinks(body),
  };
}

function extractFrontmatter(
  source: string,
): { attrs: Record<string, unknown>; body: string } {
  if (!source.startsWith("---")) {
    throw new LinkedMarkdownError(
      "LMD_MISSING_FRONTMATTER",
      "Expected frontmatter delimited by --- at the start of the document.",
    );
  }

  const extracted = source.startsWith("---json")
    ? extractJson<Record<string, unknown>>(source)
    : extractYaml<Record<string, unknown>>(source);

  if (
    !extracted.attrs || typeof extracted.attrs !== "object" ||
    Array.isArray(extracted.attrs)
  ) {
    throw new LinkedMarkdownError(
      "LMD_INVALID_FRONTMATTER",
      "Frontmatter must parse to an object.",
    );
  }
  return extracted;
}

function normalizeContext(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const context: Record<string, string> = {};
  for (const [key, prefix] of Object.entries(value)) {
    if (typeof prefix === "string") context[key] = prefix;
  }
  return context;
}

function normalizeStringArray(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  throw new LinkedMarkdownError(
    "LMD_INVALID_TYPE",
    "Expected @type or type to be a string or string array.",
  );
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function expandCurie(
  value: string,
  context: Record<string, string>,
): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value;

  const separator = value.indexOf(":");
  if (separator === -1) return value;

  const prefix = value.slice(0, separator);
  const suffix = value.slice(separator + 1);
  return context[prefix] ? `${context[prefix]}${suffix}` : value;
}
