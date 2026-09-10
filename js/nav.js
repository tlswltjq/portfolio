/* ══════════════════════════════════════════════════════════════════
   nav.js — 좁은 화면의 메뉴 서랍
   햄버거 버튼이 [hidden] 을 여닫고, aria-expanded 로 상태를 알립니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("nav-drawer");
  if (!toggle || !drawer) return;

  var iconOpen = toggle.querySelector('[data-icon="open"]');
  var iconClose = toggle.querySelector('[data-icon="close"]');

  function setOpen(open) {
    drawer.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    if (iconOpen && iconClose) {
      iconOpen.hidden = open;
      iconClose.hidden = !open;
    }
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  setOpen(false);

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  /* 메뉴 밖을 누르면 닫습니다. */
  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (toggle.contains(event.target) || drawer.contains(event.target)) return;
    setOpen(false);
  });

  /* Esc 로 닫고 포커스를 버튼으로 되돌립니다. */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* 넓은 화면으로 돌아가면 서랍은 의미가 없으므로 닫습니다.
     (버튼이 display:none 이 되어 다시 닫을 방법이 사라집니다.) */
  var wide = window.matchMedia("(min-width: 781px)");
  var onChange = function (event) {
    if (event.matches) setOpen(false);
  };
  if (typeof wide.addEventListener === "function") {
    wide.addEventListener("change", onChange);
  } else if (typeof wide.addListener === "function") {
    wide.addListener(onChange); /* 구형 사파리 */
  }
})();
