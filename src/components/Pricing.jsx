import Link from "next/link";
import { PLANS } from "@/lib/data.js";
import { won } from "@/lib/format.js";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

export default function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHead eyebrow="Pricing" title="수강료" desc="모든 플랜은 수강 기간 내 무제한 반복 수강이 가능합니다." />
        <div className="pricing-grid">
          {PLANS.map((p) => {
            const off = p.price ? Math.round((1 - p.early / p.price) * 100) : 0;
            return (
              <Reveal as="article" className={`card plan${p.featured ? " featured" : ""}`} key={p.id}>
                {p.featured && <span className="plan-badge">가장 인기</span>}
                <h3>{p.name}</h3>
                <p className="plan-desc">{p.desc} · {p.period}</p>
                {p.price
                  ? <p className="price"><del>{won(p.price)}</del><b>{won(p.early)}</b><span className="off">{off}% 얼리버드</span></p>
                  : <p className="price"><b>별도 문의</b></p>}
                <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                {/* 신청서에서 이 플랜이 미리 선택되도록 주소에 담아 넘김 */}
                <Link
                  href={`/apply?plan=${p.id}`}
                  className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block`}
                >
                  {p.price ? "이 플랜으로 신청" : "단체 문의하기"}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
