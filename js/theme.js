/* ══════════════════════════════════════════════════════════════════
   theme.js — 시스템 설정을 따르는 라이트/다크 테마 토글
   사용자가 선택한 값은 localStorage의 site-theme에 유지합니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const KEY = "site-theme";
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const systemTheme = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : { matches: false };

  function savedTheme() {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === "dark" || saved === "light" ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    if (!toggle) return;
    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
    toggle.title = isDark ? "라이트 모드" : "다크 모드";
  }

  applyTheme(savedTheme() || (systemTheme.matches ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (error) {
        /* 저장할 수 없어도 현재 페이지의 테마 전환은 유지합니다. */
      }
    });
  }

  function followSystem(event) {
    if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
  }

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", followSystem);
  } else if (typeof systemTheme.addListener === "function") {
    systemTheme.addListener(followSystem);
  }
})();
