/* ══════════════════════════════════════════════════════════════════
   site.js — 모든 페이지에서 돌아가는 자잘한 것들
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* 푸터의 연도. HTML 에는 기본값을 적어 두어 JS 가 없어도 비지 않습니다. */
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (node) {
    node.textContent = year;
  });

  /* 같은 페이지 안의 앵커는 부드럽게 이동합니다.
     운영체제에서 애니메이션을 줄이도록 설정한 사용자는 건드리지 않습니다. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    /* 건너뛰기 링크는 브라우저에 맡깁니다. 가로채면 스크롤만 되고
       포커스가 본문으로 넘어가지 않습니다. */
    if (link.classList.contains("skip-link")) return;

    var id = link.getAttribute("href").slice(1);
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    /* 주소창의 해시도 맞춰 두어 새로 고침·공유가 같은 위치를 가리키게 합니다. */
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", "#" + id);
    }
  });
})();
