import { assertEquals, assertThrows } from "@std/assert";
import { extract, LinkedMarkdownError } from "../src/mod.ts";

interface ManifestCase {
  id: string;
  tiers?: string[];
  input: string;
  expect?: {
    parsed?: string;
    extracted?: string;
    error?: { code?: string };
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
  if (testCase.expect?.error?.code) {
    // Negative case: assert error code
    Deno.test(`conformance (error): ${testCase.id}`, async () => {
      const input = await readFixture(testCase.input);
      const err = assertThrows(
        () => extract(input),
        LinkedMarkdownError,
      );
      assertEquals(err.code, testCase.expect!.error!.code);
    });
  } else {
    const parsedFixture = testCase.expect?.parsed;
    if (parsedFixture) {
      Deno.test(`conformance (parsed): ${testCase.id}`, async () => {
        const input = await readFixture(testCase.input);
        const result = extract(input);
        const expected = JSON.parse(await readFixture(parsedFixture));
        assertEquals(result.attrs, expected);
      });
    }

    const extractedFixture = testCase.expect?.extracted;
    if (extractedFixture) {
      Deno.test(`conformance (extracted): ${testCase.id}`, async () => {
        const input = await readFixture(testCase.input);
        const result = extract(input);
        const expected = JSON.parse(await readFixture(extractedFixture));
        assertEquals(result.frontMatter, expected.frontMatter);
        assertEquals(result.body, expected.body);
        assertEquals(result.attrs, expected.attrs);
      });
    }
  }
}

function readFixture(path: string): Promise<string> {
  return Deno.readTextFile(new URL(path, conformanceRoot));
}

Deno.test("LinkedMarkdownError has code and cause", () => {
  const inner = new Error("inner");
  const err = new LinkedMarkdownError(
    "LMD_INVALID_FRONTMATTER",
    "message",
    inner,
  );
  assertEquals(err.code, "LMD_INVALID_FRONTMATTER");
  assertEquals(err.cause, inner);
  assertEquals(err.name, "LinkedMarkdownError");
});
