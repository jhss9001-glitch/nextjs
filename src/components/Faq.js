import SectionHead from "./SectionHead";
import { FAQS } from "@/lib/data";

export default function Faq() {
  return (
    <section className="section section-tint" id="faq">
      <div className="container narrow">
        <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />
        <div className="faq" id="faqList">
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
