"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/storage";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    store.set("kpt-theme", next);
  };

  const onNavClick = (e) => { if (e.target.closest("a")) setOpen(false); };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} id="top">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="K-Pharm Talk 홈">
          <span className="logo" aria-hidden="true">K<i>Rx</i></span>
          <span className="brand-name">K-Pharm Talk</span>
        </a>

        <nav className={`nav${open ? " open" : ""}`} id="nav" aria-label="주요 메뉴" onClick={onNavClick}>
          <a href="#why">왜 지금인가</a>
          <a href="#preview">표현 미리듣기</a>
          <a href="#curriculum">커리큘럼</a>
          <a href="#quiz">레벨 테스트</a>
          <a href="#pricing">수강료</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-btn" id="themeBtn" aria-label="다크 모드 전환" onClick={toggleTheme}>◐</button>
          <a href="#apply" className="btn btn-primary btn-sm">수강 신청</a>
          <button
            type="button"
            className="icon-btn menu-btn"
            id="menuBtn"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="nav"
            onClick={() => setOpen((o) => !o)}
          >☰</button>
        </div>
      </div>
    </header>
  );
}
