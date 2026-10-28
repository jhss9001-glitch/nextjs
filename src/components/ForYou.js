import Reveal from "./Reveal";
import { TARGETS, TEAM } from "@/lib/data";

export default function ForYou() {
  return (
    <section className="section section-tint">
      <div className="container two-col">
        <Reveal>
          <p className="eyebrow">For you</p>
          <h2>이런 약사님께 추천합니다</h2>
          <ul className="check-list" id="targetList">
            {TARGETS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </Reveal>
        <Reveal>
          <p className="eyebrow">Team</p>
          <h2>강사진</h2>
          <div className="team" id="teamList">
            {TEAM.map((m) => (
              <article className="card member" key={m.role}>
                <span className="avatar" aria-hidden="true">{m.emoji}</span>
                <div>
                  <h3>{m.role}</h3>
                  <p>{m.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
