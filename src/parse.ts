import { deepMerge } from "@std/collections/deep-merge";
import { extract } from "./extract.ts";


export class LmdError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "LmdError";
  }
}

export const LMD_MISSING_ID = "LMD_MISSING_ID";
export const LMD_MISSING_TYPE = "LMD_MISSING_TYPE";

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
 * ParseResult represents a flattened JSON-LD node parsed from a Linked
 * Markdown document. The result is a single node with the canonical '@id',
 * '@type', '@context', and any other frontmatter properties as direct node
 * properties.
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
 * parse parses Linked Markdown content and returns a single flattened JSON-LD
 * node. The frontmatter attrs are normalized: legacy aliases (id, type, context)
 * are promoted to their canonical '@' forms, and options override or fill in
 * identity, type, context, and body predicate.
 */
export function parse(content: string, options?: ParseOptions): ParseResult {
  const { attrs, body } = extract<Record<string, unknown>>(content);
  const {
    "@id": atId,
    id,
    "@type": atType,
    type,
    "@context": atContext,
    context,
    ...cleanAttrs
  } = attrs;

  const resolvedId = options?.id ?? atId ?? id;
  const resolvedType = options?.type ?? atType ?? type;
  const rawContext = atContext ?? context;

  const ctx = typeof options?.context === "object" && typeof rawContext === "object"
    ? deepMerge(rawContext as Record<string, unknown>, options.context as Record<string, unknown>)
    : options?.context ?? rawContext;

  if (!resolvedId) {
    throw new LmdError(
      "Document is missing required @id or id field",
      LMD_MISSING_ID,
    );
  }
  if (!resolvedType) {
    throw new LmdError(
      "Document is missing required @type or type field",
      LMD_MISSING_TYPE,
    );
  }

  const parsed: ParseResult = cleanAttrs;

  parsed["@id"] = resolvedId as string;
  parsed["@type"] = resolvedType as string | string[];
  if (ctx) parsed["@context"] = ctx as string | Record<string, unknown>;
  if (options?.bodyPredicate) parsed[options.bodyPredicate] = body;

  return parsed;
}
