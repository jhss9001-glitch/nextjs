# K-Pharm Talk — Next.js

K-뷰티 시대, 약사를 위한 영어 복약지도 강의 홈페이지의 Next.js(App Router) 버전입니다.
`reactjs/`(Vite + React) 버전을 옮긴 것이며, 이식 계획과 진행 상황은 [PLAN.md](PLAN.md)에 있습니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드 (모든 페이지 정적 생성)
npm run lint
```

## 구조

- `src/app/` — 페이지(`/`, `/curriculum`, `/quiz`, `/team`, `/pricing`, `/faq`, `/apply`), 레이아웃, 전역 CSS
- `src/components/` — 화면 구성 요소
- `src/lib/data.js` — 메뉴, 문구, 커리큘럼, 플랜, 강사 등 **모든 콘텐츠** (내용 수정은 여기서)
- `src/hooks/`, `src/context/` — 스크롤 등장 효과, 동작 줄이기 감지, 다크 모드, 토스트
