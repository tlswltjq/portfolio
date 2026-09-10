/* ══════════════════════════════════════════════════════════════════
   contact-form.js — 문의 폼
   서버가 없는 정적 사이트이므로, 검증을 통과하면 입력값으로 mailto:
   링크를 만들어 사용자의 메일 앱을 엽니다. 시안의 “보내신 내용은 위
   이메일로 전달됩니다” 를 그대로 구현한 것입니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var TO = form.getAttribute("data-mailto") || "";
  var status = form.querySelector("[data-form-status]");

  var fields = [
    {
      input: form.querySelector("#c-name"),
      error: form.querySelector("#c-name-error"),
      validate: function (value) {
        if (!value) return "이름을 적어주세요.";
        return "";
      }
    },
    {
      input: form.querySelector("#c-mail"),
      error: form.querySelector("#c-mail-error"),
      validate: function (value) {
        if (!value) return "이메일을 적어주세요.";
        /* 답장을 보낼 수 있는 형태인지만 봅니다. */
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "이메일 형식을 확인해주세요.";
        return "";
      }
    },
    {
      input: form.querySelector("#c-msg"),
      error: form.querySelector("#c-msg-error"),
      validate: function (value) {
        if (!value) return "문의 내용을 적어주세요.";
        if (value.length < 10) return "10자 이상 적어주세요.";
        return "";
      }
    }
  ].filter(function (field) { return field.input && field.error; });

  function show(field, message) {
    field.error.textContent = message;
    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
    return !message;
  }

  function check(field) {
    return show(field, field.validate(field.input.value.trim()));
  }

  /* 한 번 틀린 칸은 고치는 즉시 오류를 지웁니다. */
  fields.forEach(function (field) {
    field.input.addEventListener("input", function () {
      if (field.input.getAttribute("aria-invalid") === "true") check(field);
    });
    field.input.addEventListener("blur", function () {
      if (field.input.value.trim()) check(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (status) status.textContent = "";

    /* every 로 감싸면 첫 오류에서 멈춰 나머지 칸이 검사되지 않습니다.
       모두 검사한 뒤 결과를 모읍니다. */
    var results = fields.map(check);
    var invalid = results.indexOf(false);

    if (invalid !== -1) {
      fields[invalid].input.focus();
      if (status) status.textContent = "빠진 칸을 채워주세요.";
      return;
    }

    var name = form.querySelector("#c-name").value.trim();
    var mail = form.querySelector("#c-mail").value.trim();
    var body = form.querySelector("#c-msg").value.trim();

    var subject = "[포트폴리오 문의] " + name;
    var lines = [body, "", "—", "보낸 사람: " + name + " <" + mail + ">"];

    window.location.href =
      "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    if (status) {
      status.textContent = "메일 앱을 열었습니다. 창이 뜨지 않으면 " + TO + " 로 직접 보내주세요.";
    }
  });
})();
