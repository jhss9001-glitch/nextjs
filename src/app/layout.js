import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "K-Pharm Talk · 약사를 위한 외국어 복약지도 강의",
  description: "K-뷰티를 찾아 약국에 오는 외국인 고객, 이제 자신 있게 상담하세요. 약사를 위한 영어·중국어·일본어 복약지도 실전 강의.",
};

// 저장된 테마를 첫 페인트 전에 적용해 깜빡임을 막습니다.
const themeScript = `(function(){try{var t=localStorage.getItem("kpt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
