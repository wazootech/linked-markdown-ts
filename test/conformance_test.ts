import { assertEquals } from "@std/assert";
import { parse } from "../src/mod.ts";

interface ManifestCase {
  id: string;
  input: string;
  expect?: {
    parsed?: string;
    rdf?: string;
  };
  expectError?: {
    code: string;
  };
}

const envRoot = (() => {
  try {
    return Deno.env.get("LMD_CONFORMANCE_ROOT");
  } catch {
    return undefined;
  }
})();

const conformanceRoot = envRoot
  ? new URL(`${envRoot.replaceAll("\\", "/")}/`)
  : new URL("./linked-markdown-spec/conformance/", import.meta.url);
const manifest = JSON.parse(
  await Deno.readTextFile(new URL("manifest.json", conformanceRoot)),
) as { cases: ManifestCase[] };

for (const testCase of manifest.cases) {
  const parsedFixture = testCase.expect?.parsed;
  if (!parsedFixture) continue;

  Deno.test(`conformance: ${testCase.id}`, async () => {
    const input = await readFixture(testCase.input);
    const doc = parse(input);
    const expected = JSON.parse(await readFixture(parsedFixture));
    assertEquals(doc, expected);
  });
}

function readFixture(path: string): Promise<string> {
  return Deno.readTextFile(new URL(path, conformanceRoot));
}

function normalizeTriples(value: string): string {
  return value.replaceAll("\r\n", "\n").trim().split("\n").filter(Boolean)
    .sort().join("\n") + "\n";
}
