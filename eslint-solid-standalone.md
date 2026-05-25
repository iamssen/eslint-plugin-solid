# eslint-solid-standalone 가이드

이 저장소는 과거에 브라우저 환경에서 동작하는 ESLint 번들인 `eslint-solid-standalone` 패키지를 제공했습니다. 현재는 프로젝트 복잡성을 낮추기 위해 해당 패키지는 공식적으로 유지보수하지 않으며, 단일 패키지(`eslint-plugin-solid`)에 집중하고 있습니다.

브라우저 내(예: Web IDE, Playground)에서 구동하기 위해 플러그인의 단일 파일 번들이 필요한 경우, 아래 지침을 참고하여 자체 프로젝트 내에서 빌드하여 사용하시기 바랍니다.

## 브라우저용 번들 빌드 방법 (Rollup)

`eslint-plugin-solid` 및 ESLint 코어를 브라우저에서 사용하려면 Node.js 의존성(`fs`, `path`, `crypto` 등)을 Mocking(다이폴리필)하는 과정이 필요합니다.

### 1. 필요한 의존성 설치
```bash
npm install -D rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-json @rollup/pluginutils
npm install -D rollup-plugin-replace magic-string
```

### 2. Rollup 설정 (`rollup.config.mjs`) 예시

ESLint 코어 모듈들의 `fs` 접근 등을 우회하기 위해 `@rollup/plugin-node-resolve`의 `browser: true` 옵션과 수동 치환(Mock) 모듈을 사용해야 합니다.

```javascript
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'node_modules/eslint-plugin-solid/dist/index.js',
  output: {
    file: 'dist/eslint-solid-standalone.js',
    format: 'esm', // Web Worker 등에서 사용할 모듈 형식
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    // 필요한 경우 fs, crypto 등의 Node.js 모듈을 빈 객체로 치환하는 커스텀 플러그인 작성
  ],
};
```

### 3. 유의사항
ESLint 플러그인 번들은 크기가 매우 큽니다(수십 MB). 이 번들을 실제 프로덕션 서버로 서빙하기보다는, gzip 혹은 Brotli 등을 사용해 압축 전송하거나 Web Worker 환경 내부에서만 동적으로 로딩(Lazy Load)하도록 구성하는 것을 권장합니다.
