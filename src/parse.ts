import { extract } from "./extract.ts";


export interface ParseOptions {
  bodyPredicate?: string;
}

export interface ParseResult {
  [additionalProperties: string]: unknown;
  "@id"?: string;
  "@type"?: string | string[];
  "@context"?: string | Record<string, unknown>;
}

export function parse(content: string, options?: ParseOptions): ParseResult {
  const { attrs, body } = extract<Record<string, unknown>>(content);
  const parsed: ParseResult = { ...attrs };
  if (options?.bodyPredicate) parsed[options.bodyPredicate] = body;
  return parsed;
}
