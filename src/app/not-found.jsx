import Link from "next/link";

export const metadata = { title: "페이지를 찾을 수 없습니다" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow section-head">
        <p className="eyebrow">404</p>
        <h2>페이지를 찾을 수 없습니다</h2>
        <p className="section-desc">주소가 바뀌었거나 없는 페이지입니다.</p>
        <Link href="/" className="btn btn-primary">홈으로 가기</Link>
      </div>
    </section>
  );
}
