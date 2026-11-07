/*
  APERTURA: tabellone a palette e sfondo generativo.
  Qui ci sono solo i meccanismi. Testi, sequenza e avvio stanno in main.js.
*/
(function () {
  "use strict";

  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var BLANK = " ";

  var sleep = function (ms) { return new Promise(function (r) { window.setTimeout(r, ms); }); };
  var rand = function (n) { return Math.floor(Math.random() * n); };

  /* ---------- Tessera del tabellone ----------
     Due metà fisse più due "foglie" che girano: la superiore cade, l'inferiore arriva. */
  class Flap {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "flap";
      var half = (cls) => {
        var h = document.createElement("div");
        h.className = "flap__half " + cls;
        var s = document.createElement("span");
        s.textContent = BLANK;
        h.appendChild(s);
        this.el.appendChild(h);
        return h;
      };
      this.top = half("flap__half--top");
      this.bottom = half("flap__half--bottom");
      this.leafTop = half("flap__half--top is-leaf");
      this.leafBottom = half("flap__half--bottom is-leaf");
      this.ch = " ";
      this.gen = 0;
    }

    static put(h, c) { h.firstChild.textContent = c === " " ? BLANK : c; }

    stopAnims() {
      this.leafTop.getAnimations().forEach((a) => a.cancel());
      this.leafBottom.getAnimations().forEach((a) => a.cancel());
    }

    set(c) {
      this.stopAnims();
      [this.top, this.bottom, this.leafTop, this.leafBottom].forEach((h) => Flap.put(h, c));
      this.leafTop.style.visibility = "hidden";
      this.leafBottom.style.visibility = "hidden";
      this.ch = c;
    }

    async flip(to, d, gen) {
      var from = this.ch;
      if (from === to) { return; }
      Flap.put(this.top, to);
      Flap.put(this.bottom, from);
      Flap.put(this.leafTop, from);
      Flap.put(this.leafBottom, to);
      this.leafTop.style.visibility = "visible";
      try {
        await this.leafTop.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
          { duration: d / 2, easing: "cubic-bezier(.5,0,.9,.5)", fill: "forwards" }).finished;
      } catch (e) { return; }
      if (gen !== this.gen) { return; }
      this.leafTop.style.visibility = "hidden";
      this.leafBottom.style.visibility = "visible";
      try {
        await this.leafBottom.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
          { duration: d / 2, easing: "cubic-bezier(.1,.5,.5,1)", fill: "forwards" }).finished;
      } catch (e) { return; }
      if (gen !== this.gen) { return; }
      Flap.put(this.bottom, to);
      this.leafBottom.style.visibility = "hidden";
      this.stopAnims();
      this.ch = to;
    }

    async run(seq, d, dLast, delay, gen) {
      if (delay) { await sleep(delay); }
      for (var i = 0; i < seq.length; i++) {
        if (gen !== this.gen) { return; }
        await this.flip(seq[i], i === seq.length - 1 ? dLast : d, gen);
      }
    }
  }

  /* ---------- Tabellone ---------- */
  class Board {
    constructor(el) { this.el = el; this.flaps = []; this.rows = 1; this.cols = 1; }

    build(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.el.style.setProperty("--cols", cols);
      this.el.replaceChildren();
      this.flaps = [];
      for (var i = 0; i < rows * cols; i++) {
        var f = new Flap();
        this.flaps.push(f);
        this.el.appendChild(f.el);
      }
      this.size();
    }

    /* Corpo delle lettere proporzionato alla tessera */
    size() {
      var f = this.flaps[0];
      if (!f) { return; }
      var w = f.el.getBoundingClientRect().width;
      if (w) { this.el.style.setProperty("--fs", (w / 0.68 * 0.74).toFixed(2) + "px"); }
    }

    chars(lines) {
      var out = [];
      for (var r = 0; r < this.rows; r++) {
        out.push.apply(out, (lines[r] || "").padEnd(this.cols, " ").slice(0, this.cols).split(""));
      }
      return out;
    }

    /* Tutto fermo, subito */
    finish(lines) {
      var target = this.chars(lines);
      this.flaps.forEach((f, i) => { f.gen++; f.set(target[i]); });
    }

    randSeq(from, to, n) {
      var seq = [];
      var prev = from;
      for (var k = 0; k < n; k++) {
        var c;
        do { c = LETTERS[rand(26)]; } while (c === prev);
        seq.push(c);
        prev = c;
      }
      if (seq[seq.length - 1] === to) { seq.pop(); }
      seq.push(to);
      return seq;
    }

    /* intro: ogni tessera gira più a lungo della precedente, da sinistra a destra.
       change: solo le tessere che cambiano, poche girate ciascuna. */
    animate(lines, mode) {
      var target = this.chars(lines);
      var jobs = [];
      this.flaps.forEach((f, i) => {
        f.gen++;
        var gen = f.gen;
        var col = i % this.cols;
        var row = Math.floor(i / this.cols);
        if (mode === "intro") {
          var order = row * this.cols + col;
          jobs.push(f.run(this.randSeq(f.ch, target[i], 4 + Math.round(order * 1.1)), 46, 160, order * 28, gen));
        } else {
          if (f.ch === target[i]) { return; }
          jobs.push(f.run(this.randSeq(f.ch, target[i], 2 + rand(3)), 60, 130, col * 32 + row * 90, gen));
        }
      });
      return Promise.all(jobs);
    }
  }

  /* ---------- Sfondo generativo ----------
     Linee arancioni che seguono un campo di rumore. Il cursore le fa girare intorno a sé;
     pulse() manda un'onda che parte da un punto. */
  function createField(canvas, opts) {
    var ctx = canvas.getContext("2d");
    var level = opts.level;
    var reduced = opts.reduced;
    var mouse = { x: -1e4, y: -1e4, active: false };
    var W = 0, H = 0, parts = [], raf = 0, mix = 1, isQuiet = false, paused = false, t = 0, pulseState = null;

    var P = new Uint8Array(512);
    (function () {
      var p = Array.from({ length: 256 }, (_, i) => i);
      for (var i = 255; i > 0; i--) { var j = rand(i + 1); var tmp = p[i]; p[i] = p[j]; p[j] = tmp; }
      for (var k = 0; k < 512; k++) { P[k] = p[k & 255]; }
    })();
    var fade = (x) => x * x * x * (x * (x * 6 - 15) + 10);
    var lerp = (a, b, x) => a + x * (b - a);
    var grad = (h, x, y) => {
      switch (h & 3) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; default: return -x - y; }
    };
    function noise(x, y) {
      var X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      var u = fade(x), v = fade(y), a = P[X] + Y, b = P[X + 1] + Y;
      return lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u),
        lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v);
    }
    var S = 0.0019;
    var angle = (x, y) => noise(x * S, y * S + t * 0.0016) * Math.PI * 3;

    function spawn(p) {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = 0;
      p.vy = 0;
      p.life = 200 + Math.random() * 300;
      return p;
    }

    function resize(force) {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      /* Sui telefoni la barra dell'indirizzo cambia l'altezza mentre si scorre:
         le piccole variazioni non ricreano lo sfondo */
      if (!force && w === W && Math.abs(h - H) < H * 0.2) { return; }
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = w;
      H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(W < 700 ? 320 : 900, W * H / 1700));
      parts = Array.from({ length: n }, () => spawn({}));
      ctx.clearRect(0, 0, W, H);
      if (reduced()) { drawStatic(); }
    }

    /* Animazioni ridotte: un'unica immagine ferma dello stesso campo */
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(224,106,51," + (0.2 * level).toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < 260; i++) {
        var x = Math.random() * W, y = Math.random() * H;
        ctx.moveTo(x, y);
        for (var k = 0; k < 60; k++) {
          var a = angle(x, y);
          x += Math.cos(a) * 3;
          y += Math.sin(a) * 3;
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    function step() {
      t++;
      mix += ((isQuiet ? 0.3 : 1) - mix) * 0.04;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.075)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(224,106,51," + (0.32 * level * mix).toFixed(3) + ")";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      var R = 160, R2 = R * R, sp = 0.85 * mix + 0.15;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var a = angle(p.x, p.y);
        var ax = Math.cos(a) * 0.22 * sp, ay = Math.sin(a) * 0.22 * sp;
        if (mouse.active) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            var d = Math.sqrt(d2) || 1, f = (1 - d / R) * 1.1;
            ax += dx / d * f * 0.5 - dy / d * f;
            ay += dy / d * f * 0.5 + dx / d * f;
          }
        }
        if (pulseState) {
          var px = p.x - pulseState.x, py = p.y - pulseState.y, pd = Math.hypot(px, py) || 1, band = Math.abs(pd - pulseState.r);
          if (band < 70) {
            var pf = (1 - band / 70) * pulseState.s;
            ax += px / pd * pf;
            ay += py / pd * pf;
          }
        }
        p.vx = p.vx * 0.9 + ax;
        p.vy = p.vy * 0.9 + ay;
        var ox = p.x, oy = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life < 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) { spawn(p); continue; }
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      if (pulseState) {
        pulseState.r += 16;
        pulseState.s *= 0.985;
        if (pulseState.r > Math.hypot(W, H)) { pulseState = null; }
      }
      raf = paused ? 0 : window.requestAnimationFrame(step);
    }

    function start() {
      window.cancelAnimationFrame(raf);
      raf = 0;
      if (reduced()) { pulseState = null; drawStatic(); return; }
      if (!paused) { raf = window.requestAnimationFrame(step); }
    }

    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });
    window.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") { mouse.active = false; } });
    document.documentElement.addEventListener("pointerleave", () => { mouse.active = false; });

    return {
      /* quietStart: parte già quasi ferma, per l'apertura */
      init: function (quietStart) {
        if (quietStart) { isQuiet = true; mix = 0.3; }
        resize(true);
        start();
      },
      resize: function () { resize(false); },
      restart: start,
      quiet: function (v) { isQuiet = v; },
      pulse: function (x, y) { if (!reduced()) { pulseState = { x: x, y: y, r: 0, s: 2.4 }; } },
      /* In pausa sotto un pannello aperto: resta l'ultima immagine */
      pause: function (v) {
        paused = v;
        if (reduced()) { return; }
        if (v) { window.cancelAnimationFrame(raf); raf = 0; } else if (!raf) { start(); }
      }
    };
  }

  window.Apertura = { Board: Board, createField: createField, sleep: sleep };
})();
