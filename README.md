# K-Pharm Talk (Next.js)

K-뷰티 시대, 약사를 위한 외국어(영어·중국어·일본어) 복약지도 강의 홈페이지의 Next.js 버전입니다.
내용과 동작은 `vanilla/` 버전과 같습니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 정적 페이지로 빌드
npm run lint
```

## 파일 구성

- `src/app/layout.js` — html/head, metadata, 폰트, 테마 초기화 스크립트
- `src/app/page.js` — 섹션 배치
- `src/app/globals.css` — 스타일 (vanilla `style.css`와 동일)
- `src/lib/data.js` — 강의 콘텐츠 (표현, 커리큘럼, 퀴즈, 수강료, FAQ)
- `src/components/` — 섹션별 컴포넌트
- `src/context/` — 토스트, 선택된 플랜 공유
- `PLAN.md` — 이식 구현 계획
