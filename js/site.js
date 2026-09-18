/* ══════════════════════════════════════════════════════════════════
   site.js — 모든 페이지에서 돌아가는 자잘한 것들
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* 푸터의 연도. HTML 에는 기본값을 적어 두어 JS 가 없어도 비지 않습니다. */
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = year;
  });

  /* 스크롤 위치에 따라 헤더에 경계를 주고, 맨 위로 이동 버튼을 노출합니다. */
  const header = document.querySelector(".site-header");
  const scrollTop = document.createElement("button");
  scrollTop.className = "scroll-top";
  scrollTop.type = "button";
  scrollTop.setAttribute("aria-label", "페이지 맨 위로 이동");
  scrollTop.setAttribute("aria-hidden", "true");
  scrollTop.tabIndex = -1;
  scrollTop.textContent = "↑";
  document.body.appendChild(scrollTop);
  const reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  let scrollQueued = false;
  function updateScrollUi() {
    const hasScrolled = window.scrollY > 16;
    const showScrollTop = window.scrollY > 480;

    if (header) header.toggleAttribute("data-scrolled", hasScrolled);
    scrollTop.classList.toggle("is-visible", showScrollTop);
    scrollTop.setAttribute("aria-hidden", String(!showScrollTop));
    scrollTop.tabIndex = showScrollTop ? 0 : -1;
    scrollQueued = false;
  }

  function scheduleScrollUi() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollUi);
  }

  window.addEventListener("scroll", scheduleScrollUi, { passive: true });
  updateScrollUi();

  scrollTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* 같은 페이지 안의 앵커는 부드럽게 이동합니다.
     운영체제에서 애니메이션을 줄이도록 설정한 사용자는 건드리지 않습니다. */
  document.addEventListener("click", function (event) {
    const link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    /* 건너뛰기 링크는 브라우저에 맡깁니다. 가로채면 스크롤만 되고
       포커스가 본문으로 넘어가지 않습니다. */
    if (link.classList.contains("skip-link")) return;

    const id = link.getAttribute("href").slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    /* 주소창의 해시도 맞춰 두어 새로 고침·공유가 같은 위치를 가리키게 합니다. */
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", "#" + id);
    }
  });

  /* JS가 꺼지면 콘텐츠를 숨기지 않는 점진적 스크롤 리빌입니다. */
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const revealTargets = document.querySelectorAll(
    "main > section, main > .container, .doc-item, .work, .entry, .project-card, .case"
  );
  if (!revealTargets.length) return;

  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

  revealTargets.forEach(function (target, index) {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", String(Math.min(index % 4, 3) * 45) + "ms");
    revealObserver.observe(target);
  });
})();
