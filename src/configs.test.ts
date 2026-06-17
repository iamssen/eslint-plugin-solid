import { expect, expectTypeOf, test } from "vitest";

import recommendedConfig from "./configs/recommended.js";
import typescriptConfig from "./configs/typescript.js";
import * as plugin from "./index.js";

test("flat config has meta", () => {
  expect(recommendedConfig.plugins["@ssen/solid"].meta.name).toBe("@ssen/eslint-plugin-solid");
  expect(recommendedConfig.plugins["@ssen/solid"].meta.version).toEqual(expect.any(String));
  expect(typescriptConfig.plugins["@ssen/solid"].meta.name).toBe("@ssen/eslint-plugin-solid");
  expect(typescriptConfig.plugins["@ssen/solid"].meta.version).toEqual(expect.any(String));
});

test('flat configs are also exposed on plugin.configs["flat/*"]', () => {
  // include flat configs on legacy config object with `flat/` prefix.
  expect(plugin.configs["flat/recommended"]).toBe(recommendedConfig);
  expect(plugin.configs["flat/typescript"]).toBe(typescriptConfig);
});

test("legacy configs use strings, not modules", () => {
  expect(plugin.configs.recommended.plugins).toStrictEqual(["@ssen/solid"]);
  expect(plugin.configs.typescript.plugins).toStrictEqual(["@ssen/solid"]);
});

test("plugin exposes sane export types", () => {
  expectTypeOf<typeof plugin>().toBeObject();
  expectTypeOf<typeof plugin.rules>().toBeObject();
  expectTypeOf<typeof plugin.configs>().toBeObject();
});

