import typescriptEslintParser from '@typescript-eslint/parser';
import { describe, expect, test, vi } from 'vitest';

vi.unmock('./utils.js');

import { trackImports } from './utils.js';

function track(code: string) {
  const ast = typescriptEslintParser.parseForESLint(code, {
    loc: true,
    range: true,
    sourceType: 'module',
  }).ast;
  const imports = trackImports();

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration') {
      imports.handleImportDeclaration(node);
    }
  }
  return imports.matchImport;
}

describe('trackImports', () => {
  test('tracks aliased core imports', () => {
    const matchImport = track(
      `import { createSignal as signal } from 'solid-js';`,
    );

    expect(matchImport('createSignal', 'signal')).toBe('createSignal');
  });

  test('tracks renderer imports from @solidjs/web', () => {
    const matchImport = track(
      `import { render as mount } from '@solidjs/web';`,
    );

    expect(matchImport('render', 'mount')).toBe('render');
  });

  test('tracks type-only imports from a Solid 2 renderer path', () => {
    const matchImport = track(
      `import type { JSX as SolidJSX } from '@solidjs/web';`,
    );

    expect(matchImport('JSX', 'SolidJSX')).toBe('JSX');
  });

  test('does not track unrelated packages', () => {
    const matchImport = track(
      `import { createSignal as signal } from '@solidjs/router';`,
    );

    expect(matchImport('createSignal', 'signal')).toBeUndefined();
  });
});
