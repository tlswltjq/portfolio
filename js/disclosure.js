/* ══════════════════════════════════════════════════════════════════
   disclosure.js — “구현 상세 ＋ 펼치기” 서랍
   버튼과 패널을 aria-controls / aria-expanded 로 잇습니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const toggles = document.querySelectorAll("[data-disclosure]");
  if (!toggles.length) return;

  toggles.forEach(function (toggle) {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;

    const mark = toggle.querySelector("[data-disclosure-mark]");

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (mark) mark.textContent = open ? "－ 접기" : "＋ 펼치기";
    }

    setOpen(toggle.getAttribute("aria-expanded") === "true");

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  });
})();
