import { ESLint as FlatESLint } from 'eslint';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { expect, test } from 'vitest';

const cwd = path.dirname(fileURLToPath(import.meta.url));
const validDir = path.join(cwd, 'valid');
const jsxUndefPath = path.join(cwd, 'invalid', 'jsx-undef.jsx');

const checkResult = (result: FlatESLint.LintResult) => {
  if (result.filePath.startsWith(validDir)) {
    expect(result.messages).toEqual([]);
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
    expect(result.usedDeprecatedRules).toEqual([]);
  } else {
    if (result.messages.length === 0) {
      console.log(
        'NO MESSAGES FOR INVALID FILE:',
        result.filePath,
        result.messages,
      );
    }
    expect(result.messages).not.toEqual([]);
    expect(result.warningCount + result.errorCount).toBeGreaterThan(0);
    expect(result.usedDeprecatedRules).toEqual([]);

    if (result.filePath === jsxUndefPath) {
      // test for one specific error message
      expect(
        result.messages.some((message) =>
          /'Component' is not defined/.test(message.message),
        ),
      );
    }
  }
};

test.concurrent('fixture (plugin.configs.recommended)', async () => {
  const eslint = new FlatESLint({
    cwd,
    overrideConfigFile: './eslint.config.js',
  } as any);
  const results = await eslint.lintFiles(
    '{valid,invalid}/**/*.{js,jsx,ts,tsx}',
  );

  results.forEach(checkResult);

  expect(
    results.filter((result) => result.filePath === jsxUndefPath).length,
  ).toBe(1);
});
