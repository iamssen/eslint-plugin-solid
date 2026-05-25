import { expect, expectTypeOf, test } from "vitest";

import recommendedConfig from "../src/configs/recommended";
import typescriptConfig from "../src/configs/typescript";
import * as plugin from "../src/index";

test("flat config has meta", () => {
  expect(recommendedConfig.plugins.solid.meta.name).toBe("@iamssen/eslint-plugin-solid");
  expect(recommendedConfig.plugins.solid.meta.version).toEqual(expect.any(String));
  expect(typescriptConfig.plugins.solid.meta.name).toBe("@iamssen/eslint-plugin-solid");
  expect(typescriptConfig.plugins.solid.meta.version).toEqual(expect.any(String));
});

test('flat configs are also exposed on plugin.configs["flat/*"]', () => {
  // include flat configs on legacy config object with `flat/` prefix.
  expect(plugin.configs["flat/recommended"]).toBe(recommendedConfig);
  expect(plugin.configs["flat/typescript"]).toBe(typescriptConfig);
});

test("legacy configs use strings, not modules", () => {
  expect(plugin.configs.recommended.plugins).toStrictEqual(["solid"]);
  expect(plugin.configs.typescript.plugins).toStrictEqual(["solid"]);
});

test("plugin exposes sane export types", () => {
  expectTypeOf<typeof plugin>().toBeObject();
  expectTypeOf<typeof plugin.rules>().toBeObject();
  expectTypeOf<typeof plugin.configs>().toBeObject();
});

