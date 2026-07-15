// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal } from 'solid-js';

const App = () => {
  const [firstName, setFirstName] = createSignal('John');
  const [lastName, setLastName] = createSignal('Smith');
  const fullName = () => {
    console.log('Running FullName');
    return `${firstName()} ${lastName()}`;
  };
  const updateNames = () => {
    console.log('Button Clicked');
    setFirstName(firstName() + 'n');
    setLastName(lastName() + '!');
  };

  return <button onClick={updateNames}>My name is {fullName()}</button>;
};

render(App, document.getElementById('app'));
