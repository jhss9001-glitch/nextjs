import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange) => {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/* 기기의 '동작 줄이기' 설정. 서버에서는 false로 그리고 브라우저에서 실제 값으로 바뀝니다. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
