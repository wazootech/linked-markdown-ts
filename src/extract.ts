import { extractJson, extractToml, extractYaml, test } from "@std/front-matter";
import type { Extract } from "@std/front-matter";
import {
  LinkedMarkdownError,
  LMD_INVALID_FRONTMATTER,
  LMD_NO_FRONTMATTER,
} from "./errors.ts";

/**
 * extract extracts front matter and body content from a LinkedMarkdown document.
 *
 * @param content The LinkedMarkdown document content.
 * @returns An object containing the extracted front matter and body content.
 */
export function extract<T>(content: string): Extract<T> {
  content = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  // Check for unknown ---<word> marker
  const markerMatch = content.match(/^---(\w+)/);
  if (
    markerMatch &&
    !["yaml", "json", "toml", ""].includes(markerMatch[1].toLowerCase())
  ) {
    throw new LinkedMarkdownError(
      LMD_INVALID_FRONTMATTER,
      `Unknown front matter marker: ${markerMatch[1]}`,
    );
  }

  // Check for unknown = <word> = marker
  const equalsMatch = content.match(/^= (\w+) =/);
  if (
    equalsMatch &&
    !["yaml", "json", "toml"].includes(equalsMatch[1].toLowerCase())
  ) {
    throw new LinkedMarkdownError(
      LMD_INVALID_FRONTMATTER,
      `Unknown front matter marker: ${equalsMatch[1]}`,
    );
  }

  // Check if any known opener exists at all
  const hasOpener = /^(---|\+\+\+(?:\n|$)|= \w+ =(?:\n|$))/.test(content);
  if (!hasOpener) {
    throw new LinkedMarkdownError(LMD_NO_FRONTMATTER);
  }

  try {
    let result: Extract<T>;
    if (test(content, ["json"])) {
      result = extractJson<T>(content);
    } else if (test(content, ["toml"])) {
      result = extractToml<T>(content);
    } else if (test(content, ["yaml"])) {
      result = extractYaml<T>(content);
    } else {
      // Opener exists but no format matched (likely unclosed)
      throw new LinkedMarkdownError(LMD_INVALID_FRONTMATTER);
    }

    // Validate attrs is a plain object
    if (
      typeof result.attrs !== "object" || result.attrs === null ||
      Array.isArray(result.attrs)
    ) {
      throw new LinkedMarkdownError(LMD_INVALID_FRONTMATTER);
    }

    return {
      ...result,
      frontMatter: result.frontMatter && !result.frontMatter.endsWith("\n")
        ? result.frontMatter + "\n"
        : result.frontMatter,
    };
  } catch (e) {
    if (e instanceof LinkedMarkdownError) throw e;
    throw new LinkedMarkdownError(
      LMD_INVALID_FRONTMATTER,
      undefined,
      e instanceof Error ? e : undefined,
    );
  }
}
