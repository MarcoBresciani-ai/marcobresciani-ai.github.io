(function () {
  "use strict";

  var C = window.CONTENT;
  var STORAGE_KEY = "lang";
  var WORD_INTERVAL = 2400;
  var COUNTER_DURATION = 1200;
  var PANEL_OPEN_MS = 380;
  var PANEL_CLOSE_MS = 280;
  var PANEL_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

  /* Riquadri che si aprono: indirizzo del pannello -> riquadro */
  var PANELS = { "chi-sono": "about", "percorso": "career", "competenze": "skills", "ora": "now" };

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lang = initialLang();

  var wordIndex = 0;
  var wordTimer = null;
  var counterObserver = null;
  var countersDone = false;

  var panel = document.getElementById("panel");
  var panelHead = document.getElementById("panelHead");
  var panelTitle = document.getElementById("panelTitle");
  var panelBody = document.getElementById("panelBody");
  var panelClose = document.getElementById("panelClose");
  var currentPanel = null;   /* pannello aperto ora */
  var openedByClick = false; /* aperto dal riquadro, non da un link diretto */
  var closeRequested = false;
  var hiding = false;
  var panelAnimations = [];

  /* ---------- Utilità ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function t(obj) { return esc(obj[lang]); }

  /* ---------- Lingua ---------- */

  function initialLang() {
    var saved = null;
    try { saved = window.localStorage.getItem(STORAGE_KEY); } catch (e) { /* memoria non disponibile */ }
    if (saved === "it" || saved === "en") { return saved; }
    return (navigator.language || "").toLowerCase().indexOf("it") === 0 ? "it" : "en";
  }

  function setLang(code) {
    if (code === lang) { return; }
    lang = code;
    try { window.localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* memoria non disponibile */ }
    render();
  }

  /* ---------- Hero ---------- */

  function buildHero() {
    var parts = C.name.split(" ");
    var hero = document.getElementById("hero");
    var buttons = ["it", "en"].map(function (code) {
      return '<button class="lang__btn" type="button" data-lang="' + code + '">' + code.toUpperCase() + "</button>";
    }).join("");

    hero.innerHTML =
      '<div class="hero__bar"><div class="lang">' + buttons + "</div></div>" +
      '<h1 class="hero__name"><span>' + esc(parts[0]) + "</span> <span>" + esc(parts[1]) + "</span></h1>" +
      '<div class="hero__line">' +
        '<p class="hero__word" id="heroWord"></p>' +
        '<p class="sr-only" id="heroWords"></p>' +
        '<p class="hero__tagline" id="heroTagline"></p>' +
      "</div>";

    hero.addEventListener("click", function (event) {
      var button = event.target.closest("[data-lang]");
      if (button) { setLang(button.getAttribute("data-lang")); }
    });
  }

  function updateHero() {
    var buttons = document.querySelectorAll(".lang__btn");
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === lang));
    });
    document.getElementById("heroTagline").textContent = C.hero.tagline[lang];
    startWords();
  }

  function startWords() {
    var box = document.getElementById("heroWord");
    var list = document.getElementById("heroWords");
    var words = C.hero.words[lang];
    var all = words.join(" · ");

    window.clearInterval(wordTimer);
    box.textContent = "";

    if (reducedMotion.matches) {
      /* Niente movimento: tutte le parole sono visibili insieme. */
      box.className = "hero__word hero__word--static";
      box.removeAttribute("aria-hidden");
      box.textContent = all;
      list.textContent = "";
      return;
    }

    box.className = "hero__word";
    box.setAttribute("aria-hidden", "true");
    list.textContent = all;
    box.appendChild(wordSpan(words[wordIndex], ""));
    wordTimer = window.setInterval(nextWord, WORD_INTERVAL);
  }

  function wordSpan(text, state) {
    var span = document.createElement("span");
    span.className = "hero__word-in" + (state ? " " + state : "");
    span.textContent = text;
    return span;
  }

  function nextWord() {
    if (document.hidden || currentPanel) { return; }
    var box = document.getElementById("heroWord");
    var words = C.hero.words[lang];
    var old = box.lastElementChild;

    wordIndex = (wordIndex + 1) % words.length;

    if (old) {
      old.classList.remove("is-entering");
      old.classList.add("is-leaving");
      old.addEventListener("animationend", function () { old.remove(); }, { once: true });
    }
    box.appendChild(wordSpan(words[wordIndex], "is-entering"));
  }

  /* ---------- Griglia ---------- */

  function timelineItem(job, withPoints) {
    var points = "";
    if (withPoints) {
      points = '<ul class="timeline__points">' + job.points[lang].map(function (p) {
        return "<li>" + esc(p) + "</li>";
      }).join("") + "</ul>";
    }
    return '<li class="timeline__item' + (job.current ? " timeline__item--current" : "") + '">' +
      '<span class="timeline__dot" aria-hidden="true"></span>' +
      '<h3 class="timeline__role">' + t(job.role) + "</h3>" +
      '<p class="timeline__meta">' + esc(job.company) + ' · <span class="timeline__date">' + t(job.date) + "</span></p>" +
      points +
    "</li>";
  }

  function chipList(items) {
    return '<ul class="chips">' + items.map(function (s) {
      return '<li class="chip">' + esc(s) + "</li>";
    }).join("") + "</ul>";
  }

  function panelSlug(tileId) {
    return Object.keys(PANELS).filter(function (slug) { return PANELS[slug] === tileId; })[0];
  }

  function tile(id, titleKey, body) {
    var slug = panelSlug(id);
    var title = t(C.titles[titleKey]);
    if (slug) {
      title = '<button class="tile__open" type="button" aria-haspopup="dialog" data-panel="' + slug + '">' +
        title + '<span class="tile__plus" aria-hidden="true"></span></button>';
    }
    return '<section class="tile tile--' + id + '"><h2 class="tile__title">' + title + "</h2>" + body + "</section>";
  }

  function renderBento() {
    var numbers = C.numbers.map(function (n) {
      return '<li><span class="number__value" data-value="' + n.value + '" data-suffix="' + esc(n.suffix) + '">' +
        n.value + esc(n.suffix) + "</span>" +
        '<span class="number__label">' + esc(n[lang]) + "</span></li>";
    }).join("");

    var skills = C.skills[0];

    var now = C.now.items.map(function (item) {
      return '<li class="now__item">' + t(item.title) + "</li>";
    }).join("");

    var cv = C.cv.map(function (f) {
      return '<a href="' + esc(f.file) + '" download>' + esc(f.label) + "</a>";
    }).join("");

    var email = C.contact.emailParts.join("@");
    var contact = '<a href="mailto:' + esc(email) + '">' + esc(email) + "</a>" +
      C.contact.links.map(function (l) {
        return '<a href="' + esc(l.url) + '" rel="noopener">' + esc(l.label) + "</a>";
      }).join("");

    document.getElementById("bento").innerHTML =
      tile("about", "about", "<p>" + t(C.about.short) + "</p>") +
      tile("numbers", "numbers", '<ul class="numbers">' + numbers + "</ul>") +
      tile("career", "career", '<ol class="timeline">' + C.career.slice(0, 5).map(function (job) {
        return timelineItem(job, false);
      }).join("") + "</ol>") +
      tile("skills", "skills", '<p class="label">' + t(skills.title) + "</p>" + chipList(skills.items[lang])) +
      tile("now", "now",
        '<div><p class="label">' + t(C.now.updatedLabel) + '</p><p class="now__date">' + t(C.now.updated) + "</p></div>" +
        '<ul class="now__list">' + now + "</ul>") +
      tile("cv", "cv", '<div class="linklist linklist--row">' + cv + "</div>") +
      tile("contact", "contact", '<div class="linklist">' + contact + "</div>");

    setupCounters();
  }

  /* ---------- Contatori ---------- */

  function setupCounters() {
    if (counterObserver) { counterObserver.disconnect(); }
    if (countersDone || reducedMotion.matches || !("IntersectionObserver" in window)) { return; }

    var values = document.querySelectorAll(".number__value");
    Array.prototype.forEach.call(values, function (el) {
      el.textContent = "0" + el.getAttribute("data-suffix");
    });

    counterObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) { return; }
      counterObserver.disconnect();
      countersDone = true;
      animateCounters(values);
    }, { threshold: 0.4 });

    counterObserver.observe(document.querySelector(".tile--numbers"));
  }

  function animateCounters(values) {
    var start = null;

    function frame(now) {
      if (start === null) { start = now; }
      var progress = Math.min((now - start) / COUNTER_DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);

      Array.prototype.forEach.call(values, function (el) {
        var target = Number(el.getAttribute("data-value"));
        el.textContent = Math.round(target * eased) + el.getAttribute("data-suffix");
      });

      if (progress < 1) { window.requestAnimationFrame(frame); }
    }

    window.requestAnimationFrame(frame);
  }

  /* ---------- Contenuto dei pannelli ---------- */

  function panelContent(tileId) {
    if (tileId === "about") {
      return C.about.long[lang].map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    }

    if (tileId === "career") {
      var education = C.education.map(function (e) {
        return '<li class="education__item"><h4 class="timeline__role">' + t(e.title) + "</h4>" +
          '<p class="timeline__meta">' + esc(e.school) + "</p></li>";
      }).join("");
      return '<ol class="timeline">' + C.career.map(function (job) {
        return timelineItem(job, true);
      }).join("") + "</ol>" +
      '<section class="panel__section"><h3 class="panel__subtitle">' + t(C.titles.education) + "</h3>" +
      "<ul>" + education + "</ul></section>";
    }

    if (tileId === "skills") {
      return C.skills.map(function (group) {
        return '<section class="panel__group"><h3 class="label">' + t(group.title) + "</h3>" +
          chipList(group.items[lang]) + "</section>";
      }).join("");
    }

    return '<p class="label">' + t(C.now.updatedLabel) + '</p><p class="now__date">' + t(C.now.updated) + "</p>" +
      '<ul class="now__entries">' + C.now.items.map(function (item) {
        return '<li class="now__entry"><h3 class="timeline__role">' + t(item.title) + "</h3><p>" + t(item.text) + "</p></li>";
      }).join("") + "</ul>";
  }

  function fillPanel(slug) {
    var tileId = PANELS[slug];
    panelTitle.textContent = C.titles[tileId][lang];
    panelBody.innerHTML = panelContent(tileId);
    panelBody.scrollTop = 0;
  }

  /* ---------- Apertura e chiusura dei pannelli ----------
     L'indirizzo comanda: #percorso aperto, nessun indirizzo chiuso.
     Così il tasto Indietro e i link diretti funzionano da soli. */

  function hashPanel() {
    var slug = window.location.hash.slice(1);
    return Object.prototype.hasOwnProperty.call(PANELS, slug) ? slug : null;
  }

  function tileOf(slug) { return document.querySelector(".tile--" + PANELS[slug]); }

  function syncPanel() {
    if (hiding) { return; }
    var slug = hashPanel();

    if (slug && currentPanel && slug !== currentPanel) {
      currentPanel = slug;
      fillPanel(slug);
    } else if (slug && !currentPanel) {
      showPanel(slug);
    } else if (!slug && currentPanel) {
      hidePanel();
    }
  }

  function showPanel(slug) {
    currentPanel = slug;
    fillPanel(slug);
    panel.showModal();
    document.documentElement.classList.add("has-panel");
    window.requestAnimationFrame(function () { panel.setAttribute("data-state", "open"); });
    if (openedByClick && !reducedMotion.matches) { morphPanel(tileOf(slug), true); }
  }

  function hidePanel() {
    hiding = true;
    panel.removeAttribute("data-state");
    if (reducedMotion.matches) {
      finishHide();
    } else {
      morphPanel(tileOf(currentPanel), false, finishHide);
    }
  }

  function finishHide() {
    var button = document.querySelector('[data-panel="' + currentPanel + '"]');
    panel.close();
    clearPanelAnimations();
    resetPanelState();
    if (button) { button.focus({ preventScroll: true }); }
    syncPanel();
  }

  function resetPanelState() {
    document.documentElement.classList.remove("has-panel");
    currentPanel = null;
    openedByClick = false;
    closeRequested = false;
    hiding = false;
  }

  function clearPanelAnimations() {
    panelAnimations.forEach(function (animation) { animation.cancel(); });
    panelAnimations = [];
  }

  /* Il pannello parte dalla posizione esatta del riquadro e ci ritorna */
  function morphPanel(tileEl, opening, done) {
    clearPanelAnimations();

    var to = panel.getBoundingClientRect();
    var from = tileEl.getBoundingClientRect();
    var collapsed = "translate(" + (from.left - to.left) + "px, " + (from.top - to.top) + "px) " +
      "scale(" + (from.width / to.width) + ", " + (from.height / to.height) + ")";
    var duration = opening ? PANEL_OPEN_MS : PANEL_CLOSE_MS;

    var shell = panel.animate(
      opening ? [{ transform: collapsed }, { transform: "none" }] : [{ transform: "none" }, { transform: collapsed }],
      { duration: duration, easing: PANEL_EASING, fill: "both" }
    );
    panelAnimations.push(shell);

    [panelHead, panelBody].forEach(function (el) {
      panelAnimations.push(el.animate(
        opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
        { duration: opening ? 220 : 120, delay: opening ? 160 : 0, easing: "linear", fill: "both" }
      ));
    });

    if (done) { shell.onfinish = done; }
  }

  function requestClose() {
    if (!currentPanel || hiding || closeRequested) { return; }
    closeRequested = true;
    if (openedByClick) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      syncPanel();
    }
  }

  function bindPanel() {
    document.getElementById("bento").addEventListener("click", function (event) {
      var button = event.target.closest("[data-panel]");
      if (!button) { return; }
      openedByClick = true;
      window.location.hash = button.getAttribute("data-panel");
    });

    panelClose.addEventListener("click", requestClose);

    /* Il clic sullo sfondo arriva al dialogo stesso, non ai suoi contenuti */
    panel.addEventListener("click", function (event) {
      if (event.target === panel) { requestClose(); }
    });

    panel.addEventListener("cancel", function (event) {
      event.preventDefault();
      requestClose();
    });

    /* Chiusura decisa dal browser, senza passare da requestClose */
    panel.addEventListener("close", function () {
      if (!currentPanel) { return; }
      clearPanelAnimations();
      panel.removeAttribute("data-state");
      resetPanelState();
      if (hashPanel()) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });

    window.addEventListener("hashchange", syncPanel);
  }

  /* ---------- Alone che segue il cursore ---------- */

  function bindHalo() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) { return; }

    var halo = document.getElementById("halo");
    var radius = halo.offsetWidth / 2;
    var x = 0;
    var y = 0;
    var queued = false;

    function place() {
      queued = false;
      halo.style.transform = "translate3d(" + (x - radius) + "px, " + (y - radius) + "px, 0)";
      halo.classList.add("is-on");
    }

    document.addEventListener("pointermove", function (event) {
      if (event.pointerType !== "mouse") { return; }
      x = event.clientX;
      y = event.clientY;
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(place);
      }
    });

    document.documentElement.addEventListener("pointerleave", function () {
      halo.classList.remove("is-on");
    });
  }

  /* ---------- Avvio ---------- */

  function render() {
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]').setAttribute("content", C.hero.tagline[lang]);
    panelClose.setAttribute("aria-label", C.ui.close[lang]);
    updateHero();
    renderBento();
    if (currentPanel) { fillPanel(currentPanel); }
  }

  reducedMotion.addEventListener("change", function () {
    if (reducedMotion.matches) { countersDone = true; }
    render();
  });

  buildHero();
  bindPanel();
  bindHalo();
  render();
  syncPanel();
})();
