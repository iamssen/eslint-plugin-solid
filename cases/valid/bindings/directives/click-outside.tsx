// @ts-nocheck
import { onCleanup } from 'solid-js';

export default function clickOutside(onOutside) {
  let el;
  const onClick = (e) => !el?.contains(e.target) && onOutside();

  onCleanup(() => document.body.removeEventListener('click', onClick));

  return (nextEl) => {
    el = nextEl;
    document.body.addEventListener('click', onClick);
  };
}
