import { expect, expectTypeOf, test } from 'vitest';

import solid from './index.js';

test('recommended config registers the plugin', () => {
  const recommended = solid.configs.recommended;

  expect(recommended.plugins['@ssen/solid'].meta.name).toBe(
    '@ssen/eslint-plugin-solid',
  );
  expect(recommended.plugins['@ssen/solid'].meta.version).toEqual(
    expect.any(String),
  );
});

test('only exposes the recommended flat config', () => {
  expect(Object.keys(solid.configs)).toStrictEqual(['recommended']);
});

test('recommended config applies the Solid 2 migration policy', () => {
  const rules = solid.configs.recommended.rules;

  expect(rules['@ssen/solid/no-solid-1-apis']).toBe('warn');
  expect(rules['@ssen/solid/no-array-handlers']).toBe('off');
  expect(rules['@ssen/solid/no-proxy-apis']).toBe('off');
});

test('plugin exposes sane export types', () => {
  expectTypeOf<typeof solid>().toBeObject();
  expectTypeOf<typeof solid.configs>().toBeObject();
});
