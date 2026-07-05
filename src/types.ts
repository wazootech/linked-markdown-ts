export type LinkType = "wikilink" | "markdown";

export interface LinkedMarkdownLink {
  linkType: LinkType;
  target: string;
  text: string;
  span: [number, number];
  isExternal: boolean;
}

export interface LinkedMarkdownDocument {
  id: string | null;
  types: string[];
  context: Record<string, string>;
  frontmatter: Record<string, unknown>;
  body: string;
  links: LinkedMarkdownLink[];
}

export interface ParseOptions {
  baseIri?: string;
  filePath?: string;
}

export interface Term {
  termType: "NamedNode" | "Literal";
  value: string;
}

export interface Quad {
  subject: Term;
  predicate: Term;
  object: Term;
  graph: Term;
}

export interface DataFactory {
  namedNode(value: string): Term;
  literal(value: string): Term;
  quad(subject: Term, predicate: Term, object: Term): Quad;
}

export interface ToQuadsOptions {
  dataFactory?: DataFactory;
}

export class LmdError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "LmdError";
  }
}
