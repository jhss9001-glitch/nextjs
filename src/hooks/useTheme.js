/* 다크 모드 전환. 저장된 테마는 layout의 인라인 스크립트가 화면이 그려지기 전에 적용합니다.
 * 저장된 테마가 없으면 시스템 설정(prefers-color-scheme)을 따릅니다. */
export function useTheme() {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("kpt-theme", next); } catch { /* 저장 불가 환경 무시 */ }
  };

  return { toggle };
}
