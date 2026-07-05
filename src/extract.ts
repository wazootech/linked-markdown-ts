import { extractJson, extractToml, extractYaml, test } from "@std/front-matter";
import type { Extract } from "@std/front-matter";

/**
 * extract extracts the raw frontmatter block and body from a Linked Markdown
 * document. This is the low-level AST boundary — it returns the raw string,
 * the body, and the parsed attrs object without any normalization or merge.
 *
 * {@link https://github.com/wazootech/linked-markdown | Linked Markdown}
 *
 * @example Extract front matter (YAML)
 * ```ts
 * import { extract } from "@wazoo/linked-markdown";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---
 * title: "Three dashes marks the spot"
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: 'title = "Three dashes marks the spot"',
 *   body: "Hello, world!",
 *   attrs: { title: "Three dashes marks the spot" },
 * });
 * ```
 *
 * @example Extract front matter (TOML)
 * ```ts
 * import { extract } from "@wazoo/linked-markdown";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---
 * title = "TOML front matter"
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: 'title = "TOML front matter"',
 *   body: "Hello, world!",
 *   attrs: { title: "TOML front matter" },
 * });
 * ```
 *
 * @example Extract front matter (JSON)
 * ```ts
 * import { extract } from "@wazoo/linked-markdown";
 * import { assertEquals } from "@std/assert";
 *
 * const output = `---
 * {
 *   "title": "JSON front matter"
 * }
 * ---
 * Hello, world!`;
 * const result = extract(output);
 *
 * assertEquals(result, {
 *   frontMatter: '{\n  "title": "JSON front matter"\n}',
 *   body: "Hello, world!",
 *   attrs: { title: "JSON front matter" },
 * });
 * ```
 *
 * @typeParam T The type of the parsed front matter.
 * @param content The text to extract front matter from.
 * @returns The raw AST: frontMatter string, body string, and attrs object.
 */
export function extract<T>(
  content: string,
): Extract<T> {
  if (test(content, ["json"])) return extractJson<T>(content);
  if (test(content, ["toml"])) return extractToml<T>(content);
  if (test(content, ["yaml"])) return extractYaml<T>(content);
  throw new TypeError("No valid front matter found");
}
