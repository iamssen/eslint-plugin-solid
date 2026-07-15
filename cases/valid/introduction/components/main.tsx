// @ts-nocheck
import { render } from '@solidjs/web';
import Nested from './nested';

function App() {
  return (
    <>
      <h1>This is a Header</h1>
      <Nested />
    </>
  );
}

render(() => <App />, document.getElementById('app'));
