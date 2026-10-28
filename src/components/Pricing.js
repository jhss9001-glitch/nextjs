"use client";

import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { PLANS } from "@/lib/data";
import { won } from "@/lib/format";
import { usePlan } from "@/context/PlanContext";

export default function Pricing() {
  const { setPlan } = usePlan();

  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHead eyebrow="Pricing" title="수강료">
          <p className="section-desc">모든 플랜은 수강 기간 내 무제한 반복 수강이 가능합니다.</p>
        </SectionHead>
        <div className="pricing-grid" id="pricingGrid">
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
                {/* 누르면 신청서의 플랜을 미리 선택 */}
                <a
                  href="#apply"
                  className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block`}
                  data-plan={p.id}
                  onClick={() => setPlan(p.id)}
                >
                  {p.price ? "이 플랜으로 신청" : "단체 문의하기"}
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
