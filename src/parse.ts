import { extract } from "./extract.ts";


export interface ParseOptions {
  bodyPredicate?: string;
}

export function parse(content: string, options?: ParseOptions): Record<string, unknown> {
  const { attrs, body } = extract<Record<string, unknown>>(content);
  if (options?.bodyPredicate) attrs[options.bodyPredicate] = body;
  return attrs;
}
