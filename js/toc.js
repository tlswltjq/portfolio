/* ══════════════════════════════════════════════════════════════════
   toc.js — 이력서 목차의 “지금 읽는 곳” 표시
   스크롤할 때마다 기준선(뷰포트 위 140px)을 마지막으로 지나온 섹션을
   찾아 aria-current 를 옮겨 답니다. 이동 자체는 site.js 의 앵커 처리가
   맡습니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var toc = document.getElementById("doc-toc");
  if (!toc) return;

  /* 링크와 대상 섹션을 짝지어 두고, 사라진 id 는 버립니다. */
  var entries = [];
  Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (link) {
    var target = document.getElementById(link.getAttribute("href").slice(1));
    if (target) entries.push({ link: link, target: target });
  });
  if (!entries.length) return;

  var LINE = 140;   /* 도구 띠 아래, 눈이 머무는 높이 */
  var current = null;

  function activeEntry() {
    /* 바닥에 닿으면 마지막 항목을 켭니다. 더 스크롤할 여지가 없어
       기준선만으로는 마지막 섹션이 영영 선택되지 않기 때문입니다. */
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
      return entries[entries.length - 1];
    }
    var found = null;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].target.getBoundingClientRect().top <= LINE) found = entries[i];
    }
    return found;   /* 첫 섹션 위(문서 머리)에서는 아무것도 켜지 않습니다. */
  }

  function update() {
    var next = activeEntry();
    if (next === current) return;

    if (current) current.link.removeAttribute("aria-current");
    current = next;
    if (!current) return;

    current.link.setAttribute("aria-current", "location");

    /* 목차 자체가 넘쳐서 스크롤될 때만, 켜진 항목을 보이는 곳으로 끌어옵니다. */
    if (toc.scrollHeight > toc.clientHeight + 1) {
      var box = toc.getBoundingClientRect();
      var item = current.link.getBoundingClientRect();
      if (item.top < box.top || item.bottom > box.bottom) {
        toc.scrollTop += item.top - box.top - box.height / 2 + item.height / 2;
      }
    }
  }

  /* 스크롤 이벤트마다 계산하지 않고 프레임당 한 번으로 묶습니다. */
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
})();
