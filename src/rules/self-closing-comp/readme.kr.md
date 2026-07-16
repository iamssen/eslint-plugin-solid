# self-closing-comp

[English](./readme.md)

자식이 없는 JSX 요소를 self-closing 형태로 통일하고, 옵션에 따라 native HTML 요소의 self-closing 사용을 제한합니다.

JSX에서 `<Component />`와 `<Component></Component>`는 자식이 없다는 점에서는 같은 구조입니다. 이 rule은 실행 모델을 바꾸는 규칙이 아니라, 빈 component/element의 의도를 명확히 하고 formatter·코드 리뷰에서 일관된 표현을 유지하기 위한 layout rule입니다. HTML의 void element와 일반 element를 구분해야 하므로 `html` 옵션을 제공합니다.

```tsx
// 권장(기본 설정)
<Header />
<div />
```

기본값은 `{ component: 'all', html: 'all' }`입니다. `component: 'none'`은 컴포넌트를 여는 태그와 닫는 태그로 작성하게 하고, `html: 'void'`는 `img`, `input`, `br` 등 void HTML 요소만 self-closing으로 허용합니다. `html: 'none'`은 native 요소의 self-closing을 허용하지 않습니다.

내용이 실제로 없거나 여러 줄의 공백만 있는 요소가 대상이며, 자동 수정이 제공됩니다.

## 예제로 보는 동작

기본 설정에서는 children이 없는 JSX element를 self-closing으로 씁니다.

```tsx
// invalid → <Avatar />
<Avatar></Avatar>

// invalid → <div />
<div></div>
```

눈에 보이지 않아도 실제 child가 있으면 self-closing 대상이 아닙니다.

```tsx
// 모두 valid
<div>{' '}</div>
<div>&nbsp;</div>
<Card><Avatar /></Card>
```

옵션은 HTML과 component를 별도로 제어합니다. 예를 들어 `{ html: 'void' }`는 HTML void element만 self-closing으로 허용합니다.

```tsx
// { html: 'void' }에서 invalid → <div></div>
<div />

// { html: 'void' }에서 valid
<img />
```

`{ component: 'none' }`에서는 반대로 `<Avatar />`가 invalid이고 `<Avatar></Avatar>`를 요구합니다. 여러 줄 공백만 든 element는 빈 것으로 보고 수정하지만, expression이나 HTML entity는 실제 child로 취급합니다.
