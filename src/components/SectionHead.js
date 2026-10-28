import Reveal from "./Reveal";

export default function SectionHead({ eyebrow, title, children }) {
  return (
    <Reveal className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}
