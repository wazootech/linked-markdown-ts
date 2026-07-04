import { assertEquals, assertInstanceOf } from "@std/assert";
import { LmdError, parse, toNTriples } from "../src/mod.ts";

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

const conformanceRoot = Deno.env.get("LMD_CONFORMANCE_ROOT")
  ? new URL(`${Deno.env.get("LMD_CONFORMANCE_ROOT")!.replaceAll("\\", "/")}/`)
  : new URL("./linked-markdown-spec/conformance/", import.meta.url);
const manifest = JSON.parse(
  await Deno.readTextFile(new URL("manifest.json", conformanceRoot)),
) as { cases: ManifestCase[] };

for (const testCase of manifest.cases) {
  Deno.test(`conformance: ${testCase.id}`, async () => {
    const input = await readFixture(testCase.input);

    if (testCase.expectError) {
      try {
        parse(input);
      } catch (error) {
        assertInstanceOf(error, LmdError);
        assertEquals(error.code, testCase.expectError.code);
        return;
      }
      throw new Error(`Expected ${testCase.expectError.code}`);
    }

    const doc = parse(input);

    if (testCase.expect?.parsed) {
      const expected = JSON.parse(await readFixture(testCase.expect.parsed));
      assertEquals(doc, expected);
    }

    if (testCase.expect?.rdf) {
      const expected = normalizeTriples(await readFixture(testCase.expect.rdf));
      assertEquals(normalizeTriples(toNTriples(doc)), expected);
    }
  });
}

function readFixture(path: string): Promise<string> {
  return Deno.readTextFile(new URL(path, conformanceRoot));
}

function normalizeTriples(value: string): string {
  return value.replaceAll("\r\n", "\n").trim().split("\n").filter(Boolean)
    .sort().join("\n") + "\n";
}
