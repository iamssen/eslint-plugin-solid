// @ts-nocheck
import { createEffect, children } from 'solid-js';

export default function ColoredList(props) {
  const c = children(() => props.children);
  createEffect(
    () => [c(), props.color],
    ([items, color]) => items.forEach((item) => (item.style.color = color)),
  );
  return <>{c()}</>;
}
