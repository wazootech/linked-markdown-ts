import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { test } from "node:test";
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

const envRoot = process.env.LMD_CONFORMANCE_ROOT;

const conformanceRoot = envRoot
  ? new URL(`${envRoot.replaceAll("\\", "/")}/`)
  : new URL("./linked-markdown-spec/conformance/", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("manifest.json", conformanceRoot), "utf8"),
) as { cases: ManifestCase[] };

for (const testCase of manifest.cases) {
  if (testCase.expect?.error?.code) {
    // Negative case: assert error code
    test(`conformance (error): ${testCase.id}`, async () => {
      const input = await readFixture(testCase.input);
      assert.throws(
        () => extract(input),
        (err: unknown) =>
          err instanceof LinkedMarkdownError &&
          err.code === testCase.expect!.error!.code,
      );
    });
  } else {
    const parsedFixture = testCase.expect?.parsed;
    if (parsedFixture) {
      test(`conformance (parsed): ${testCase.id}`, async () => {
        const input = await readFixture(testCase.input);
        const result = extract(input);
        const expected = JSON.parse(await readFixture(parsedFixture));
        assert.deepEqual(result.attrs, expected);
      });
    }

    const extractedFixture = testCase.expect?.extracted;
    if (extractedFixture) {
      test(`conformance (extracted): ${testCase.id}`, async () => {
        const input = await readFixture(testCase.input);
        const result = extract(input);
        const expected = JSON.parse(await readFixture(extractedFixture));
        assert.deepEqual(result.frontMatter, expected.frontMatter);
        assert.deepEqual(result.body, expected.body);
        assert.deepEqual(result.attrs, expected.attrs);
      });
    }
  }
}

function readFixture(path: string): Promise<string> {
  return readFile(new URL(path, conformanceRoot), "utf8");
}

test("LinkedMarkdownError has code and cause", () => {
  const inner = new Error("inner");
  const err = new LinkedMarkdownError(
    "LMD_INVALID_FRONTMATTER",
    "message",
    inner,
  );
  assert.equal(err.code, "LMD_INVALID_FRONTMATTER");
  assert.equal(err.cause, inner);
  assert.equal(err.name, "LinkedMarkdownError");
});
