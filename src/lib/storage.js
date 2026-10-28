import { useSyncExternalStore } from "react";

// localStorage 접근은 클라이언트(useEffect·이벤트 핸들러)에서만 호출합니다.
export const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, val) {
    try { localStorage.setItem(key, val); } catch { /* 저장 불가 환경 무시 */ }
    listeners.forEach((fn) => fn());
  },
};

const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// 저장된 값을 읽는 훅. 서버와 하이드레이션 때는 fallback을 쓰고, 그 뒤 저장된 값으로 바뀝니다.
export function useStoredValue(key, fallback) {
  return useSyncExternalStore(subscribe, () => store.get(key) ?? fallback, () => fallback);
}
