"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { QUIZ, QUIZ_RESULTS } from "@/lib/data";

const INITIAL = { idx: 0, score: 0, picked: null };

export default function LevelQuiz() {
  const [quiz, setQuiz] = useState(INITIAL);
  const { idx, score, picked } = quiz;

  // 답을 고르면 1.3초 뒤 다음 문제로 넘어갑니다.
  useEffect(() => {
    if (picked === null) return;
    const timer = setTimeout(() => setQuiz((q) => ({ ...q, idx: q.idx + 1, picked: null })), 1300);
    return () => clearTimeout(timer);
  }, [picked]);

  const pick = (i) => {
    if (picked !== null) return;
    setQuiz((q) => ({ ...q, picked: i, score: q.score + (i === QUIZ[q.idx].answer ? 1 : 0) }));
  };

  let content;
  if (idx >= QUIZ.length) {
    const result = [...QUIZ_RESULTS].reverse().find((r) => score >= r.min);
    content = (
      <div className="quiz-result">
        <p className="score">{score} <small>/ {QUIZ.length}</small></p>
        <h3>{result.title}</h3>
        <p>{result.text}</p>
        <div className="quiz-result-actions">
          <a href="#curriculum" className="btn btn-ghost">커리큘럼 보기</a>
          <button type="button" className="btn btn-primary" id="quizRetry" onClick={() => setQuiz(INITIAL)}>다시 풀기</button>
        </div>
      </div>
    );
  } else {
    const item = QUIZ[idx];
    const optClass = (i) => {
      if (picked === null) return "opt";
      if (i === item.answer) return "opt correct";
      if (i === picked) return "opt wrong";
      return "opt";
    };
    content = (
      <>
        <div className="quiz-progress" aria-hidden="true">
          <span style={{ width: `${(idx / QUIZ.length) * 100}%` }}></span>
        </div>
        <p className="quiz-count">문제 {idx + 1} / {QUIZ.length}</p>
        <h3 className="quiz-q">{item.q}</h3>
        <div className="quiz-options">
          {item.options.map((o, i) => (
            <button key={o} type="button" className={optClass(i)} disabled={picked !== null} onClick={() => pick(i)}>{o}</button>
          ))}
        </div>
        <p className="quiz-feedback" aria-live="polite">
          {picked === null ? "" : picked === item.answer ? "정답입니다! 👏" : `정답은 “${item.options[item.answer]}”입니다.`}
        </p>
      </>
    );
  }

  return (
    <section className="section" id="quiz">
      <div className="container narrow">
        <SectionHead eyebrow="Level test" title="1분 레벨 테스트">
          <p className="section-desc">4문제로 나에게 맞는 시작 단계를 추천해 드립니다.</p>
        </SectionHead>
        <Reveal className="quiz-card" id="quizCard">{content}</Reveal>
      </div>
    </section>
  );
}
