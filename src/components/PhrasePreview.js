"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { LANGS, PHRASES, PHRASE_CATEGORIES } from "@/lib/data";
import { store, useStoredValue } from "@/lib/storage";
import { speak } from "@/lib/speak";
import { useToast } from "@/context/ToastContext";

export default function PhrasePreview() {
  const toast = useToast();
  const [cat, setCat] = useState("all");
  // 서버 렌더 결과와 맞추기 위해 처음에는 "en"으로 그린 뒤 저장된 언어로 바뀝니다.
  const langCode = useStoredValue("kpt-lang", "en");

  const lang = LANGS.find((l) => l.code === langCode) || LANGS[0];
  const list = PHRASES.filter((p) => cat === "all" || p.cat === cat);

  const pickLang = (code) => store.set("kpt-lang", code);

  const copy = async (p) => {
    try {
      await navigator.clipboard.writeText(`${p[lang.code]}\n(${p.ko})`);
      toast("표현을 복사했습니다.");
    } catch {
      toast("복사에 실패했습니다. 직접 선택해 복사해 주세요.");
    }
  };

  return (
    <section className="section section-tint" id="preview">
      <div className="container">
        <SectionHead eyebrow="Free preview" title="오늘 바로 쓰는 복약지도 표현">
          <p className="section-desc">상황을 고르고, 언어를 바꿔가며 원어민 발음(브라우저 음성)으로 들어보세요.</p>
        </SectionHead>

        <Reveal className="preview-toolbar">
          <div className="seg" role="tablist" aria-label="상황 분류" id="catTabs">
            {PHRASE_CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={c.id === cat} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="seg seg-lang" role="tablist" aria-label="언어 선택" id="langTabs">
            {LANGS.map((l) => (
              <button key={l.code} type="button" role="tab" aria-selected={l.code === lang.code} onClick={() => pickLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="phrase-grid" id="phraseGrid" aria-live="polite">
          {list.map((p) => (
            <article className="card phrase" key={p.situation}>
              <p className="situation">{p.situation}</p>
              <p className="foreign" lang={lang.code}>{p[lang.code]}</p>
              <p className="ko">{p.ko}</p>
              <div className="phrase-actions">
                <button type="button" className="chip-btn" onClick={() => speak(p[lang.code], lang.tts, toast)}>🔊 듣기</button>
                <button type="button" className="chip-btn" onClick={() => copy(p)}>복사</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
