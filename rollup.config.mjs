import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'node:fs';
import dts from 'rollup-plugin-dts';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
);

const externalDeps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

const config = [
  {
    input: {
      'index': 'src/index.ts',
      'configs/recommended': 'src/configs/recommended.ts',
      'configs/typescript': 'src/configs/typescript.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript()],
    external: externalDeps,
  },
  {
    input: {
      'index': 'src/index.ts',
      'configs/recommended': 'src/configs/recommended.ts',
      'configs/typescript': 'src/configs/typescript.ts',
    },
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
    external: externalDeps,
  },
];

export default config;
