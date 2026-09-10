# 신지섭 포트폴리오 사이트

Claude Design 시안(`신지섭 포트폴리오 사이트.dc.html`, Industry 도면 시스템)을
정적 웹사이트로 옮긴 것입니다.

## 제약 조건

| 조건 | 지킨 방법 |
| --- | --- |
| React · Vue · jQuery · Bootstrap · Tailwind 금지 | 빌드 도구도 패키지도 없습니다. `<script src>` 로 불러오는 외부 JS는 0개입니다. |
| 순수 HTML · CSS · JavaScript | 페이지 5장, CSS 5장, JS 5장. 전부 표준 문법이고 트랜스파일이 필요 없습니다. |
| 웹 폰트(Google Fonts) 허용 | Barlow · Barlow Condensed(제목), IBM Plex Sans KR(한글), IBM Plex Mono(라벨). |
| 아이콘(Font Awesome) 허용 | 쓰지 않았습니다. GitHub·햄버거·닫기 아이콘은 인라인 SVG 3개뿐이라 요청 한 번을 아끼는 쪽이 낫다고 봤습니다. 필요하면 Font Awesome으로 바꿔도 됩니다. |

## 실행

```bash
open index.html            # 그냥 열어도 전부 동작합니다
python3 -m http.server 8000  # 또는 로컬 서버로
```

빌드 단계가 없으므로 파일을 고치고 새로 고치면 바로 반영됩니다.

## 구조

```
portfolio-site/
├── index.html          Home        — 정체성 → 기술 → 대표 작업 → 학력·대외활동
├── resume.html         Resume      — 좁은 단의 문서형 이력서 (인쇄 시 A4 2장)
├── portfolio.html      Portfolio   — 문제 중심 목록 + 분야 필터
├── project-esd.html    Detail      — ESD · 문제 → 원인 → 해결 → 결과 4건
├── contact.html        Contact     — 연락처 + 문의 폼
├── css/
│   ├── tokens.css      색 · 타입 · 간격 변수 (여기만 고치면 전체가 따라옵니다)
│   ├── base.css        리셋 · 요소 타이포그래피 · 레이아웃 뼈대 · 유틸리티
│   ├── components.css  .nav .btn .tag .blueprint .table .field .seg .stat-grid
│   ├── pages.css       페이지별 레이아웃 + 반응형
│   └── print.css       이력서 인쇄(A4)
├── js/
│   ├── site.js             푸터 연도, 페이지 내 앵커 부드러운 이동
│   ├── nav.js              좁은 화면 메뉴 서랍
│   ├── portfolio-filter.js 포트폴리오 분야 필터
│   ├── disclosure.js       “구현 상세 ＋ 펼치기” 서랍
│   └── contact-form.js     문의 폼 검증 + mailto 조립
└── assets/
    └── resume-jiseop-shin.pdf
```

각 JS 파일은 자기 요소가 없는 페이지에서는 조용히 아무 일도 하지 않으므로,
어느 페이지에 어떤 스크립트를 넣든 안전합니다.

## 동작하는 것들

- **분야 필터** — 카드의 `data-tags` 와 라디오의 `data-filter` 를 맞춰 걸러내고
  옆의 “N projects” 를 함께 고칩니다. 분류를 바꾸려면 카드의 `data-tags` 만 고치면 됩니다.
- **구현 상세 서랍** — `aria-expanded` / `aria-controls` 로 버튼과 패널을 잇고,
  라벨이 `＋ 펼치기` ↔ `－ 접기` 로 바뀝니다.
- **문의 폼** — 서버가 없으므로 검증을 통과하면 입력값으로 `mailto:` 를 조립해
  메일 앱을 엽니다. 칸별 오류 메시지, 첫 오류 칸으로 포커스 이동, 고치는 즉시 오류 해제.
- **메뉴 서랍** — 780px 이하에서 햄버거가 나오고, 바깥 클릭·Esc·창을 넓히면 닫힙니다.
- **이력서 인쇄** — `print.css` 가 내비게이션·푸터·버튼을 걷어내고 A4 2장으로 맞춥니다.
  브라우저 인쇄(⌘P)로 PDF를 뽑으면 됩니다.

## 시안과 달리한 부분

1. **SNG · Mini-pay · JobMate 상세 페이지** — 시안에서는 네 카드가 모두 `View details →`
   지만 실제로 그려진 상세는 ESD 하나뿐입니다. 없는 페이지로 보내는 대신, 세 프로젝트는
   `이력서에서 보기 →` 로 이력서의 해당 항목(`resume.html#proj-sng` 등)으로 보냅니다.
   상세를 추가하면 이 링크만 바꾸면 됩니다.
2. **구현 상세 패널의 내용** — 시안에는 접힌 줄의 요약만 있고 펼친 내용이 없습니다.
   요약에 적힌 항목을 목록으로 펼치고, 아직 정리 중이라는 것과 저장소 링크를 함께 두었습니다.
   실제 기록이 생기면 `project-esd.html` 의 `.case-more-panel` 안을 채우면 됩니다.
3. **한글 줄바꿈** — `word-break: keep-all` 을 넣어 “원인/을 찾아” 처럼 어절이 잘리지
   않게 했습니다.
4. **푸터** — 내용이 짧은 페이지에서 푸터가 화면 중간에 뜨지 않도록 바닥에 붙였습니다.

## 바꿔야 하는 자리

- **프로필 사진** — `index.html` 의 `.hero-figure` 안이 해칭 자리 표시입니다.
  `<p class="hatch-label">…</p>` 를 지우고 `<img src="assets/profile.jpg" alt="신지섭">` 을
  넣으면 `.duotone` 이 흑백 + 잉크 틴트로 눌러 줍니다. `class="duotone hatch"` 는 그대로 두세요.
- **이력서 PDF** — `assets/resume-jiseop-shin.pdf` 는 `~/Downloads/이력서.pdf` 를 복사해 둔
  것입니다. 최신본으로 덮어쓰거나, `resume.html` · `index.html` · `contact.html` 의
  세 군데 링크를 고치세요.
- **연락처** — 이메일(`wltjq1203@icloud.com`)과 전화번호가 여러 파일에 들어 있습니다.
  바꿀 때 `grep -rn "wltjq1203" .` 로 한 번에 찾으세요.

## 상세 페이지 추가하기

`project-esd.html` 을 복사해 쓰는 것이 가장 빠릅니다. 한 사례는 이 뼈대입니다.

```html
<article class="case">
  <div class="case-title">
    <span class="case-no">CASE 01</span><h3>제목</h3>
  </div>
  <div class="case-grid">
    <div class="case-label">PROBLEM</div>  <p>…</p>
    <div class="case-label">CAUSE</div>    <p>…</p>
    <div class="case-label">SOLUTION</div> <p>…</p>
    <div class="case-label">RESULT</div>
    <div>
      <div class="blueprint stat-grid stat-grid--3">
        <i class="corner tl"></i><i class="corner tr"></i>
        <i class="corner bl"></i><i class="corner br"></i>
        <div class="stat">
          <div class="stat-value">8 → 0건</div>
          <div class="stat-label">설명</div>
        </div>
        <!-- stat 2개 더 -->
      </div>
      <p class="note">측정 조건</p>
    </div>
  </div>
</article>
```

`.blueprint` 를 쓸 때 `<i class="corner …">` 네 개를 빠뜨리지 마세요. 모서리 등록 마크가
이 디자인 시스템의 서명입니다.

## 디자인 토큰

`css/tokens.css` 하나만 고치면 전체 톤이 따라옵니다.

- `--color-accent: #5980a6` — 청사진 잉크. 100~900 램프가 함께 있습니다.
- `--color-bg: #f2f2f3` / `--color-text: #1d1f20` — 종이와 잉크
- `--page-max: 1180px` / `--page-pad: 44px` — 시안 아트보드와 같은 폭
- `--section-gap: 88px` — 섹션 사이 리듬

## 확인한 것

- Chrome 헤드리스로 5개 페이지 렌더 확인 (데스크톱 1280px · 모바일 375px)
- 필터 5종, 서랍 4개, 폼 검증 3칸, 메뉴 서랍(햄버거·Esc·바깥 클릭) 동작 확인
- 내부 링크 · 앵커 · `aria-controls` 대상 · 태그 균형 전수 검사
- 이력서 인쇄 결과 A4 2장
