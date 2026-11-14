/* Schachkurs-Quiz: Fragen aus fragen.js, Fortschritt im Browser gespeichert. */
"use strict";

// ── Texte der Seite ──────────────────────────────────────────────────────
const UI = {
  de: {
    appName: "Schachkurs",
    heroTitle: "Teste dein Schachwissen!",
    heroSub: "Beantworte die Fragen aus dem Kurs – und werde zum Schach-Profi.",
    statGood: "Kann ich",
    statPractice: "Üben",
    statNew: "Neu",
    chooseMode: "Wie willst du lernen?",
    poolAll: "Alle Fragen",
    poolWeak: "Nur schwierige 💪",
    tileCards: "Karteikarten",
    tileCardsSub: "Umdrehen und selbst prüfen",
    tileQuiz: "Quiz",
    tileQuizSub: "4 Antworten – eine ist richtig",
    tileRace: "Rennspiel",
    tileRaceSub: "Schnell antworten, sonst kracht's!",
    tileList: "Alle Fragen",
    tileListSub: "Lesen und lernen",
    tileProgress: "Mein Fortschritt",
    tileProgressSub: "Was kann ich schon?",
    back: "Zurück",
    question: "Frage",
    answer: "Antwort",
    tapToFlip: "👆 Antippen zum Umdrehen",
    known: "Gewusst",
    notKnown: "Nicht gewusst",
    next: "Weiter",
    finish: "Ergebnis ansehen",
    yes: "Ja",
    no: "Nein",
    praise: ["Super! 🎉", "Richtig! 🌟", "Klasse! 👏", "Genau! ✨", "Toll gemacht! 🏆", "Spitze! 🚀"],
    wrong: "Fast! Richtig ist:",
    again: "Nochmal",
    toStart: "Zur Startseite",
    endGreat: "Großartig!",
    endGood: "Gut gemacht!",
    endTry: "Weiter üben!",
    endScore: (r, n) => `${r} von ${n} richtig`,
    endKnown: (r, n) => `${r} von ${n} gewusst`,
    allGood: "Du kannst schon alle Fragen! 🏆",
    listHint: "Tippe auf eine Frage, um die Antwort zu sehen.",
    tapToReveal: "👆 Antippen für die Antwort",
    ringLabel: "kann ich",
    filterAll: "Alle",
    reset: "Fortschritt zurücksetzen",
    resetConfirm: "Willst du deinen ganzen Fortschritt wirklich löschen?",
    nothingHere: "Hier ist noch nichts.",
    // Rennspiel
    raceTitle: "Schach-Rennen",
    raceIntro: "Lies die Frage. Dann hast du 4 Sekunden: Fahr auf die Spur mit der richtigen Antwort!\nFalsche Spur oder zu langsam – dann krachst du in den LKW. 💥",
    raceStart: "Los geht's! 🏁",
    raceAgain: "Nochmal fahren 🏁",
    raceCrash: "💥 Crash!",
    raceSlow: "⏰ Zu langsam!",
    raceWasRight: (ans) => `Richtig wäre gewesen: ${ans}`,
    raceResult: (n) => `Du hast ${n} ${n === 1 ? "Frage" : "Fragen"} geschafft.`,
    raceNewBest: "🏆 Neuer Rekord!",
    raceGo: "LOS!",
    raceRight: ["Super! 🚀", "Weiter so! 🏎️", "Klasse! ⭐", "Turbo! 🔥"],
  },
  ru: {
    appName: "Шахматный курс",
    heroTitle: "Проверь свои знания!",
    heroSub: "Отвечай на вопросы курса – и стань настоящим шахматистом.",
    statGood: "Знаю",
    statPractice: "Повторить",
    statNew: "Новые",
    chooseMode: "Как будем учить?",
    poolAll: "Все вопросы",
    poolWeak: "Только трудные 💪",
    tileCards: "Карточки",
    tileCardsSub: "Переверни и проверь себя",
    tileQuiz: "Викторина",
    tileQuizSub: "4 ответа – один правильный",
    tileRace: "Гонка",
    tileRaceSub: "Отвечай быстро, а то врежешься!",
    tileList: "Все вопросы",
    tileListSub: "Читать и учить",
    tileProgress: "Мои успехи",
    tileProgressSub: "Что я уже знаю?",
    back: "Назад",
    question: "Вопрос",
    answer: "Ответ",
    tapToFlip: "👆 Нажми, чтобы перевернуть",
    known: "Знаю",
    notKnown: "Не знаю",
    next: "Дальше",
    finish: "Посмотреть результат",
    yes: "Да",
    no: "Нет",
    praise: ["Супер! 🎉", "Правильно! 🌟", "Класс! 👏", "Точно! ✨", "Молодец! 🏆", "Отлично! 🚀"],
    wrong: "Почти! Правильный ответ:",
    again: "Ещё раз",
    toStart: "На главную",
    endGreat: "Великолепно!",
    endGood: "Хорошая работа!",
    endTry: "Продолжай тренироваться!",
    endScore: (r, n) => `${r} из ${n} правильно`,
    endKnown: (r, n) => `Знаю: ${r} из ${n}`,
    allGood: "Ты уже знаешь все вопросы! 🏆",
    listHint: "Нажми на вопрос, чтобы увидеть ответ.",
    tapToReveal: "👆 Нажми, чтобы увидеть ответ",
    ringLabel: "знаю",
    filterAll: "Все",
    reset: "Сбросить успехи",
    resetConfirm: "Точно удалить все свои успехи?",
    nothingHere: "Здесь пока ничего нет.",
    // Гонка
    raceTitle: "Шахматная гонка",
    raceIntro: "Прочитай вопрос. Потом у тебя 4 секунды: перестройся в полосу с правильным ответом!\nНеправильная полоса или слишком медленно – и ты врежешься в грузовик. 💥",
    raceStart: "Поехали! 🏁",
    raceAgain: "Ещё заезд 🏁",
    raceCrash: "💥 Авария!",
    raceSlow: "⏰ Слишком медленно!",
    raceWasRight: (ans) => `Правильный ответ: ${ans}`,
    raceResult: (n) => `Правильных ответов: ${n}`,
    raceNewBest: "🏆 Новый рекорд!",
    raceGo: "СТАРТ!",
    raceRight: ["Супер! 🚀", "Так держать! 🏎️", "Класс! ⭐", "Турбо! 🔥"],
  },
};

const PIECES = ["♞", "♛", "♜", "♝", "♚", "♟"];
const SESSION_LENGTH = 10;
const ALL = THEMEN.flatMap((t) => t.fragen.map((f) => ({ ...f, thema: t.id })));
const BY_ID = Object.fromEntries(ALL.map((f) => [f.id, f]));

// ── Speichern (nur in diesem Browser) ───────────────────────────────────
const STORE_KEY = "schachkurs-v1";
function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* privat */ }
}
const state = Object.assign({ lang: "de", stats: {}, pool: "all", raceBest: 0 }, load());

const t = (key) => UI[state.lang][key];
const q = (f) => f[state.lang][0];
const a = (f) => f[state.lang][1];

/** Wie gut sitzt eine Frage? good = 2× hintereinander richtig. */
function status(id) {
  const s = state.stats[id];
  if (!s || s.r + s.w === 0) return "new";
  return s.streak >= 2 ? "good" : "practice";
}

function record(id, right) {
  const s = state.stats[id] || { r: 0, w: 0, streak: 0 };
  if (right) { s.r++; s.streak++; } else { s.w++; s.streak = 0; }
  state.stats[id] = s;
  save();
}

// ── Hilfsfunktionen ─────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const shuffle = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const norm = (s) => s.trim().toLowerCase();
const isYesNo = (f) => ["nein", "ja"].includes(norm(f.de[1]));
const hasDigit = (s) => /\d/.test(s);

/**
 * Drei falsche Antworten für eine Frage – als ids anderer Fragen, damit sie
 * beim Sprachwechsel mitwechseln. Keine Antwort darf in einer der beiden
 * Sprachen gleich lauten wie eine andere. Zahlen-Antworten bekommen
 * möglichst Zahlen als Ablenkung.
 */
function distractors(f) {
  // Art der Antwort: Zahl, kurz (1–2 Wörter) oder Satz – Ablenkungen von
  // derselben Art, damit man die richtige nicht an der Form erkennt.
  const kind = (o) => (hasDigit(o.de[1]) ? "num" : o.de[1].split(/\s+/).length <= 2 ? "short" : "long");
  const own = kind(f);
  const taken = { de: new Set([norm(f.de[1])]), ru: new Set([norm(f.ru[1])]) };
  const candidates = shuffle(ALL.filter((o) => o.id !== f.id && !isYesNo(o)));
  candidates.sort((x, y) => (kind(y) === own) - (kind(x) === own));
  const picked = [];
  for (const o of candidates) {
    if (taken.de.has(norm(o.de[1])) || taken.ru.has(norm(o.ru[1]))) continue;
    taken.de.add(norm(o.de[1]));
    taken.ru.add(norm(o.ru[1]));
    picked.push(o.id);
    if (picked.length === 3) break;
  }
  return picked;
}

/** Antwortmöglichkeiten einer Frage (ids bzw. @yes/@no), gemischt. */
function optionsFor(f) {
  return isYesNo(f) ? ["@yes", "@no"] : shuffle([f.id, ...distractors(f)]);
}
function optionText(opt) {
  if (opt === "@yes") return t("yes");
  if (opt === "@no") return t("no");
  return a(BY_ID[opt]);
}
function isRightOption(id, opt) {
  const f = BY_ID[id];
  if (opt === "@yes" || opt === "@no") return (opt === "@yes") === (norm(f.de[1]) === "ja");
  return opt === id;
}

/** Fragen für eine Runde – alle oder nur die, die noch nicht sitzen. */
function questionPool() {
  if (state.pool !== "weak") return shuffle(ALL);
  const weak = ALL.filter((f) => status(f.id) !== "good");
  // Erst die mit Fehlern, dann neue.
  return shuffle(weak).sort((x, y) => (status(y.id) === "practice") - (status(x.id) === "practice"));
}

// ── Seiten wechseln ─────────────────────────────────────────────────────
function go(view) {
  document.querySelectorAll(".view").forEach((v) => { v.hidden = v.id !== view; });
  if (view !== "race" && window.Race) Race.stop();
  if (view === "home") renderHome();
  if (view === "list") renderList();
  if (view === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.tAria)));
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
  document.title = state.lang === "ru" ? "Шахматный курс – викторина" : "Schachkurs-Quiz";
  const visible = document.querySelector(".view:not([hidden])");
  if (!visible) return;
  if (visible.id === "quiz") renderQuestion(true);
  else if (visible.id === "cards") renderCard(true);
  else if (visible.id === "end") renderEnd(false);
  else if (visible.id === "race") Race.relabel();
  else go(visible.id);
}

// ── Start ───────────────────────────────────────────────────────────────
function counts() {
  const c = { good: 0, practice: 0, new: 0 };
  ALL.forEach((f) => c[status(f.id)]++);
  return c;
}
function renderHome() {
  const c = counts();
  $("#statGood").textContent = c.good;
  $("#statPractice").textContent = c.practice;
  $("#statNew").textContent = c.new;
  document.querySelectorAll("[data-pool]").forEach((b) => b.classList.toggle("active", b.dataset.pool === state.pool));
}

/** Startet Karteikarten, Quiz oder Rennspiel mit den gewählten Fragen. */
let session = null; // { kind, items: [{id, options, chosen}], index, right }

function startSession(kind) {
  if (kind === "again") kind = session ? session.kind : "quiz";
  const pool = questionPool();
  if (!pool.length) {
    toast(t("allGood"));
    burst();
    return;
  }
  if (kind === "race") {
    go("race");
    Race.open(pool);
    return;
  }
  const items = pool.slice(0, SESSION_LENGTH).map((f) => ({
    id: f.id,
    options: kind === "quiz" ? optionsFor(f) : null,
    chosen: null,
  }));
  session = { kind, items, index: 0, right: 0 };
  go(kind);
  if (kind === "quiz") renderQuestion();
  else renderCard();
}

// ── Karteikarten ────────────────────────────────────────────────────────
function renderCard(keep = false) {
  const item = session.items[session.index];
  const f = BY_ID[item.id];
  const n = session.items.length;
  $("#cardCounter").textContent = `${session.index + 1}/${n}`;
  $("#cardBar").style.width = `${(session.index / n) * 100}%`;
  $("#cardQ").textContent = q(f);
  $("#cardA").textContent = a(f);
  $("#cardQ2").textContent = q(f);
  const card = $("#flashcard");
  if (!keep) {
    card.classList.remove("flipped", "pop", "turning");
    showFace(false);
    void card.offsetWidth;
    card.classList.add("pop");
    $("#rate").hidden = true;
  }
}

function showFace(back) {
  $("#flashcard .face-front").hidden = back;
  $("#flashcard .face-back").hidden = !back;
}

let turning = false;
function flipCard() {
  if (turning) return;
  const card = $("#flashcard");
  const back = !card.classList.contains("flipped");
  card.classList.toggle("flipped", back);
  if (back) $("#rate").hidden = false;
  if (reduceMotion) return showFace(back);
  // In der Mitte der Klapp-Animation (Karte ist flach) die Seite wechseln.
  turning = true;
  card.classList.remove("pop", "turning");
  void card.offsetWidth;
  card.classList.add("turning");
  setTimeout(() => showFace(back), 220);
  setTimeout(() => { card.classList.remove("turning"); turning = false; }, 450);
}

function rateCard(known) {
  const item = session.items[session.index];
  record(item.id, known);
  if (known) { session.right++; burst(18); }
  if (session.index + 1 < session.items.length) {
    session.index++;
    renderCard();
  } else {
    go("end");
    renderEnd(true);
  }
}

// ── Quiz ────────────────────────────────────────────────────────────────
function renderQuestion(keep = false) {
  const item = session.items[session.index];
  const f = BY_ID[item.id];
  const n = session.items.length;
  $("#counter").textContent = `${session.index + 1}/${n}`;
  $("#barFill").style.width = `${((session.index + (item.chosen ? 1 : 0)) / n) * 100}%`;
  $("#qBadge").textContent = PIECES[session.index % PIECES.length];
  $("#qText").textContent = q(f);

  const box = $("#answers");
  box.innerHTML = "";
  const colors = ["--a1", "--a2", "--a3", "--a4"];
  item.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.style.setProperty("--c", `var(${colors[i]})`);
    b.innerHTML = `<span class="letter">${"ABCD"[i]}</span><span></span>`;
    b.lastChild.textContent = optionText(opt);
    b.addEventListener("click", () => choose(opt));
    box.appendChild(b);
  });

  const card = $("#qCard");
  if (!keep) {
    card.classList.remove("pop", "shake");
    void card.offsetWidth;
    card.classList.add("pop");
  }
  if (item.chosen) showResult(false);
  else {
    $("#feedback").hidden = true;
    $("#nextBtn").hidden = true;
  }
}

function choose(opt) {
  const item = session.items[session.index];
  if (item.chosen) return;
  item.chosen = opt;
  const right = isRightOption(item.id, opt);
  if (right) session.right++;
  record(item.id, right);
  showResult(true);
}

function showResult(animate) {
  const item = session.items[session.index];
  const right = isRightOption(item.id, item.chosen);
  [...$("#answers").children].forEach((b, i) => {
    const opt = item.options[i];
    b.disabled = true;
    if (isRightOption(item.id, opt)) b.classList.add("correct");
    else if (opt === item.chosen) b.classList.add("wrong");
    else b.classList.add("dim");
  });

  const fb = $("#feedback");
  fb.hidden = false;
  fb.className = `feedback ${right ? "good" : "bad"}`;
  if (right) {
    const praise = t("praise");
    fb.textContent = praise[(session.index + session.right) % praise.length];
  } else {
    const correctOpt = item.options.find((o) => isRightOption(item.id, o));
    fb.textContent = `${t("wrong")} ${optionText(correctOpt)}`;
  }

  const next = $("#nextBtn");
  next.hidden = false;
  next.textContent = session.index + 1 < session.items.length ? t("next") : t("finish");
  $("#barFill").style.width = `${((session.index + 1) / session.items.length) * 100}%`;

  if (animate) {
    const card = $("#qCard");
    card.classList.remove("pop", "shake");
    void card.offsetWidth;
    if (right) burst(28); else card.classList.add("shake");
    next.focus({ preventScroll: true });
  }
}

function nextQuestion() {
  if (session.index + 1 < session.items.length) {
    session.index++;
    renderQuestion();
  } else {
    go("end");
    renderEnd(true);
  }
}

// ── Ergebnis (Karteikarten und Quiz) ────────────────────────────────────
function renderEnd(animate) {
  const n = session.items.length;
  const share = session.right / n;
  const stars = share >= 0.9 ? 3 : share >= 0.6 ? 2 : 1;
  $("#stars").innerHTML = [0, 1, 2]
    .map((i) => `<span class="${i < stars ? "" : "off"}" style="animation-delay:${i * 0.18}s">⭐</span>`)
    .join("");
  $("#endTitle").textContent = stars === 3 ? t("endGreat") : stars === 2 ? t("endGood") : t("endTry");
  $("#endScore").textContent = (session.kind === "cards" ? t("endKnown") : t("endScore"))(session.right, n);
  if (animate && stars >= 2) setTimeout(() => burst(stars === 3 ? 160 : 80), 300);
}

// ── Alle Fragen ─────────────────────────────────────────────────────────
function renderList() {
  const body = $("#listBody");
  body.innerHTML = "";
  let nr = 0;
  THEMEN.forEach((thema) => {
    if (THEMEN.length > 1) {
      const h = document.createElement("h3");
      h.className = "topic-title";
      h.textContent = thema.titel[state.lang];
      body.appendChild(h);
    }
    thema.fragen.forEach((f) => {
      nr++;
      const b = document.createElement("button");
      b.className = "flip";
      b.innerHTML = `<span class="num"></span><span class="q"></span><span class="tap"></span>`;
      b.querySelector(".num").textContent = `${nr}.`;
      b.querySelector(".q").textContent = q(f);
      b.querySelector(".tap").textContent = t("tapToReveal");
      b.addEventListener("click", () => {
        const shown = b.querySelector(".a");
        if (shown) {
          shown.remove();
          b.appendChild(Object.assign(document.createElement("span"), { className: "tap", textContent: t("tapToReveal") }));
        } else {
          b.querySelector(".tap").remove();
          b.appendChild(Object.assign(document.createElement("span"), { className: "a", textContent: `✅ ${a(f)}` }));
        }
      });
      body.appendChild(b);
    });
  });
}

// ── Fortschritt ─────────────────────────────────────────────────────────
let filter = "all";
const STATUS_STYLE = {
  good: { dot: "✅", color: "var(--good)" },
  practice: { dot: "🔄", color: "var(--practice)" },
  new: { dot: "⭐", color: "var(--new)" },
};

function renderProgress() {
  const c = counts();
  const pct = Math.round((c.good / ALL.length) * 100);
  $("#ringPct").textContent = `${pct}%`;
  $("#cGood").textContent = c.good;
  $("#cPractice").textContent = c.practice;
  $("#cNew").textContent = c.new;
  const fg = $("#ringFg");
  fg.style.strokeDashoffset = 327;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fg.style.strokeDashoffset = 327 * (1 - pct / 100);
  }));

  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b.dataset.filter === filter));

  // Erst die zum Üben, dann neue, dann die guten.
  const order = { practice: 0, new: 1, good: 2 };
  const rows = ALL
    .filter((f) => filter === "all" || status(f.id) === filter)
    .sort((x, y) => order[status(x.id)] - order[status(y.id)]);

  const body = $("#progressBody");
  body.innerHTML = "";
  if (!rows.length) {
    body.innerHTML = `<div class="empty"></div>`;
    body.firstChild.textContent = t("nothingHere");
    return;
  }
  rows.forEach((f, i) => {
    const st = status(f.id);
    const s = state.stats[f.id] || { r: 0, w: 0 };
    const row = document.createElement("div");
    row.className = "prow";
    row.style.setProperty("--s", STATUS_STYLE[st].color);
    row.style.animationDelay = `${Math.min(i, 15) * 0.03}s`;
    row.innerHTML = `<span class="dot"></span><span class="txt"><span class="qq"></span><small></small></span>
      <span class="score"><span class="r"></span><span class="w"></span></span>`;
    row.querySelector(".dot").textContent = STATUS_STYLE[st].dot;
    row.querySelector(".qq").textContent = q(f);
    row.querySelector("small").textContent = a(f);
    row.querySelector(".r").textContent = `✓ ${s.r}`;
    row.querySelector(".w").textContent = `✗ ${s.w}`;
    body.appendChild(row);
  });
}

// ── Konfetti ────────────────────────────────────────────────────────────
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let running = false;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Konfetti braucht keine hohe Auflösung – 1 Pixel pro CSS-Pixel reicht.
const CONFETTI_SCALE = 1;
function resize() {
  canvas.width = innerWidth * CONFETTI_SCALE;
  canvas.height = innerHeight * CONFETTI_SCALE;
}
addEventListener("resize", resize);
resize();

function burst(count = 60) {
  if (reduceMotion) return;
  const colors = ["#7c3aed", "#f472b6", "#facc15", "#38bdf8", "#4ade80", "#fb923c"];
  const dpr = CONFETTI_SCALE;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: innerWidth / 2 * dpr,
      y: innerHeight * 0.45 * dpr,
      vx: (Math.random() - 0.5) * 18 * dpr,
      vy: (-Math.random() * 16 - 6) * dpr,
      size: (6 + Math.random() * 8) * dpr,
      color: colors[i % colors.length],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      piece: Math.random() < 0.15 ? PIECES[i % PIECES.length] : null,
      life: 0,
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

let dirty = null; // Bereich, in dem im letzten Bild gezeichnet wurde
function tick() {
  if (dirty) ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
  const dpr = CONFETTI_SCALE;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  particles = particles.filter((p) => p.life < 160 && p.y < canvas.height + 50);
  for (const p of particles) {
    p.life++;
    p.vy += 0.45 * dpr;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    const r = p.size * 3;
    minX = Math.min(minX, p.x - r); maxX = Math.max(maxX, p.x + r);
    minY = Math.min(minY, p.y - r); maxY = Math.max(maxY, p.y + r);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, 1 - p.life / 160);
    ctx.fillStyle = p.color;
    if (p.piece) {
      ctx.font = `${p.size * 2.6}px serif`;
      ctx.fillText(p.piece, -p.size, p.size);
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  }
  dirty = particles.length ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY } : null;
  if (particles.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

// Kleine Meldung unten (z. B. „Du kannst schon alles").
function toast(text) {
  const el = document.createElement("div");
  el.textContent = text;
  Object.assign(el.style, {
    position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)",
    background: "#1e1b4b", color: "#fff", padding: "14px 22px", borderRadius: "18px",
    fontWeight: "800", zIndex: 60, boxShadow: "0 10px 30px rgba(0,0,0,.25)", textAlign: "center",
    maxWidth: "90vw",
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// ── Schwebende Figuren im Hintergrund ───────────────────────────────────
function makeFloaters() {
  if (reduceMotion) return;
  const box = document.querySelector(".floaters");
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "floater";
    s.textContent = PIECES[i % PIECES.length];
    s.style.left = `${Math.random() * 100}%`;
    s.style.fontSize = `${28 + Math.random() * 46}px`;
    s.style.animationDuration = `${16 + Math.random() * 18}s`;
    s.style.animationDelay = `${-Math.random() * 30}s`;
    box.appendChild(s);
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) return go(goBtn.dataset.go);
  const start = e.target.closest("[data-start]");
  if (start) return startSession(start.dataset.start);
  const pool = e.target.closest("[data-pool]");
  if (pool) {
    state.pool = pool.dataset.pool;
    save();
    return renderHome();
  }
  const lang = e.target.closest("[data-lang]");
  if (lang) {
    state.lang = lang.dataset.lang;
    save();
    return applyLang();
  }
  const f = e.target.closest("[data-filter]");
  if (f) {
    filter = f.dataset.filter;
    return renderProgress();
  }
});
$("#nextBtn").addEventListener("click", nextQuestion);
$("#flashcard").addEventListener("click", flipCard);
$("#rateYes").addEventListener("click", () => rateCard(true));
$("#rateNo").addEventListener("click", () => rateCard(false));
$("#resetBtn").addEventListener("click", () => {
  if (!confirm(t("resetConfirm"))) return;
  state.stats = {};
  save();
  renderProgress();
});

// Tastatur: Quiz 1–4/A–D + Enter; Karteikarten Leertaste = umdrehen, ←/→.
document.addEventListener("keydown", (e) => {
  if (!$("#cards").hidden && session) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCard(); }
    else if ($("#flashcard").classList.contains("flipped")) {
      if (e.key === "ArrowRight") rateCard(true);
      if (e.key === "ArrowLeft") rateCard(false);
    }
    return;
  }
  if ($("#quiz").hidden || !session) return;
  const item = session.items[session.index];
  const idx = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
  if (!item.chosen && idx >= 0 && idx < item.options.length) choose(item.options[idx]);
  else if (item.chosen && e.key === "Enter" && document.activeElement !== $("#nextBtn")) nextQuestion();
});

makeFloaters();
applyLang();
go("home");
