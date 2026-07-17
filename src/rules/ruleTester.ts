import * as babelEslintParser from '@babel/eslint-parser';
import prettier from '@prettier/sync';
import typescriptEslintParser from '@typescript-eslint/parser';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import type { ESLintUtils } from '@typescript-eslint/utils';
import { RuleTester as RuleTester_v10 } from 'eslint';
import assert from 'node:assert';

function formatWithPrettier(code: unknown): unknown {
  if (typeof code !== 'string') {
    return code;
  }

  try {
    return prettier.format(code, { parser: 'typescript' }).trim();
  } catch {
    return code;
  }
}

function createPrettierRuleTester<T extends new (...args: any[]) => any>(
  BaseRuleTester: T,
) {
  return class extends BaseRuleTester {
    run(name: string, rule: any, tests: { valid: any[]; invalid: any[] }) {
      const originalStrictEqual = assert.strictEqual;

      // Format both the Fixer output (actual) and the user's expected output before comparison
      assert.strictEqual = (
        actual: unknown,
        expected: unknown,
        message?: string | Error,
      ) => {
        return originalStrictEqual(
          formatWithPrettier(actual),
          formatWithPrettier(expected),
          message,
        );
      };

      try {
        super.run(name, rule, tests);
      } finally {
        // Restore original strictEqual
        assert.strictEqual = originalStrictEqual;
      }
    }
  };
}

const PrettierRuleTester_v10 = createPrettierRuleTester(RuleTester_v10);

// The default parser
const v10Tester = new PrettierRuleTester_v10({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

// TypeScript's ESLint parser
const tsTester = new PrettierRuleTester_v10({
  languageOptions: {
    parser: typescriptEslintParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

// Babel's ESLint parser
const babelTester = new PrettierRuleTester_v10({
  languageOptions: {
    parser: babelEslintParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        parserOpts: {
          plugins: ['jsx', 'typescript'],
        },
      },
    },
  },
});

type RuleTesterWithFramework = {
  describe?: (text: string, callback: () => void) => void;
  it?: (text: string, callback: () => void) => void;
};

const executeSync = (_text: string, callback: () => void) => callback();

for (const Tester of [RuleTester_v10]) {
  const T = Tester as unknown as RuleTesterWithFramework;
  T.describe = executeSync;
  T.it = executeSync;
}

type AnyRuleTester = {
  run(name: string, rule: any, tests: any): void;
};

const parsers: Array<{
  id: string;
  name: string;
  tester: AnyRuleTester;
  isTsOnlyAllowed: boolean;
}> = [
  {
    id: 'ts',
    name: 'typescript-eslint',
    tester: tsTester as AnyRuleTester,
    isTsOnlyAllowed: true,
  },
  {
    id: 'babel',
    name: '@babel/eslint-parser',
    tester: babelTester as AnyRuleTester,
    isTsOnlyAllowed: true,
  },
  {
    id: 'v10',
    name: 'eslint v10',
    tester: v10Tester as AnyRuleTester,
    isTsOnlyAllowed: false,
  },
];

function runWithParsers(
  name: string,
  rule: ESLintUtils.RuleModule<string, readonly unknown[]>,
  tests: { valid: any[]; invalid: any[] },
  isTsOnly: boolean,
) {
  const parserEnv = process.env.PARSER ?? 'ts';
  const all = parserEnv === 'all';

  for (const { id, name: parserName, tester, isTsOnlyAllowed } of parsers) {
    if (!(all || parserEnv === id)) {
      continue;
    }

    if (isTsOnly && !isTsOnlyAllowed) continue;

    try {
      tester.run(name, rule, tests);
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message = `[${parserName}] ${error.message}`;
      }
      throw error;
    }
  }
}

export function testValid(
  name: string,
  rule: ESLintUtils.RuleModule<string, readonly unknown[]>,
) {
  return function (
    testCase: ValidTestCase<unknown[]> | string,
    isTsOnly: boolean = false,
  ) {
    runWithParsers(name, rule, { valid: [testCase], invalid: [] }, isTsOnly);
  };
}

export function testInvalid(
  name: string,
  rule: ESLintUtils.RuleModule<string, readonly unknown[]>,
) {
  return function (
    testCase: InvalidTestCase<string, unknown[]>,
    isTsOnly: boolean = false,
  ) {
    runWithParsers(name, rule, { valid: [], invalid: [testCase] }, isTsOnly);
  };
}
