// @ts-nocheck
import { render } from '@solidjs/web';

function HelloWorld() {
  return <div>Hello Solid World!</div>;
}

render(() => <HelloWorld />, document.getElementById('app'));
