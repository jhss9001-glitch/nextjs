# K-Pharm Talk — reactjs → Next.js 이식 구현 계획

`reactjs/`(Vite + React)의 강의 홈페이지를 `nextjs/`에 **Next.js App Router**로 옮기는 계획입니다.

- **기준 버전:** `reactjs` 저장소의 커밋 `5cd6c7a`입니다. 강사진 무한 슬라이드와 일러스트까지 들어간 상태입니다.
- **목표:** 문구, 데이터, 디자인(클래스명·CSS), 동작을 reactjs와 **똑같이** 만드는 것입니다.
- **예외:** 주소 체계만 Next.js에 맞게 바꿉니다. `#/curriculum` 같은 해시 주소를 `/curriculum` 같은 실제 주소로 옮깁니다. 그 밖의 차이는 아래 "핵심 결정"에 적은 것만 허용합니다.

---

## 진행 상황 (2026-10-28)

- ✅ 1~4단계 구현 완료. `npm run lint`와 `npm run build`가 통과했고, 모든 경로가 정적(○)으로 생성됩니다.
- ✅ 5단계 자동 확인을 마쳤습니다. 브라우저 DevTools 프로토콜로 다음을 확인했습니다.
  - 모든 페이지에 콘솔 오류와 hydration 경고가 없습니다.
  - 페이지별 탭 제목이 맞습니다.
  - `/apply?plan=basic`에서 플랜이 미리 선택되고, 수강료 페이지 버튼을 누르면 `/apply?plan=pro`로 이동해 올인원이 선택됩니다.
  - 다크 모드가 새로고침 후에도 유지됩니다.
  - "무료 표현 들어보기"를 누르면 `#preview`로 스크롤됩니다.
  - 강사 슬라이드가 자동으로 넘어갑니다.
- ⬜ 5단계 나머지(모바일 폭, 퀴즈·신청서 입력 등 직접 클릭 확인)와 6단계 커밋·배포가 남았습니다.

### 계획과 달라진 점

- **`Providers.jsx`를 만들지 않음:** `ToastProvider` 자체가 클라이언트 컴포넌트라 layout에서 바로 감쌌습니다.
- **`useLocalStorage`를 없앰:** Next 린트 규칙(`react-hooks/set-state-in-effect`)에 걸려서 지웠습니다. `useTheme`는 상태 없이 `<html data-theme>`와 localStorage를 직접 바꿉니다. 저장된 값은 layout의 인라인 스크립트가 읽습니다.
- **`useInView`의 대체 처리를 뺌:** IntersectionObserver를 지원하지 않을 때 바로 보여주던 처리입니다. 지금 쓰이는 브라우저는 모두 지원합니다.
- **`Team`의 동작 줄이기 처리 방식을 바꿈:** `stop()`을 호출하는 대신 새 훅 `useReducedMotion`(`useSyncExternalStore`)으로 설정을 읽고, 그 값에 따라 Autoplay 플러그인 목록을 정합니다. Embla의 Autoplay는 `stop()` 뒤에도 마우스를 떼면 다시 재생되기 때문입니다.

## 시작 전 상태 (2026-10-28)

```
바탕 화면/react/
├─ vanilla/   ← 최초 HTML/CSS/JS 버전
├─ reactjs/   ← 이식 원본 (origin = github.com/jhss9001-glitch/reactjs.git)
└─ nextjs/    ← .git과 이 문서만 남김 (origin = github.com/jhss9001-glitch/nextjs.git)
```

- 예전 Next.js 이식본(vanilla 기준, 커밋 `8da632d`)의 파일은 모두 지웠습니다. 필요하면 git 기록에서 되살릴 수 있습니다.
- 개발 환경은 Node v24, npm 11입니다. 이전에 쓰던 Next.js는 16.4.3입니다.

### reactjs 구성

| 구분 | 파일 |
|---|---|
| 진입점 | `main.jsx`(ToastProvider로 감싸기), `App.jsx`(해시 라우팅, 페이지 구성, 선택 플랜 상태, 탭 제목) |
| 섹션 | `Hero` `ChatCard` `ForYou` `WhySection` `PhrasePreview` `Curriculum` `Steps` `LevelQuiz` `Team` `Portrait` `Pricing` `Faq` `ApplyForm` |
| 공통 | `Header` `Footer` `Reveal` `SectionHead` |
| 훅·유틸 | `useRoute` `useInView` `useLocalStorage` `useTheme` / `ToastContext` / `speak` `format` |
| 데이터·스타일 | `data.js`(NAV, 문구, 플랜, 강사 등 모든 콘텐츠), `styles.css` |
| 라이브러리 | `lucide-react`(아이콘), `embla-carousel-react` + `embla-carousel-autoplay`(강사 슬라이드) |

---

## 핵심 결정

### 1. 해시 라우팅을 실제 경로로 바꾸기

`useRoute.js`와 `App.jsx`의 `pages` 객체를 없애고, App Router 폴더 구조로 옮깁니다.

| reactjs 주소 | Next.js 경로 | 파일 | 내용 |
|---|---|---|---|
| `#/` | `/` | `app/page.jsx` | Hero → ForYou → WhySection → PhrasePreview |
| `#/why`, `#/preview` | `/#why`, `/#preview` | (홈 안의 섹션) | 해당 섹션으로 스크롤 |
| `#/curriculum` | `/curriculum` | `app/curriculum/page.jsx` | Curriculum + Steps |
| `#/quiz` | `/quiz` | `app/quiz/page.jsx` | LevelQuiz |
| `#/team` | `/team` | `app/team/page.jsx` | Team |
| `#/pricing` | `/pricing` | `app/pricing/page.jsx` | Pricing |
| `#/faq` | `/faq` | `app/faq/page.jsx` | Faq |
| `#/apply` | `/apply` | `app/apply/page.jsx` | ApplyForm |
| 없는 주소 | 404 | `app/not-found.jsx` | 안내 문구와 홈으로 가는 링크 |

- 모든 내부 링크는 `next/link`의 `<Link>`로 바꿉니다. 대상은 Header 메뉴, 로고, 수강 신청 버튼, Hero 버튼 2개, LevelQuiz의 "커리큘럼 보기", Pricing 버튼입니다.
- reactjs에서는 없는 주소가 홈으로 갔지만, Next.js에서는 404 페이지를 보여줍니다. 이것은 의도한 차이입니다.
- 페이지가 바뀔 때 맨 위로 이동하는 것은 Next.js가 기본으로 처리합니다. 그래서 `useRoute`의 `scrollTo`는 옮기지 않습니다.
- reactjs의 `<main key={pageKey}>`는 페이지가 바뀔 때 등장 애니메이션을 다시 실행하려는 용도였습니다. App Router도 페이지가 바뀌면 컴포넌트를 새로 그리므로 key가 필요 없습니다.

### 2. 선택한 플랜은 주소의 쿼리로 넘기기

- **reactjs:** `App`의 `selectedPlan` 상태를 Pricing과 ApplyForm에 props로 내려 줍니다.
- **Next.js:** 두 페이지가 서로 다른 경로라 상태를 공유하지 않습니다. 대신 Pricing 버튼을 `/apply?plan=pro` 형태의 링크로 만듭니다.
- **ApplyForm:**
  - `useSearchParams()`로 `plan`을 읽고, `PLANS`에 없는 값이면 기본 플랜(`featured`)을 씁니다.
  - 제출에 성공하면 지금처럼 폼을 비우고 기본 플랜으로 되돌립니다.
  - `useSearchParams`를 쓰는 컴포넌트는 `app/apply/page.jsx`에서 **`<Suspense>`로 감쌉니다.** 감싸지 않으면 프로덕션 빌드가 실패합니다(Next 문서의 "Missing Suspense boundary with useSearchParams"). 감싸 두면 페이지의 나머지는 정적으로 미리 만들어집니다.
- 이렇게 하면 `onSelectPlan`, `onPlanChange` props와 App의 상태가 필요 없어집니다.

### 3. 서버 컴포넌트와 클라이언트 컴포넌트 나누기

App Router의 컴포넌트는 기본이 서버 컴포넌트입니다. 상태, 이벤트, 브라우저 API를 쓰는 파일만 맨 위에 `"use client"`를 붙입니다.

| `"use client"` 필요 | 서버 컴포넌트로 둬도 됨 |
|---|---|
| `Header`(메뉴 열기, 스크롤, 테마, 현재 메뉴 표시) | `Hero`(안의 ChatCard만 클라이언트) |
| `ChatCard`(타이머) | `ForYou` `WhySection` `Curriculum` `Steps` `Faq` `Footer` `SectionHead` |
| `PhrasePreview`(필터, 음성, 복사, 토스트) | `Portrait`(SVG만 그림, `useId`는 서버에서도 동작) |
| `LevelQuiz` `Team`(Embla) `Pricing`(*) `ApplyForm` | |
| `Reveal`(IntersectionObserver) | |
| `ToastContext` → `Providers.jsx`로 감싸 layout에서 사용 | |

(*) Pricing은 링크만 남으므로 서버 컴포넌트로 둬도 됩니다. 다만 그 안에서 쓰는 `Reveal`은 클라이언트 컴포넌트입니다.

- 서버 컴포넌트가 클라이언트 컴포넌트에 **함수를 props로 넘길 수는 없습니다.** `data.js`의 lucide 아이콘(PAINS의 `icon`)은 서버 컴포넌트인 WhySection에서만 그리므로 문제없습니다.

### 4. 서버 렌더링 때 깨지는 브라우저 코드 고치기

Next.js는 페이지를 서버에서 먼저 그리므로, 렌더링 중에 `window`, `localStorage`, `matchMedia`를 바로 쓰면 오류가 나거나 화면이 어긋납니다(hydration 오류). 고칠 곳은 다음과 같습니다.

| 위치 | 지금 코드 | 바꿀 방법 |
|---|---|---|
| `useInView` | `useState(() => !("IntersectionObserver" in window))` | 초기값을 `false`로 두고, 지원 여부는 `useEffect` 안에서 확인합니다. |
| `useLocalStorage` | 초기값에서 `localStorage`를 바로 읽음 | 초기값은 `initial`로 두고, 저장된 값은 `useEffect`에서 읽어 반영합니다. |
| `Team` | 렌더링 중 `plugins()`에서 `matchMedia`를 호출함 | Autoplay 플러그인은 항상 넣습니다. 마운트 후 모션 줄이기 설정이면 `emblaApi.plugins().autoplay.stop()`을 호출합니다. |
| `ChatCard` | `useEffect` 안에서만 `matchMedia` 사용 | 그대로 둡니다. |
| `speak`, 클립보드 복사 | 클릭할 때만 실행 | 그대로 둡니다. |

### 5. 다크 모드가 깜빡이지 않게 하기

- **지금 문제:** reactjs는 저장된 테마를 `useEffect`에서 적용합니다. 서버에서 그린 HTML에서는 이 방식이면 첫 화면이 잠깐 라이트 모드로 보였다가 바뀝니다.
- **해결:** `app/layout.jsx`의 `<head>`에 짧은 인라인 스크립트를 넣습니다. 이 스크립트가 `localStorage`의 `kpt-theme`를 읽어 `document.documentElement.dataset.theme`를 화면이 그려지기 전에 설정합니다.
- 서버 HTML과 속성이 달라지므로 `<html lang="ko" suppressHydrationWarning>`로 둡니다.
- `useTheme`의 토글 로직과 저장 키(`kpt-theme`)는 그대로 씁니다.

### 6. 페이지 제목, 설명, 폰트

- **제목·설명:** `App.jsx`의 `document.title` 코드 대신 Next의 `metadata`를 씁니다.
  - `layout.jsx`의 title은 `{ default: "K-Pharm Talk · 약사를 위한 영어 복약지도 강의", template: "%s · K-Pharm Talk" }`입니다. description은 지금 `index.html`의 문구를 그대로 씁니다.
  - 각 `page.jsx`는 `export const metadata = { title: "커리큘럼" }`처럼 NAV의 라벨을 제목으로 씁니다. 수강 신청 페이지의 제목은 "수강 신청"입니다.
- **폰트:** Pretendard는 지금처럼 CDN `<link>`를 layout의 `<head>`에 넣습니다. 폰트 로딩 방식은 바꾸지 않습니다.

### 7. CSS 옮기기

- `styles.css`를 `app/globals.css`로 **그대로 복사**하고 `layout.jsx`에서 import합니다.
- 고칠 곳은 한 군데입니다. Next에는 `#root` 요소가 없으므로, `#root { min-height: 100vh; display: flex; flex-direction: column; }`를 `body`에 적용합니다. 이 규칙은 푸터를 화면 아래에 붙이는 용도입니다.
- `body::before`의 고정 배경 그라데이션, `.page { flex: 1 }`, 그 밖의 클래스는 그대로 둡니다.

### 8. Next 기본 설정

- **`cacheComponents: true`:** create-next-app 기본값이므로 유지합니다. 이 사이트는 데이터 요청이 없고 모든 내용이 `data.js`에 고정되어 있어서, `/apply`의 Suspense 말고는 따로 할 일이 없습니다.
- **Next 문서 먼저 확인:** 생성된 `AGENTS.md`의 안내대로, 코드를 쓰기 전에 `node_modules/next/dist/docs/`에서 다음 문서를 확인합니다. Next 16은 예전 버전과 API가 다를 수 있습니다.
  - `layouts-and-pages`
  - `linking-and-navigating`
  - `server-and-client-components`
  - `use-search-params`
  - `metadata`

---

## 파일 대응표

| reactjs | nextjs | 비고 |
|---|---|---|
| `index.html` | `src/app/layout.jsx` | `<html lang="ko">`, 메타데이터, 폰트 링크, 테마 스크립트 |
| `src/main.jsx` | `src/app/layout.jsx` + `src/components/Providers.jsx` | ToastProvider를 Providers로 감쌉니다. |
| `src/App.jsx` | `src/app/**/page.jsx` | 페이지 구성만 옮기고, 라우팅·상태·제목 코드는 삭제합니다. |
| `src/styles.css` | `src/app/globals.css` | `#root` 규칙만 `body`로 바꿉니다. |
| `src/data.js` | `src/lib/data.js` | 그대로 |
| `src/utils/speak.js` `format.js` | `src/lib/speak.js` `format.js` | 그대로 |
| `src/hooks/useInView.js` `useLocalStorage.js` | `src/hooks/` | 4번 항목대로 고칩니다. |
| `src/hooks/useTheme.js` | `src/hooks/useTheme.js` | 그대로 |
| `src/hooks/useRoute.js` | (삭제) | `usePathname`과 App Router가 대신합니다. |
| `src/context/ToastContext.jsx` | `src/context/ToastContext.jsx` | 맨 위에 `"use client"`를 붙입니다. |
| `src/components/*.jsx` | `src/components/*.jsx` | 확장자 `.jsx`를 유지해 reactjs와 비교하기 쉽게 합니다. |

### 컴포넌트별 바뀌는 점

| 컴포넌트 | 바뀌는 점 |
|---|---|
| `Header` | `route` prop 대신 `usePathname()`으로 현재 메뉴를 찾아 `aria-current="page"`를 붙입니다. 링크는 `<Link href="/curriculum">` 형태로 바꿉니다. 모바일 메뉴는 링크를 누르면 닫히는 지금 방식을 유지합니다. |
| `Hero` | "얼리버드로 시작하기"는 `/apply`, "무료 표현 들어보기"는 `/#preview`로 연결합니다. |
| `LevelQuiz` | "커리큘럼 보기"를 `<Link href="/curriculum">`로 바꿉니다. |
| `Pricing` | `onSelectPlan` prop을 없애고 버튼을 `<Link href={`/apply?plan=${p.id}`}>`로 바꿉니다. |
| `ApplyForm` | `plan`, `onPlanChange` props를 없앱니다. 플랜은 내부 상태로 두고 초기값은 쿼리에서 읽습니다(2번 항목). |
| `Team` | Autoplay에서 모션 줄이기를 처리하는 방식만 바꿉니다(4번 항목). |
| 나머지 | import 경로(`../data.js` → `@/lib/data.js`)와 `"use client"` 추가만 합니다. |

---

## 구현 단계

### 1단계: 프로젝트 생성

1. create-next-app은 폴더에 `PLAN.md`가 있으면 충돌로 멈춥니다. 그래서 이 문서를 잠시 `react/` 폴더로 옮깁니다. `.git`은 그대로 둬도 됩니다.
2. `react/` 폴더에서 아래 명령을 실행합니다. 그 밖의 질문은 기본값으로 답합니다.
   ```powershell
   npx create-next-app@latest nextjs --js --app --src-dir --eslint --no-tailwind --import-alias "@/*" --use-npm
   ```
3. `PLAN.md`를 다시 `nextjs/`로 옮깁니다.
4. reactjs와 같은 라이브러리를 설치합니다.
   ```powershell
   npm install lucide-react embla-carousel-react embla-carousel-autoplay
   ```
5. 예제 파일을 지웁니다: `page.module.css`, `public/*.svg`, 예제 `page.js`와 `globals.css`의 내용, `favicon.ico`(쓰지 않는 경우).
6. 앞의 8번 항목에 적은 Next 문서를 읽습니다.

### 2단계: 공통 기반

1. `globals.css`, `lib/data.js`, `lib/speak.js`, `lib/format.js`를 복사합니다.
2. 훅 3개와 `ToastContext`를 옮기고, 4번 항목대로 고칩니다.
3. `layout.jsx`를 만듭니다. 들어갈 것은 메타데이터, 폰트 링크, 테마 스크립트, `<Providers>`, `<Header />`, `<main className="page">{children}</main>`, `<Footer />`입니다.

### 3단계: 컴포넌트

1. 대응표 순서대로 컴포넌트를 복사하고, 필요한 파일에 `"use client"`를 붙입니다.
2. 링크를 `<Link>`로 바꾸고 props를 정리합니다(컴포넌트별 바뀌는 점 표).

### 4단계: 페이지

1. 홈, 6개 페이지, `not-found.jsx`를 만듭니다.
2. 페이지마다 `metadata`를 넣습니다.
3. `/apply`는 Suspense로 감쌉니다.

### 5단계: 검증

1. `npm run lint`와 `npm run build`가 통과해야 합니다. 빌드 결과에서 모든 경로가 정적(○) 또는 부분 사전 렌더링으로 표시되는지 봅니다.
2. `npm run dev`로 띄워 아래 목록을 reactjs와 나란히 비교합니다. 데스크톱과 모바일 폭(390px) 둘 다 봅니다.

| 영역 | 확인할 것 |
|---|---|
| 공통 | 배경이 경계 없이 하나로 이어지는지, 다크 모드 전환과 새로고침 후 유지(깜빡임 없음), 모바일 메뉴 열기·닫기, 현재 메뉴 강조, 페이지별 탭 제목 |
| 홈 | 상담 카드 3종 순환, "무료 표현 들어보기"를 누르면 표현 미리듣기로 스크롤, 스크롤 등장 애니메이션 |
| 표현 미리듣기 | 분류 필터, 듣기(영어 음성), 복사와 토스트 |
| 커리큘럼 | 합계 문구(5개 챕터 · 20강), 아코디언 |
| 레벨 테스트 | 4문제 진행, 정답·오답 표시, 결과, 다시 풀기, "커리큘럼 보기" 이동 |
| 강사진 | 무한 루프, 4.5초 자동 넘김, 마우스를 올리면 멈춤, 화살표, 점 표시, 스와이프, 일러스트 3종(박지희 약사 가운) |
| 수강료 | 할인율(베이직 20%, 올인원 29%), 플랜 버튼을 누르면 `/apply`에서 해당 플랜이 미리 선택됨 |
| 수강 신청 | 입력 검사 문구, 접수 토스트, 폼 초기화 |
| 접근성 | 기기의 "동작 줄이기"를 켜면 자동 넘김과 애니메이션이 멈춤 |

### 6단계: 커밋과 배포

1. `nextjs` 저장소에 커밋하고 push합니다.
2. Vercel에서 `nextjs` 저장소로 새 프로젝트를 만듭니다. Framework는 Next.js로 자동 인식되고 추가 설정은 없습니다.
3. 배포 주소에서 5단계 목록을 한 번 더 확인합니다.

---

## 하지 않는 것

- 문구, 가격, 강사 정보, 디자인은 바꾸지 않습니다. 콘텐츠 수정은 이식이 끝난 뒤 따로 합니다.
- TypeScript, Tailwind, 상태 관리 라이브러리는 추가하지 않습니다.
- 신청서를 실제로 저장하는 기능(서버 액션, DB)은 만들지 않습니다. 지금처럼 토스트만 띄웁니다.
- 예전 해시 주소(`#/team` 등)를 새 주소로 넘겨 주는 코드는 넣지 않습니다. reactjs 배포 주소는 따로 남아 있으므로 필요 없습니다.
