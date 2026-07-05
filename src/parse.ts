import type { Extract } from "@std/front-matter";
import { deepMerge } from "@std/collections/deep-merge";
import { extract } from "./extract.ts";

/**
 * ParseOptions defines the options for parsing Linked Markdown content.
 */
export interface ParseOptions {
  /**
   * id is the unique identifier for the Linked Markdown document. It is used
   * to generate IRIs for the document and its components.
   */
  id?: string;

  /**
   * type is the type of the Linked Markdown document. It is used to provide additional
   * information about the document and to generate IRIs for its components.
   */
  type?: string | string[];

  /**
   * context is the RDF context for the Linked Markdown document. It is used
   * to resolve relative IRIs and to provide additional information about the document.
   */
  context?: string | Record<string, unknown>;

  /**
   * bodyPredicate is the predicate used to link the body of the Linked Markdown
   * document to its subject. If it is not present, the content will not be
   * linked to the subject. If it is present, the content will be linked to the
   * subject using the specified predicate.
   */
  bodyPredicate?: string;
}

/**
 * ParseResult defines the result of parsing Linked Markdown content. It
 * includes the extracted front matter, the body content, and the parsed
 * attributes from the front matter.
 */
export interface ParseResult {
  [additionalProperties: string]: unknown;

  /**
   * '@id' is the unique identifier for the Linked Markdown document. It is used
   * to generate IRIs for the document and its components.
   */
  "@id"?: string;

  /**
   * '@type' is the type of the Linked Markdown document. It is used to provide additional
   * information about the document and to generate IRIs for its components.
   */
  "@type"?: string | string[];

  /**
   * '@context' is the RDF context for the Linked Markdown document. It is used
   * to resolve relative IRIs and to provide additional information about the document.
   */
  "@context"?: string | Record<string, unknown>;
}

/**
 * parse parses Linked Markdown content and returns a structured representation
 * of the document.
 */
export function parse(content: string, options?: ParseOptions): ParseResult {
  const result = extract<unknown>(content);
  const parsed: ParseResult = {
    ...result.attrs,
    "@id": options?.id,
    "@type": options?.type,
    "@context": options?.context,
  };

  if (options?.bodyPredicate) {
    parsed[options.bodyPredicate] = result.body;
  }

  return deepMerge(parsed, result.attrs);   

}
