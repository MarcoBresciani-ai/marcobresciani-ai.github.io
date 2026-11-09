(function () {
  "use strict";

  var C = window.CONTENT;
  var A = window.Apertura;
  var STORAGE_KEY = "lang";
  var INTRO_KEY = "introSeen";      /* apertura completa: solo alla prima visita della sessione */
  var WORD_INTERVAL = 3000;
  var WORD_INTERVAL_STILL = 4000;   /* con animazioni ridotte le parole cambiano senza girare */
  var NARROW_HERO = 640;            /* sotto questa larghezza nome e parole vanno su due righe */
  var FIELD_LEVEL = 0.6;            /* intensità dello sfondo: "Leggero" */
  var COUNTER_DURATION = 1200;
  var PANEL_OPEN_MS = 380;
  var PANEL_CLOSE_MS = 280;
  var PANEL_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

  /* Riquadri che si aprono: indirizzo del pannello -> riquadro */
  var PANELS = { "chi-sono": "about", "percorso": "career", "competenze": "skills", "ora": "now" };

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lang = initialLang();

  var heroEl = null;
  var stageEl = null;
  var nameBoard = null;
  var wordBoard = null;
  var field = null;
  var narrow = null;
  var wordIndex = 0;
  var wordTimer = null;
  var introPending = false;  /* l'apertura partirà appena i font sono pronti */
  var introRunning = false;
  var heroStarted = false;

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

  /* ---------- Apertura: struttura e testi ---------- */

  function buildHero() {
    heroEl = document.getElementById("hero");
    var buttons = ["it", "en"].map(function (code) {
      return '<button class="lang__btn" type="button" data-lang="' + code + '">' + code.toUpperCase() + "</button>";
    }).join("");

    /* Il tabellone è solo grafica: chi usa un lettore di schermo sente il nome e le parole in chiaro */
    heroEl.innerHTML =
      '<div class="hero__bar"><div class="lang">' + buttons + "</div></div>" +
      '<div class="hero__stage" id="heroStage">' +
        '<h1 class="sr-only">' + esc(C.name) + "</h1>" +
        '<div class="board board--name" id="nameBoard" aria-hidden="true"></div>' +
        '<div class="hero__sub">' +
          '<div class="board board--words" id="wordBoard" aria-hidden="true"></div>' +
          '<p class="sr-only" id="heroWords"></p>' +
          '<p class="hero__tagline" id="heroTagline"></p>' +
        "</div>" +
      "</div>";
    stageEl = document.getElementById("heroStage");

    heroEl.addEventListener("click", function (event) {
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
    document.getElementById("heroWords").textContent = C.hero.words[lang].join(" · ");
    wordIndex = wordIndex % C.hero.words[lang].length;

    if (!wordBoard) { return; }
    if (!heroStarted) {
      if (!introPending) { wordBoard.finish(wordLines(currentWord())); }
      return;
    }
    /* Cambio lingua: l'apertura si chiude e le tessere girano sulla parola nell'altra lingua */
    skip();
    showWord(true);
    scheduleWords();
  }

  /* ---------- Apertura: tabellone ---------- */

  function upper(s) { return String(s).toUpperCase(); }

  function longest(list) {
    return Math.max.apply(null, list.map(function (s) { return s.length; }));
  }

  function wrapWords(word, cols) {
    var lines = [];
    var cur = "";
    word.split(" ").forEach(function (part) {
      var candidate = cur ? cur + " " + part : part;
      if (candidate.length <= cols) {
        cur = candidate;
      } else {
        if (cur) { lines.push(cur); }
        cur = part;
      }
    });
    if (cur) { lines.push(cur); }
    return lines;
  }

  /* Le parole delle due lingue: il tabellone deve poterle contenere tutte */
  function allWords() { return C.hero.words.it.concat(C.hero.words.en).map(upper); }

  function nameLines() {
    var name = upper(C.name);
    return narrow ? name.split(" ") : [name];
  }

  function wordLines(word) { return narrow ? wrapWords(word, wordBoard.cols) : [word]; }

  function currentWord() { return upper(C.hero.words[lang][wordIndex]); }

  function buildBoards() {
    var words = allWords();
    var name = nameLines();
    nameBoard.build(name.length, longest(name));

    if (!narrow) {
      wordBoard.build(1, longest(words));
      return;
    }
    var parts = [].concat.apply([], words.map(function (w) { return w.split(" "); }));
    var cols = Math.max(12, longest(parts));
    var rows = Math.max.apply(null, words.map(function (w) { return wrapWords(w, cols).length; }));
    wordBoard.build(rows, cols);
  }

  function layoutHero() {
    var isNarrow = stageEl.clientWidth < NARROW_HERO;
    if (isNarrow !== narrow) {
      narrow = isNarrow;
      buildBoards();
      /* Cambio di forma a metà apertura: si chiude subito, come nel prototipo */
      if (introRunning) { skip(); }
      if (introPending) {
        nameBoard.finish([]);
        wordBoard.finish([]);
      } else {
        nameBoard.finish(nameLines());
        wordBoard.finish(wordLines(currentWord()));
      }
    }
    nameBoard.size();
    wordBoard.size();
  }

  function showWord(animated) {
    var lines = wordLines(currentWord());
    if (!animated || reducedMotion.matches) {
      wordBoard.finish(lines);
      return Promise.resolve();
    }
    return wordBoard.animate(lines, "change");
  }

  function scheduleWords() {
    window.clearTimeout(wordTimer);
    wordTimer = window.setTimeout(function () {
      /* In pausa a pagina nascosta o con un pannello aperto */
      if (document.hidden || currentPanel) { scheduleWords(); return; }
      wordIndex = (wordIndex + 1) % C.hero.words[lang].length;
      showWord(true).then(scheduleWords);
    }, reducedMotion.matches ? WORD_INTERVAL_STILL : WORD_INTERVAL);
  }

  /* ---------- Apertura: sequenza ----------
     Sfondo quasi fermo, il nome gira lettera per lettera, le parole partono poco dopo.
     Quando il nome si ferma parte un'onda e lo sfondo torna a reagire al cursore. */

  function landed() {
    var r = nameBoard.el.getBoundingClientRect();
    field.pulse(r.left + r.width / 2, r.top + r.height / 2);
    field.quiet(false);
  }

  function intro() {
    introPending = false;
    introRunning = true;
    wordIndex = 0;
    heroEl.classList.remove("is-waiting");
    heroEl.classList.add("is-intro");
    field.quiet(true);
    nameBoard.finish([]);
    wordBoard.finish([]);

    var nameDone = nameBoard.animate(nameLines(), "intro");
    var wordsDone = A.sleep(450).then(function () {
      return introRunning ? wordBoard.animate(wordLines(currentWord()), "change") : null;
    });

    nameDone.then(function () {
      if (!introRunning) { return null; }
      landed();
      return wordsDone.then(function () {
        if (!introRunning) { return; }
        introRunning = false;
        scheduleWords();
      });
    });
  }

  /* Un clic o un tasto: tutto al suo posto, subito */
  function skip() {
    if (introPending) {
      introPending = false;
      heroEl.classList.remove("is-waiting");
      nameBoard.finish(nameLines());
      wordBoard.finish(wordLines(currentWord()));
      field.quiet(false);
      return;
    }
    if (!introRunning) { return; }
    introRunning = false;
    heroEl.classList.remove("is-intro");
    nameBoard.finish(nameLines());
    wordBoard.finish(wordLines(currentWord()));
    landed();
    scheduleWords();
  }

  function firstVisitOfSession() {
    try {
      if (window.sessionStorage.getItem(INTRO_KEY)) { return false; }
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch (e) { /* memoria non disponibile: l'apertura parte */ }
    return true;
  }

  function startHero() {
    nameBoard = new A.Board(document.getElementById("nameBoard"));
    wordBoard = new A.Board(document.getElementById("wordBoard"));
    field = A.createField(document.getElementById("field"), {
      level: FIELD_LEVEL,
      reduced: function () { return reducedMotion.matches; }
    });

    /* Niente apertura con animazioni ridotte, dopo la prima visita o se si arriva su un pannello */
    introPending = !reducedMotion.matches && !hashPanel() && firstVisitOfSession();
    if (introPending) { heroEl.classList.add("is-waiting"); }
    layoutHero();
    field.init(introPending);

    var queued = 0;
    new ResizeObserver(function () {
      window.cancelAnimationFrame(queued);
      queued = window.requestAnimationFrame(layoutHero);
    }).observe(stageEl);

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(field.resize, 150);
    });

    document.addEventListener("pointerdown", function () { skip(); });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Tab" && event.key !== "Shift") { skip(); }
    });

    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function () {
      heroStarted = true;
      nameBoard.size();
      wordBoard.size();
      fitCareerNames(); /* con il font vero le misure cambiano */
      if (introPending) { intro(); } else { scheduleWords(); }
    });
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

  function timeline(jobs, withPoints) {
    return '<ol class="timeline">' + jobs.map(function (job) {
      return timelineItem(job, withPoints);
    }).join("") + "</ol>";
  }

  function recentJobs() { return C.career.filter(function (job) { return !job.earlier; }); }
  function earlierJobs() { return C.career.filter(function (job) { return job.earlier; }); }

  /* "Aggiornato novembre 2026": riga piccola, le voci sono la parte grande */
  function nowUpdated() {
    return '<p class="now__updated">' + t(C.now.updatedLabel) + " · " + t(C.now.updated) + "</p>";
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

  function numberValue(n) {
    return '<span class="number__value" data-value="' + n.value + '" data-suffix="' + esc(n.suffix) + '">' +
      n.value + esc(n.suffix) + "</span>";
  }

  /* Il primo numero è grande, gli altri piccoli sotto */
  function numbersBody() {
    var first = C.numbers[0];
    return '<div class="numbers__big">' + numberValue(first) +
        '<span class="number__label">' + esc(first[lang]) + "</span></div>" +
      '<ul class="numbers__small">' + C.numbers.slice(1).map(function (n) {
        return "<li>" + numberValue(n) + '<span class="number__label">' + esc(n[lang]) + "</span></li>";
      }).join("") + "</ul>";
  }

  function contactBody() {
    var email = C.contact.emailParts.join("@");
    var links = '<a href="mailto:' + esc(email) + '">' + esc(email) + "</a>" +
      C.contact.links.map(function (l) {
        return '<a href="' + esc(l.url) + '" rel="noopener">' + esc(l.label) + "</a>";
      }).join("");
    var cv = C.cv.map(function (f) {
      return '<a href="' + esc(f.file) + '" download>' + t(C.titles.cv) + " " + esc(f.label) +
        '<span class="download" aria-hidden="true"></span></a>';
    }).join("");
    return '<div class="linklist">' + links + "</div>" + '<div class="linklist linklist--cv">' + cv + "</div>";
  }

  function renderBento() {
    var skills = C.skills.filter(function (group) { return group.tile; }).map(function (group) {
      return '<div class="skills__group"><h3 class="label">' + t(group.title) + "</h3>" + chipList(group.items[lang]) + "</div>";
    }).join("");
    var now = C.now.items.map(function (item) {
      return '<li class="now__item"><h3 class="now__item-title">' + t(item.title) + "</h3>" +
        '<p class="now__item-text">' + t(item.text) + "</p></li>";
    }).join("");

    /* Stesso ordine su telefono (impilati) e desktop (righe da 2/3 + 1/3, piena, 1/2 + 1/4 + 1/4) */
    document.getElementById("bento").innerHTML =
      tile("about", "about", '<p class="about__short">' + t(C.about.short) + "</p>" +
        '<p class="about__personal">' + t(C.about.personal) + "</p>") +
      tile("numbers", "numbers", numbersBody()) +
      tile("career", "career", careerBar()) +
      tile("now", "now", nowUpdated() + '<ul class="now__list">' + now + "</ul>") +
      tile("skills", "skills", skills) +
      tile("contact", "contact", contactBody());

    activeRole = null;
    setupCounters();
    setupCareerGrow();
    fitCareerNames();
  }

  /* ---------- Percorso: barra del tempo ----------
     Dal 2010 a oggi, un segmento per ruolo lungo quanto la sua durata.
     Desktop: orizzontale, al passaggio del mouse mostra ruolo e date.
     Telefono e tablet: verticale, con ruolo e date accanto a ogni segmento. */

  var activeRole = null;
  var careerObserver = null;
  var careerGrown = false;

  function toYears(s) {
    var p = String(s).split("-");
    return Number(p[0]) + (p[1] ? (Number(p[1]) - 1) / 12 : 0);
  }

  function todayYears() {
    var d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  }

  function currentRoleIndex() {
    for (var i = 0; i < C.career.length; i++) { if (C.career[i].current) { return i; } }
    return 0;
  }

  function roleReadout(i) {
    var job = C.career[i];
    return '<p class="cbar__readout-role">' + t(job.role) + "</p>" +
      '<p class="cbar__readout-meta">' + esc(job.company) + " · " + t(job.date) + "</p>";
  }

  function careerBar() {
    var jobs = C.career;
    var end = todayYears();
    var start = Math.min.apply(null, jobs.map(function (j) { return toYears(j.start); }));
    var total = end - start;
    var count = jobs.length;

    var segments = jobs.map(function (job, i) {
      var from = toYears(job.start);
      var to = job.end ? toYears(job.end) : end;
      var newer = jobs[i - 1];
      var gap = newer ? Math.max(0, toYears(newer.start) - to) : 0;
      var cls = "cbar__seg" + (job.current ? " is-current" : "") + (job.seasonal ? " is-seasonal" : "");
      var style = "--from:" + ((from - start) / total).toFixed(4) +
        ";--len:" + ((to - from) / total).toFixed(4) +
        ";--years:" + (to - from).toFixed(2) +
        ";--gap:" + gap.toFixed(2) +
        ";--order:" + (count - 1 - i);
      /* Nome del ruolo sotto il segmento (solo desktop, ruoli dal 2018): si accorcia se non c'è spazio */
      var name = job.earlier ? "" : '<span class="cbar__name" aria-hidden="true">' + t(job.role) + "</span>";
      return '<li class="' + cls + '" data-panel="percorso" data-role="' + i + '" style="' + style + '">' +
        '<span class="cbar__fill" aria-hidden="true"></span>' + name +
        '<span class="cbar__label"><span class="cbar__role">' + t(job.role) + "</span>" +
        '<span class="cbar__meta">' + esc(job.company) + " · " + t(job.date) + "</span></span>" +
      "</li>";
    }).join("");

    var ticks = "";
    for (var y = Math.ceil(start / 2) * 2; y <= end; y += 2) {
      ticks += '<span class="cbar__tick" style="--at:' + ((y - start) / total).toFixed(4) + '">' + y + "</span>";
    }

    var state = careerGrown || reducedMotion.matches || !("IntersectionObserver" in window) ? "" : " is-waiting";
    return '<div class="cbar' + state + '">' +
      '<div class="cbar__readout" aria-hidden="true">' + roleReadout(currentRoleIndex()) + "</div>" +
      '<ol class="cbar__track">' + segments + "</ol>" +
      '<div class="cbar__axis" aria-hidden="true">' + ticks + "</div>" +
    "</div>";
  }

  /* Ruolo sotto il cursore; null = torna al ruolo attuale */
  function showRole(index) {
    if (index === activeRole) { return; }
    activeRole = index;
    var bar = document.querySelector(".cbar");
    if (!bar) { return; }
    bar.querySelector(".cbar__readout").innerHTML = roleReadout(index === null ? currentRoleIndex() : index);
    bar.classList.toggle("has-active", index !== null);
    Array.prototype.forEach.call(bar.querySelectorAll(".cbar__seg"), function (seg) {
      seg.classList.toggle("is-active", Number(seg.getAttribute("data-role")) === index);
    });
  }

  /* Per ogni nome: il nome intero, altrimenti la prima abbreviazione che entra nel segmento.
     Se non entra nemmeno la più corta, il CSS la tronca con i puntini. */
  function fitCareerNames() {
    Array.prototype.forEach.call(document.querySelectorAll(".cbar__name"), function (el) {
      if (!el.clientWidth) { return; } /* nascosto: telefono e tablet */
      var job = C.career[Number(el.parentNode.getAttribute("data-role"))];
      var options = [job.role[lang]].concat(job.short ? job.short[lang] : []);
      for (var k = 0; k < options.length; k++) {
        el.textContent = options[k];
        if (el.scrollWidth <= el.clientWidth) { return; }
      }
    });
  }

  function bindCareerBar() {
    var bento = document.getElementById("bento");
    var queued = 0;
    new ResizeObserver(function () {
      window.cancelAnimationFrame(queued);
      queued = window.requestAnimationFrame(fitCareerNames);
    }).observe(bento);
    bento.addEventListener("pointerover", function (event) {
      if (event.pointerType !== "mouse") { return; }
      var seg = event.target.closest(".cbar__seg");
      showRole(seg ? Number(seg.getAttribute("data-role")) : null);
    });
    bento.addEventListener("pointerleave", function () { showRole(null); });
  }

  /* I segmenti crescono uno dopo l'altro, dal più vecchio, quando la barra entra nello schermo */
  function setupCareerGrow() {
    if (careerObserver) { careerObserver.disconnect(); }
    var bar = document.querySelector(".cbar.is-waiting");
    if (!bar) { return; }
    careerObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) { return; }
      careerObserver.disconnect();
      careerGrown = true;
      bar.classList.remove("is-waiting");
      bar.classList.add("is-growing");
    }, { threshold: 0.35 });
    careerObserver.observe(bar);
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
      return timeline(recentJobs(), true) +
      '<section class="panel__section"><h3 class="panel__subtitle">' + t(C.titles.earlier) + "</h3>" +
      timeline(earlierJobs(), true) + "</section>" +
      '<section class="panel__section"><h3 class="panel__subtitle">' + t(C.titles.education) + "</h3>" +
      "<ul>" + education + "</ul></section>";
    }

    if (tileId === "skills") {
      return C.skills.map(function (group) {
        return '<section class="panel__group"><h3 class="label">' + t(group.title) + "</h3>" +
          chipList(group.items[lang]) + "</section>";
      }).join("");
    }

    return nowUpdated() +
      '<ul class="now__entries">' + C.now.items.map(function (item) {
        return '<li class="now__entry"><h3 class="now__entry-title">' + t(item.title) + "</h3><p>" + t(item.text) + "</p></li>";
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
    if (field) { field.pause(true); }
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
    if (field) { field.pause(false); }
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
    if (reducedMotion.matches) {
      countersDone = true;
      skip();
    }
    if (field) { field.restart(); }
    render();
  });

  buildHero();
  bindPanel();
  bindCareerBar();
  render();
  startHero();
  syncPanel();
})();
