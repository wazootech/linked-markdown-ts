import { expandCurie } from "./parse.ts";
import type {
  DataFactory,
  LmpDocument,
  Quad,
  Term,
  ToQuadsOptions,
} from "./types.ts";

const rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const articleBody = "https://schema.org/articleBody";

const defaultFactory: DataFactory = {
  namedNode(value: string): Term {
    return { termType: "NamedNode", value };
  },
  literal(value: string): Term {
    return { termType: "Literal", value };
  },
  quad(subject: Term, predicate: Term, object: Term): Quad {
    return {
      subject,
      predicate,
      object,
      graph: { termType: "NamedNode", value: "" },
    };
  },
};

export function toQuads(
  doc: LmpDocument,
  options: ToQuadsOptions = {},
): Quad[] {
  if (!doc.id) return [];

  const factory = options.dataFactory ?? defaultFactory;
  const subject = factory.namedNode(doc.id);
  const quads: Quad[] = [];

  for (const type of doc.types) {
    quads.push(
      factory.quad(
        subject,
        factory.namedNode(rdfType),
        factory.namedNode(type),
      ),
    );
  }

  if (doc.body.length > 0) {
    quads.push(
      factory.quad(
        subject,
        factory.namedNode(articleBody),
        factory.literal(doc.body),
      ),
    );
  }

  for (const [key, value] of Object.entries(doc.frontmatter)) {
    if (["id", "@id", "type", "@type", "@context"].includes(key)) continue;
    if (typeof value !== "string") continue;
    const predicate = expandCurie(key, doc.context);
    quads.push(
      factory.quad(
        subject,
        factory.namedNode(predicate),
        factory.literal(value),
      ),
    );
  }

  return quads;
}

export function toNTriples(doc: LmpDocument): string {
  return toQuads(doc).map(formatQuad).sort().join("\n") + "\n";
}

function formatQuad(quad: Quad): string {
  return `${formatTerm(quad.subject)} ${formatTerm(quad.predicate)} ${
    formatTerm(quad.object)
  } .`;
}

function formatTerm(term: Term): string {
  return term.termType === "Literal"
    ? `"${escapeLiteral(term.value)}"`
    : `<${term.value}>`;
}

function escapeLiteral(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(
    '"',
    '\\"',
  );
}
