# K-Pharm Talk — Next.js 이식 구현 계획

`vanilla/`의 강의 홈페이지(HTML/CSS/JS)를 `nextjs/` 폴더에 Next.js로 옮기기 위한 계획입니다.
**목표는 내용·화면·동작이 vanilla와 똑같은 Next.js 버전**을 만드는 것입니다. 문구, 데이터, 클래스명, 동작 순서를 바꾸지 않습니다.

> `reactjs/`는 이후 캐러셀(embla), 아이콘(lucide), 라우팅(useRoute), Portrait/Team 컴포넌트 등이 추가되어
> vanilla와 달라졌습니다. **기준은 항상 `vanilla/`** 이고, `reactjs/`의 컴포넌트는 구조를 참고하는 용도로만 씁니다.

---

## 현재 상태

```
바탕 화면/react/
├─ vanilla/   ← .git (origin = github.com/jhss9001-glitch/react.git)
├─ reactjs/   ← .git (origin = github.com/jhss9001-glitch/reactjs.git)
└─ nextjs/    ← 이 계획 문서만 있음
```

- vanilla 구성: `index.html`(240줄) · `style.css`(430줄) · `data.js`(237줄) · `app.js`(419줄)
- 개발 환경: Node v24, npm 11, Next.js 16.4.3, React 19.3

## 진행 상황 (2026-10-28)

- ✅ 0~4단계 구현 완료 · `npm run lint` / `npm run build` 통과, `/`가 정적(○)으로 생성됨
- ✅ 서버 HTML 확인: 문구, 커리큘럼 합계(5개 챕터 · 20강 · 약 5시간 10분), 할인율, 신청서 기본 플랜(올인원)이 vanilla와 같음
- ⬜ 5단계 브라우저 체크리스트 (직접 클릭해서 확인 필요)
- ⬜ 7단계 Vercel 배포

---

## 0단계: 저장소

reactjs와 같은 방식으로 **별도 GitHub 저장소**로 관리합니다.

1. GitHub에서 빈 저장소 `nextjs`를 만듭니다. README·.gitignore·라이선스는 추가하지 않습니다.
2. `nextjs/`에서 `git init` 후 `origin`을 `nextjs.git`으로 지정합니다. (6단계)

---

## 1단계: 프로젝트 생성

- **Next.js (App Router) + JavaScript**로 만듭니다. TypeScript·Tailwind는 쓰지 않습니다.
- `react/` 폴더에서 실행합니다.
  ```powershell
  npx create-next-app@latest nextjs --js --app --src-dir --eslint --no-tailwind --import-alias "@/*"
  cd nextjs
  ```
  - `nextjs/` 폴더에 이 문서가 있어서 생성이 막히면, 문서를 잠시 다른 곳에 옮겼다가 다시 넣습니다.
  - 그 밖의 질문(Turbopack 등)은 기본값을 고릅니다.
- 기본 예제는 지웁니다: `src/app/page.module.css`, `public/*.svg`, `page.js`의 예제 코드, `globals.css`의 기본 내용
- 외부 라이브러리는 추가하지 않습니다. 상태 관리도 React 기본 기능(`useState`, `useEffect`, Context)만 씁니다.

---

## 2단계: 그대로 가져올 것

| vanilla | nextjs | 바꿀 점 |
|---|---|---|
| `style.css` | `src/app/globals.css` | **그대로 복사.** `layout.js`에서 import합니다. 클래스명이 같으므로 화면도 같습니다. |
| `data.js` | `src/lib/data.js` | 각 상수 앞에 `export`만 붙입니다. 내용은 한 글자도 바꾸지 않습니다. |
| `<html lang="ko">` | `layout.js`의 `<html lang="ko">` | |
| `<title>`, description meta | `layout.js`의 `export const metadata` | 문구 그대로 |
| Pretendard 폰트 `<link>` | `layout.js`의 `<head>` 안 `<link>` | 같은 CDN 주소(`pretendard@v1.3.9`) 그대로 |
| 정적 마크업(제목, 설명, 버튼 문구 등) | 각 컴포넌트의 JSX | 문구·태그·`id`·`aria-*` 그대로 |

---

## 3단계: 폴더·컴포넌트 구성

vanilla `index.html`의 섹션 하나를 컴포넌트 하나로 옮깁니다.
**상호작용이 없는 섹션은 서버 컴포넌트**, 상태·이벤트·브라우저 API를 쓰는 것만 `"use client"`로 만듭니다.

```
nextjs/
├─ package.json
├─ next.config.mjs
├─ PLAN.md
└─ src/
   ├─ app/
   │  ├─ layout.js            ← html/head/body, metadata, 폰트, 테마 초기화 스크립트, Providers
   │  ├─ page.js              ← 섹션 배치 (서버 컴포넌트)
   │  └─ globals.css          ← vanilla style.css
   ├─ lib/
   │  ├─ data.js              ← vanilla data.js + export
   │  ├─ format.js            ← won()
   │  ├─ speak.js             ← speechSynthesis (클라이언트에서만 호출)
   │  └─ storage.js           ← try/catch로 감싼 localStorage get/set + useStoredValue 훅
   ├─ context/
   │  ├─ ToastContext.js      ← "use client" · 토스트 표시 + useToast()
   │  └─ PlanContext.js       ← "use client" · 선택된 플랜 (Pricing ↔ ApplyForm 공유)
   └─ components/
      ├─ Providers.js         ← "use client" · ToastProvider + PlanProvider
      ├─ Reveal.js            ← "use client" · 스크롤 등장 효과 래퍼
      ├─ SectionHead.js       ←  서버 · eyebrow / 제목 / 설명 묶음
      ├─ Header.js            ← "use client" · 메뉴, 테마 버튼, 스크롤 그림자
      ├─ Hero.js              ←  서버 · 문구 + 강의 통계(CURRICULUM으로 계산)
      ├─ ChatCard.js          ← "use client" · EN → ZH → JA 순환 대화
      ├─ WhySection.js        ←  서버 · PAINS 카드
      ├─ PhrasePreview.js     ← "use client" · 분류·언어 탭, 듣기·복사
      ├─ Curriculum.js        ←  서버 · <details> 아코디언 + 합계 문구
      ├─ Steps.js             ←  서버 · 학습 방식 4단계
      ├─ LevelQuiz.js         ← "use client" · 문제 진행, 결과, 다시 풀기
      ├─ ForYou.js            ←  서버 · 추천 대상 + 강사진
      ├─ Pricing.js           ← "use client" · 플랜 카드 (플랜 선택)
      ├─ Faq.js               ←  서버 · <details>
      ├─ ApplyForm.js         ← "use client" · 수강 신청서
      └─ Footer.js            ←  서버
```

`page.js`의 섹션 순서는 vanilla와 같습니다.

> Header → Hero → WhySection → PhrasePreview → Curriculum → Steps → LevelQuiz → ForYou → Pricing → Faq → ApplyForm → Footer

- 서버 컴포넌트 안에 `<Reveal>`(클라이언트)을 넣고 그 children으로 서버 마크업을 넘기는 것은 문제없습니다.
- `Providers`는 `layout.js`의 `<body>`에서 페이지 전체를 감싸고, 토스트 `<div className="toast" role="status">`도 여기서 렌더링합니다.

---

## 4단계: vanilla 동작을 Next.js 방식으로 옮기기

### 대응표

| vanilla (`app.js`) | Next.js |
|---|---|
| `innerHTML` + 템플릿 문자열 | JSX + `.map()`. 이스케이프는 React가 하므로 `esc()`는 필요 없음 |
| `store.get/set` | `lib/storage.js`. **`useEffect`·이벤트 핸들러 안에서만** 호출 (서버에는 localStorage가 없음) |
| `initTheme()` | ① `layout.js` `<head>`의 인라인 `<script>`가 페인트 전에 `kpt-theme`을 읽어 `data-theme` 설정 (깜빡임 방지) ② Header의 테마 버튼은 vanilla와 같은 로직으로 전환·저장. `<html>`에 `suppressHydrationWarning` |
| `initMenu()` | Header의 `useState(open)` → `nav`에 `open` 클래스, 버튼 `aria-expanded`. 메뉴 링크 클릭 시 닫힘 |
| `initHeaderShadow()` | Header의 `useEffect`에서 scroll 리스너(passive) 등록, 처음 1회 실행, 정리 |
| `renderHeroStats()` | Hero(서버)에서 계산해 렌더링. `Math.round(minutes / 60)` 그대로 |
| `initHeroChat()`의 `setInterval(5200)` | ChatCard의 `useEffect` + `clearInterval`. 말풍선 묶음에 `key={lang.code}`를 줘서 애니메이션 재실행. `animationDelay: i * 0.6s`. `prefers-reduced-motion`이면 순환하지 않음 |
| `previewState` | PhrasePreview의 `useState("all")` + `useStoredValue("kpt-lang", "en")`(`useSyncExternalStore` 기반, 서버·하이드레이션 때는 `en`). 탭 클릭 시 저장 |
| 듣기·복사 이벤트 위임 | 카드 버튼마다 `onClick`. 복사 문자열 `` `${외국어}\n(${ko})` ``와 성공·실패 토스트 문구 그대로 |
| `speak()` | `lib/speak.js`. 미지원 시 토스트를 띄워야 하므로 `toast` 함수를 인자로 받음. `rate 0.9`, 목소리 선택 로직 그대로 |
| `quiz` 객체 + `locked` | LevelQuiz의 `useState({ idx, score, picked })`. `picked`가 있으면 버튼 `disabled`, 정답 `correct` / 고른 오답 `wrong` |
| 다음 문제 `setTimeout(1300)` | `picked`가 생기면 `useEffect`에서 1.3초 뒤 다음 문제로, 정리 함수에서 `clearTimeout` |
| 퀴즈 결과 선택 | `[...QUIZ_RESULTS].reverse().find(r => score >= r.min)` 그대로 |
| 플랜 버튼 → `#applyPlan` 값 변경 | `PlanContext`. Pricing 버튼 `onClick`에서 `setPlan(p.id)`, 링크는 `href="#apply"` 그대로. ApplyForm의 `<select>`가 같은 값을 사용. 기본값은 `featured` 플랜 |
| 신청서 `FormData` 검사 | 제어 컴포넌트(입력값을 상태로). **검사 순서·정규식·오류 문구 그대로**: 이름 → 이메일 → 관심 언어 → 동의. 성공 시 폼 초기화 + 플랜을 featured로 되돌림 + 접수 토스트 |
| `toast()` (2.6초) | `ToastContext`의 `useToast()`. 연속 호출 시 이전 타이머를 지우고 다시 2.6초 |
| `initReveal()` (threshold 0.12) | `<Reveal as="article" className="card pain">`처럼 감싸면 자기 요소를 관찰하고 보이면 `in` 클래스를 DOM에 직접 추가(vanilla와 동일) 후 관찰 해제. IntersectionObserver 미지원이면 바로 `in` |
| `<details>` (커리큘럼, FAQ) | 그대로 사용. 커리큘럼 첫 챕터만 `open`. 커리큘럼은 `<Reveal as="details" open={i === 0}>` |

### Next.js로 옮길 때 주의할 점

- **하이드레이션 불일치 방지**: `window`, `localStorage`, `matchMedia`, `speechSynthesis`, `navigator.clipboard`는 렌더링 중에 읽지 않고 `useEffect`나 핸들러 안에서만 씁니다. 서버와 첫 클라이언트 렌더 결과가 같아야 합니다.
  - 그래서 언어 탭은 처음에 `en`으로 그려진 뒤 저장된 언어로 바뀝니다. 다른 언어를 저장해 둔 경우 아주 짧게 바뀌는 것이 보일 수 있습니다.
- 같은 페이지 안 이동(`#why`, `#apply` 등)은 `next/link`가 아니라 **일반 `<a href="#...">`** 를 씁니다.
- `globals.css`의 `html { scroll-behavior: smooth }`가 그대로 동작하도록 `<html>`에 `data-scroll-behavior="smooth"`를 붙입니다.
- `className`, `htmlFor`, 객체 `style`(`style={{ width: "50%" }}`), boolean `aria-selected` / `aria-expanded`를 씁니다.
- 개발 모드에서는 StrictMode로 effect가 두 번 실행되므로 **타이머·리스너·observer는 반드시 정리**합니다.
- 폼은 서버로 보내지 않습니다(vanilla와 동일). Server Action이나 API Route는 만들지 않습니다.
- 퀴즈 진행 막대 너비처럼 계산되는 값은 인라인 style로 둡니다(vanilla와 동일).

---

## 5단계: 확인

1. `npm run dev`로 띄우고 vanilla `index.html`과 **나란히 놓고 비교**합니다.
2. 기능 체크리스트
   - [ ] 모든 문구·데이터가 vanilla와 같음 (섹션별로 눈으로 대조)
   - [ ] 다크 모드 전환, 새로고침 후 유지, 새로고침 시 흰 화면 깜빡임 없음
   - [ ] 모바일 메뉴 열고 닫기, 메뉴 클릭 시 닫힘
   - [ ] 스크롤 시 헤더 그림자
   - [ ] 히어로 대화가 EN → ZH → JA로 순환, 말풍선 애니메이션
   - [ ] 표현 분류 필터, 언어 탭, 새로고침 후 언어 유지
   - [ ] 표현 듣기(음성), 복사 + 토스트
   - [ ] 히어로 통계와 커리큘럼 합계(5개 챕터 · 20강 · 시간/분)가 vanilla와 같음
   - [ ] 퀴즈 정답·오답 표시, 결과 화면, 다시 풀기
   - [ ] 플랜 버튼을 누르면 신청서 플랜이 미리 선택됨
   - [ ] 신청서 오류 4가지, 접수 토스트, 접수 후 폼·플랜 초기화
   - [ ] 스크롤하면 섹션이 나타나는 효과
   - [ ] 반응형: 1000px / 860px / 560px 화면 폭
   - [ ] 브라우저 콘솔에 hydration 경고 없음
3. `npm run build`가 오류 없이 끝나고, 페이지가 정적(○ Static)으로 생성되는지 확인합니다.
4. `npm run lint` 통과

---

## 6단계: 커밋과 push

1. `.gitignore`에 `node_modules`, `.next`가 들어 있는지 확인합니다(create-next-app 기본 포함).
2. `nextjs/` 폴더에서 커밋합니다. 예: `K-Pharm Talk Next.js 버전`
3. 원격 저장소를 연결하고 push합니다.
   ```powershell
   git branch -M main
   git remote add origin https://github.com/jhss9001-glitch/nextjs.git
   git push -u origin main
   ```

---

## 7단계: 배포 (Vercel)

1. Vercel에서 **Add New → Project**로 `nextjs` 저장소를 가져옵니다.
2. Framework Preset이 **Next.js**로 자동 선택되는지 확인합니다. Root Directory·Build 설정은 기본값 그대로 둡니다.
3. Deploy 후 배포 주소에서 5단계 체크리스트를 다시 확인합니다.
4. 이후 `main`에 push할 때마다 자동으로 다시 배포됩니다.
