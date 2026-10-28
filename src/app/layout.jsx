import "./globals.css";
import { ToastProvider } from "@/context/ToastContext.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

export const metadata = {
  title: {
    default: "K-Pharm Talk · 약사를 위한 영어 복약지도 강의",
    template: "%s · K-Pharm Talk",
  },
  description: "K-뷰티를 찾아 약국에 오는 외국인 고객, 이제 자신 있게 상담하세요. 약사를 위한 영어 복약지도 실전 강의.",
};

// 저장된 테마를 화면이 그려지기 전에 적용해 다크 모드 깜빡임을 막음
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("kpt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>
        <ToastProvider>
          <Header />
          <main className="page">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
