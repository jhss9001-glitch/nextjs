"use client";

import { useEffect, useState } from "react";
import { HERO_CHATS, LANGS } from "@/lib/data";

// EN → ZH → JA 순서로 상담 대화를 바꿔 보여줍니다.
export default function ChatCard() {
  const [idx, setIdx] = useState(0);
  const lang = LANGS[idx % LANGS.length];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIdx((i) => i + 1), 5200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="chat-card">
      <div className="chat-head">
        <span className="dot"></span>
        <span>상담 중 · <b id="chatLang">{lang.label}</b></span>
      </div>
      <div className="chat-body" id="chatBody" aria-live="polite" key={lang.code}>
        {HERO_CHATS[lang.code].map((m, i) => (
          <div key={i} className={`bubble ${m.who}`} lang={lang.code} style={{ animationDelay: `${i * 0.6}s` }}>
            <span className="who">{m.who === "rx" ? "약사" : "Guest"}</span>{m.text}
          </div>
        ))}
      </div>
      <div className="chat-foot">
        <span className="chip">#레티놀</span>
        <span className="chip">#자외선차단</span>
        <span className="chip">#사용시간</span>
      </div>
    </div>
  );
}
