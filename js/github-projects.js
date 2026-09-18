/* ══════════════════════════════════════════════════════════════════
   github-projects.js — GitHub 공개 저장소 목록
   네트워크 응답을 localStorage에 보관해 API 오류·레이트 리밋 때도
   마지막으로 확인한 목록을 보여 줍니다.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const USER = "tlswltjq";
  const LIMIT = 6;
  const CACHE_KEY = "github-projects:" + USER + ":v1";
  const CACHE_MAX_AGE = 1000 * 60 * 60;
  const list = document.querySelector("[data-github-projects]");
  const state = document.querySelector("[data-github-state]");
  const retry = document.querySelector("[data-github-retry]");
  if (!list || !state) return;

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!cached || !Array.isArray(cached.repos) || !cached.savedAt) return null;
      return cached;
    } catch (error) {
      return null;
    }
  }

  function writeCache(repos) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        savedAt: Date.now(),
        repos: repos
      }));
    } catch (error) {
      /* 사생활 보호 모드나 저장 공간 제한에서는 캐시 없이 계속 동작합니다. */
    }
  }

  function textElement(tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  }

  function renderRepos(repos) {
    const fragment = document.createDocumentFragment();
    list.replaceChildren();

    repos.slice(0, LIMIT).forEach(function (repo) {
      const card = document.createElement("article");
      card.className = "blueprint github-card";

      ["tl", "tr", "bl", "br"].forEach(function (position) {
        const corner = document.createElement("i");
        corner.className = "corner " + position;
        corner.setAttribute("aria-hidden", "true");
        card.appendChild(corner);
      });

      const heading = document.createElement("div");
      heading.className = "github-card-head";
      heading.appendChild(textElement("h3", "", repo.name));

      const repositoryLink = document.createElement("a");
      repositoryLink.className = "mono";
      repositoryLink.href = repo.html_url;
      repositoryLink.target = "_blank";
      repositoryLink.rel = "noopener";
      repositoryLink.textContent = "repo ↗";
      repositoryLink.setAttribute("aria-label", repo.name + " GitHub 저장소 열기");
      heading.appendChild(repositoryLink);
      card.appendChild(heading);

      card.appendChild(textElement(
        "p",
        "github-card-description",
        repo.description || "설명이 등록되지 않은 공개 저장소입니다."
      ));

      const meta = document.createElement("div");
      meta.className = "github-card-meta mono";
      const language = repo.language || "Other";
      const updated = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date(repo.updated_at));
      meta.appendChild(textElement("span", "", language));
      meta.appendChild(textElement("span", "", "★ " + repo.stargazers_count));
      meta.appendChild(textElement("span", "", "Updated " + updated));
      card.appendChild(meta);
      fragment.appendChild(card);
    });

    list.appendChild(fragment);
  }

  function setState(message, kind) {
    state.textContent = message;
    state.dataset.state = kind || "info";
  }

  function rateLimitMessage(response) {
    const reset = response && response.headers && response.headers.get("x-ratelimit-reset");
    if (!reset) return "GitHub API 요청 한도를 초과했습니다.";

    const resetTime = new Date(Number(reset) * 1000);
    return "GitHub API 요청 한도를 초과했습니다. " +
      resetTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) +
      " 이후 다시 시도할 수 있습니다.";
  }

  async function loadProjects() {
    const cached = readCache();
    const hasCache = Boolean(cached && cached.repos.length);
    if (hasCache) renderRepos(cached.repos);

    list.setAttribute("aria-busy", "true");
    if (retry) retry.hidden = true;
    setState(hasCache ? "저장된 목록을 표시하고 최신 정보를 확인하는 중입니다…" : "GitHub 저장소를 불러오는 중입니다…");

    try {
      const response = await fetch(
        "https://api.github.com/users/" + encodeURIComponent(USER) + "/repos?per_page=100&sort=updated",
        { headers: { Accept: "application/vnd.github+json" } }
      );

      /* 403 동작 확인 시 아래 한 줄을 잠시 활성화할 수 있습니다. */
      // throw new Response(null, { status: 403 });

      if (!response.ok) throw response;

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");

      const repos = data
        .filter(function (repo) { return !repo.fork && !repo.archived; })
        .sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); })
        .slice(0, LIMIT);

      if (!repos.length) {
        list.replaceChildren();
        setState("표시할 공개 저장소가 없습니다.", "empty");
        return;
      }

      renderRepos(repos);
      writeCache(repos);
      setState("GitHub에서 최근 업데이트된 공개 저장소 " + repos.length + "개를 불러왔습니다.", "success");
    } catch (error) {
      const isRateLimited = error && error.status === 403;
      let message = isRateLimited ? rateLimitMessage(error) : "GitHub 저장소를 불러오지 못했습니다.";

      if (hasCache) {
        const isFresh = Date.now() - cached.savedAt < CACHE_MAX_AGE;
        message += isFresh ? " 저장된 최신 목록을 표시합니다." : " 이전에 저장한 목록을 대신 표시합니다.";
      } else if (retry) {
        retry.hidden = false;
      }
      setState(message, "error");
    } finally {
      list.setAttribute("aria-busy", "false");
    }
  }

  if (retry) retry.addEventListener("click", loadProjects);
  loadProjects();
})();
