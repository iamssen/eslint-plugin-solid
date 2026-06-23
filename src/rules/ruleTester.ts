import * as babelEslintParser from '@babel/eslint-parser';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import type { ESLintUtils } from '@typescript-eslint/utils';
import { RuleTester as RuleTester_v10 } from 'eslint';
import { RuleTester as RuleTester_v8 } from 'eslint-v8';
import { RuleTester as RuleTester_v9 } from 'eslint-v9';
import { createRequire } from 'node:module';
import tseslint from 'typescript-eslint';

const requireModule = createRequire(import.meta.url);

// The default parser
const v10Tester = new RuleTester_v10({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

// TypeScript's ESLint parser
const tsTester = new RuleTester_v10({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

const tsV8Tester = new RuleTester_v8({
  parser: requireModule.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

// Babel's ESLint parser
const babelTester = new RuleTester_v10({
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

const babelV8Tester = new RuleTester_v8({
  parser: requireModule.resolve('@babel/eslint-parser'),
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: ['jsx', 'typescript'],
      },
    },
  },
});

const v8Tester = new RuleTester_v8({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const v9Tester = new RuleTester_v9({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

type RuleTesterWithFramework = {
  describe?: (text: string, callback: () => void) => void;
  it?: (text: string, callback: () => void) => void;
};

const executeSync = (_text: string, callback: () => void) => callback();

for (const Tester of [RuleTester_v10, RuleTester_v9, RuleTester_v8]) {
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
    id: 'ts_v8',
    name: '@typescript-eslint/parser',
    tester: tsV8Tester as AnyRuleTester,
    isTsOnlyAllowed: true,
  },
  {
    id: 'babel',
    name: '@babel/eslint-parser',
    tester: babelTester as AnyRuleTester,
    isTsOnlyAllowed: true,
  },
  {
    id: 'babel_v8',
    name: '@babel/eslint-parser v8',
    tester: babelV8Tester as AnyRuleTester,
    isTsOnlyAllowed: true,
  },
  {
    id: 'v8',
    name: 'eslint v8',
    tester: v8Tester as AnyRuleTester,
    isTsOnlyAllowed: false,
  },
  {
    id: 'v9',
    name: 'eslint v9',
    tester: v9Tester as AnyRuleTester,
    isTsOnlyAllowed: false,
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
  testCase: ValidTestCase<unknown[]> | string,
  isTsOnly: boolean = false,
) {
  runWithParsers(name, rule, { valid: [testCase], invalid: [] }, isTsOnly);
}

export function testInvalid(
  name: string,
  rule: ESLintUtils.RuleModule<string, readonly unknown[]>,
  testCase: InvalidTestCase<string, unknown[]>,
  isTsOnly: boolean = false,
) {
  runWithParsers(name, rule, { valid: [], invalid: [testCase] }, isTsOnly);
}
