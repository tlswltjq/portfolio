/* ══════════════════════════════════════════════════════════════════
   portfolio-filter.js — 포트폴리오 목록 필터
   .seg 의 라디오가 바뀌면 data-tags 가 맞지 않는 카드를 숨기고,
   옆의 개수 표시를 함께 고칩니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var group = document.querySelector("[data-filter-group]");
  var list = document.querySelector("[data-project-list]");
  if (!group || !list) return;

  var counter = document.querySelector("[data-project-count]");
  var empty = document.querySelector("[data-empty-state]");
  var cards = Array.prototype.slice.call(list.querySelectorAll("[data-tags]"));
  var inputs = Array.prototype.slice.call(group.querySelectorAll("input[data-filter]"));

  function tagsOf(card) {
    return (card.getAttribute("data-tags") || "").trim().split(/\s+/);
  }

  function apply(filter) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = filter === "all" || tagsOf(card).indexOf(filter) !== -1;
      card.hidden = !match;
      if (match) shown += 1;
    });

    if (counter) {
      counter.textContent = shown + (shown === 1 ? " project" : " projects");
    }
    if (empty) {
      empty.hidden = shown !== 0;
    }
  }

  group.addEventListener("change", function (event) {
    var input = event.target;
    if (!input || !input.hasAttribute("data-filter")) return;
    apply(input.getAttribute("data-filter"));
  });

  /* 새로 고침으로 라디오 선택이 복원되는 경우까지 맞춥니다. */
  var checked = inputs.filter(function (input) { return input.checked; })[0];
  apply(checked ? checked.getAttribute("data-filter") : "all");
})();
