/*
 * Rennspiel: Du fährst Auto (Sicht aus dem Fahrersitz). Über jeder Spur hängt
 * ein Schild mit einer Antwort – fahr in die richtige Spur. Falsche Spur oder
 * zu langsam: Crash in den LKW.
 *
 * Gezeichnet wird mit einer einfachen Perspektive: Ein Punkt in der Welt
 * (x seitlich, z nach vorn) landet auf dem Bildschirm bei
 *   y = Horizont + Kamerahöhe · F / z,   x = Mitte + (x − kameraX) · F / z.
 */
"use strict";

// Zeiten – hier lässt sich das Spiel leichter oder schwerer machen.
const ANSWER_TIME = 4;                         // Sekunden zum Antworten
const readTime = (question, answers) =>        // Sekunden zum Lesen vorher
  Math.min(6, Math.max(2, 1.2 + question.length * 0.035 + answers.join("").length * 0.015));
const START_SPEED = 24;                        // Welt-Einheiten pro Sekunde
const SPEED_STEP = 1.3;                        // schneller nach jeder richtigen Antwort
const MAX_SPEED = 44;

const ROAD_HALF = 2.4;   // halbe Straßenbreite
const CAM_H = 1;         // Kamerahöhe
const GATE_PASS_Z = 2.2; // hier „fährt man durch" das Schild
const SEG = 3;           // Länge der Streifen auf Wiese und Rand

const LANE_COLORS = ["#38bdf8", "#f472b6", "#facc15", "#4ade80"];

window.Race = (() => {
  const wrap = document.getElementById("raceWrap");
  const cv = document.getElementById("raceCanvas");
  const g = cv.getContext("2d");
  const el = (id) => document.getElementById(id);

  let W = 0, H = 0, dpr = 1, F = 1, horizon = 0;
  let raf = 0, last = 0;

  // Spielzustand
  let phase = "idle"; // idle | intro | countdown | read | answer | resolve | crash | over
  let pool = [], poolIndex = 0;
  let current = null; // { f, options, lanes, chosen, answerAt, readUntil }
  let travel = 0, speed = START_SPEED;
  let camX = 0, targetX = 0, roll = 0;
  let gateZ = null, truck = null;
  let score = 0, phaseTime = 0, flash = 0, crack = null;
  let result = null; // { reason, right }

  // ── Größe ────────────────────────────────────────────────────────────
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = wrap.getBoundingClientRect();
    W = cv.width = Math.round(r.width * dpr);
    H = cv.height = Math.round(r.height * dpr);
    horizon = H * 0.4;
    F = H * 0.85;
  }
  new ResizeObserver(() => { if (phase !== "idle") resize(); }).observe(wrap);

  const laneWidth = (n) => (ROAD_HALF * 2) / n;
  const laneX = (i, n) => -ROAD_HALF + laneWidth(n) * (i + 0.5);
  const sx = (x, z) => W / 2 + ((x - camX) * F) / z;
  const sy = (z) => horizon + (CAM_H * F) / z;

  // ── Öffentliche Funktionen ───────────────────────────────────────────
  function open(questions) {
    pool = questions;
    poolIndex = 0;
    resize();
    reset();
    phase = "intro";
    showPanel("intro");
    start();
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
    phase = "idle";
  }

  function relabel() {
    if (phase === "intro") showPanel("intro");
    else if (phase === "over") showPanel("over");
    if (current) renderQuestion(false);
  }

  // ── Ablauf ───────────────────────────────────────────────────────────
  function reset() {
    travel = 0;
    speed = START_SPEED;
    camX = targetX = roll = 0;
    gateZ = truck = current = result = crack = null;
    score = 0;
    flash = 0;
    el("raceScore").textContent = "0";
    el("raceBest").textContent = state.raceBest || 0;
    el("raceQuestion").textContent = "";
    el("raceAnswers").innerHTML = "";
    el("raceTimer").style.width = "100%";
    el("raceBanner").hidden = true;
  }

  function begin() {
    reset();
    el("racePanel").hidden = true;
    phase = "countdown";
    phaseTime = 0;
  }

  function nextQuestion() {
    if (poolIndex >= pool.length) {
      // Alle durch: neu mischen und weiter.
      pool = shuffle(pool);
      poolIndex = 0;
    }
    const f = pool[poolIndex++];
    const options = optionsFor(f);
    current = { f, options, lanes: options.length, chosen: null };
    gateZ = null;
    phase = "read";
    phaseTime = 0;
    current.readFor = readTime(q(f), options.map(optionText));
    renderQuestion(true);
  }

  function renderQuestion(animate) {
    const qEl = el("raceQuestion");
    qEl.textContent = q(current.f);
    if (animate) {
      qEl.classList.remove("pop");
      void qEl.offsetWidth;
      qEl.classList.add("pop");
    }
    const box = el("raceAnswers");
    box.innerHTML = "";
    box.classList.toggle("locked", phase === "read");
    current.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "race-answer";
      b.style.setProperty("--c", LANE_COLORS[i]);
      b.innerHTML = `<span class="letter">${"ABCD"[i]}</span><span></span>`;
      b.lastChild.textContent = optionText(opt);
      b.disabled = phase !== "answer";
      if (current.chosen === i) b.classList.add("picked");
      b.addEventListener("click", () => choose(i));
      box.appendChild(b);
    });
  }

  function unlock() {
    phase = "answer";
    phaseTime = 0;
    // Das Schild steht so weit weg, dass man in ANSWER_TIME Sekunden dort ist.
    gateZ = speed * ANSWER_TIME + GATE_PASS_Z;
    el("raceAnswers").classList.remove("locked");
    el("raceAnswers").querySelectorAll("button").forEach((b) => { b.disabled = false; });
  }

  function choose(i) {
    if (phase !== "answer" || current.chosen !== null) return;
    current.chosen = i;
    targetX = laneX(i, current.lanes);
    phase = "resolve";
    el("raceAnswers").querySelectorAll("button").forEach((b, j) => {
      b.disabled = true;
      if (j === i) b.classList.add("picked");
    });
  }

  function passGate() {
    const right = current.chosen !== null && isRightOption(current.f.id, current.options[current.chosen]);
    record(current.f.id, right);
    if (right) {
      score++;
      speed = Math.min(MAX_SPEED, speed + SPEED_STEP);
      const s = el("raceScore");
      s.textContent = score;
      s.classList.remove("bump");
      void s.offsetWidth;
      s.classList.add("bump");
      const praise = t("raceRight");
      banner(praise[score % praise.length], 900);
      burst(24);
      gateZ = null;
      phase = "pause";
      phaseTime = 0;
    } else {
      result = { reason: current.chosen === null ? "slow" : "crash", right: rightAnswer() };
      // LKW in der eigenen Spur, kurz hinter dem Schild.
      const lane = current.chosen ?? nearestLane();
      truck = { lane, lanes: current.lanes, z: 16 };
      targetX = laneX(lane, current.lanes);
      phase = "crash";
      phaseTime = 0;
      if (result.reason === "slow") banner(t("raceSlow"), 1100);
    }
  }

  function rightAnswer() {
    const opt = current.options.find((o) => isRightOption(current.f.id, o));
    return optionText(opt);
  }
  function nearestLane() {
    let best = 0;
    for (let i = 1; i < current.lanes; i++) {
      if (Math.abs(laneX(i, current.lanes) - camX) < Math.abs(laneX(best, current.lanes) - camX)) best = i;
    }
    return best;
  }

  function impact() {
    phase = "impact";
    phaseTime = 0;
    flash = 1;
    crack = { x: W / 2 + (Math.random() - 0.5) * W * 0.2, y: H * 0.45, seed: Math.random() };
    wrap.classList.remove("shake");
    void wrap.offsetWidth;
    wrap.classList.add("shake");
    if (navigator.vibrate) navigator.vibrate([120, 60, 200]);
    banner(t("raceCrash"), 1300);
  }

  function gameOver() {
    phase = "over";
    const best = state.raceBest || 0;
    result.newBest = score > best;
    if (result.newBest) {
      state.raceBest = score;
      save();
      el("raceBest").textContent = score;
      setTimeout(() => burst(140), 250);
    }
    showPanel("over");
  }

  function showPanel(kind) {
    const panel = el("racePanel");
    panel.hidden = false;
    if (kind === "intro") {
      el("racePanelIcon").textContent = "🏎️";
      el("racePanelTitle").textContent = t("raceTitle");
      el("racePanelText").textContent = t("raceIntro");
      el("raceStart").textContent = t("raceStart");
    } else {
      el("racePanelIcon").textContent = result.newBest ? "🏆" : result.reason === "slow" ? "⏰" : "💥";
      el("racePanelTitle").textContent = result.newBest ? t("raceNewBest")
        : result.reason === "slow" ? t("raceSlow") : t("raceCrash");
      el("racePanelText").textContent = `${t("raceResult")(score)}\n${t("raceWasRight")(result.right)}`;
      el("raceStart").textContent = t("raceAgain");
    }
  }

  let bannerTimer = 0;
  function banner(text, ms) {
    const b = el("raceBanner");
    b.textContent = text;
    b.hidden = false;
    b.style.animation = "none";
    void b.offsetWidth;
    b.style.animation = "";
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => { b.hidden = true; }, ms);
  }

  // ── Schleife ─────────────────────────────────────────────────────────
  function start() {
    cancelAnimationFrame(raf);
    last = null;
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    // Immer die Zeit von requestAnimationFrame nehmen – nie negativ, höchstens
    // 50 ms pro Bild (sonst springt das Spiel nach einem Ruckler).
    if (last === null) last = now;
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function update(dt) {
    phaseTime += dt;
    let v = speed;

    if (phase === "intro" || phase === "over") v = phase === "over" ? 0 : 10;
    if (phase === "countdown") {
      const n = 3 - Math.floor(phaseTime / 0.6);
      const label = n > 0 ? String(n) : t("raceGo");
      if (el("raceBanner").textContent !== label || el("raceBanner").hidden) banner(label, 700);
      if (phaseTime > 2.2) nextQuestion();
    }
    if (phase === "read") {
      el("raceTimer").style.width = "100%";
      if (phaseTime >= current.readFor) unlock();
    }
    if (phase === "pause" && phaseTime > 0.5) nextQuestion();
    if (phase === "answer" || phase === "resolve") {
      // Nach der Wahl Turbo zum Schild, damit man nicht wartet.
      const approach = phase === "resolve" ? Math.max(v, (gateZ - GATE_PASS_Z) / 0.45) : v;
      gateZ -= approach * dt;
      v = approach;
      const left = Math.max(0, (gateZ - GATE_PASS_Z) / (speed * ANSWER_TIME));
      if (phase === "answer") el("raceTimer").style.width = `${left * 100}%`;
      if (gateZ <= GATE_PASS_Z) passGate();
    }
    if (phase === "crash") {
      truck.z -= v * dt;
      if (gateZ !== null) gateZ -= v * dt; // Schild fährt hinter uns weg
      if (truck.z <= 1.6) impact();
    }
    if (phase === "impact") {
      v = Math.max(0, speed * (1 - phaseTime * 3));
      if (phaseTime > 1.4) gameOver();
    }

    travel += v * dt;
    // Lenken: weich zur Zielspur, Auto neigt sich dabei.
    const dx = targetX - camX;
    camX += dx * Math.min(1, dt * 7);
    roll += ((-dx * 0.08) - roll) * Math.min(1, dt * 8);
    flash = Math.max(0, flash - dt * 1.6);
  }

  // ── Zeichnen ─────────────────────────────────────────────────────────
  function draw() {
    if (!W) return;
    g.save();
    // Ganze Welt leicht mitneigen beim Lenken.
    g.translate(W / 2, H);
    g.rotate(roll);
    g.translate(-W / 2, -H);
    drawSky();
    drawGround();
    drawRoadside();
    if (gateZ !== null && current) drawGate(gateZ);
    if (truck) drawTruck(truck);
    g.restore();
    drawHood();
    if (crack) drawCrack();
    if (flash > 0) {
      g.fillStyle = `rgba(255,255,255,${flash})`;
      g.fillRect(0, 0, W, H);
    }
  }

  function drawSky() {
    const sky = g.createLinearGradient(0, -H * 0.2, 0, horizon);
    sky.addColorStop(0, "#38bdf8");
    sky.addColorStop(1, "#e0f2fe");
    g.fillStyle = sky;
    g.fillRect(-W, -H, W * 3, horizon + H + 2);
    // Sonne
    g.fillStyle = "rgba(253, 224, 71, .95)";
    g.beginPath();
    g.arc(W * 0.78 - camX * 6 * dpr, horizon * 0.42, H * 0.06, 0, Math.PI * 2);
    g.fill();
    // Wolken ziehen langsam
    g.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 4; i++) {
      const x = ((i * 0.31 + travel * 0.0006) % 1.3 - 0.15) * W;
      const y = horizon * (0.18 + (i % 2) * 0.22);
      cloud(x, y, H * 0.035 * (1 + (i % 3) * 0.3));
    }
    // Berge (bewegen sich kaum – weit weg)
    const off = -camX * 12 * dpr;
    mountains(off, "#a78bfa", 0.16, 7);
    mountains(off * 1.6, "#7c3aed", 0.09, 5);
  }

  function cloud(x, y, r) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.arc(x + r * 1.1, y - r * 0.4, r * 1.2, 0, Math.PI * 2);
    g.arc(x + r * 2.3, y, r * 0.95, 0, Math.PI * 2);
    g.fill();
  }

  function mountains(off, color, height, peaks) {
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(-W, horizon + 1);
    for (let i = 0; i <= peaks * 3; i++) {
      const x = -W + (i / (peaks * 3)) * W * 3 + off;
      const h = (i % 2 ? 1 : 0.45 + ((i * 7) % 5) / 10) * H * height;
      g.lineTo(x, horizon - h);
    }
    g.lineTo(W * 2, horizon + 1);
    g.fill();
  }

  function drawGround() {
    const step = Math.max(1, Math.round(dpr));
    const lanes = current ? current.lanes : 4;
    const lw = laneWidth(lanes);
    for (let y = Math.floor(horizon) + 1; y < H; y += step) {
      const z = (CAM_H * F) / (y - horizon);
      const stripe = Math.floor((z + travel) / SEG) % 2 === 0;
      const dash = Math.floor((z + travel) / 2.2) % 2 === 0;
      const k = F / z;
      const center = W / 2 - camX * k;
      // Wiese
      g.fillStyle = stripe ? "#4ade80" : "#22c55e";
      g.fillRect(-W, y, W * 3, step);
      // Randstreifen rot/weiß
      const half = ROAD_HALF * k;
      const rumble = 0.28 * k;
      g.fillStyle = stripe ? "#ef4444" : "#f8fafc";
      g.fillRect(center - half - rumble, y, half * 2 + rumble * 2, step);
      // Straße
      g.fillStyle = stripe ? "#64748b" : "#5b6578";
      g.fillRect(center - half, y, half * 2, step);
      // Spurlinien
      if (dash) {
        g.fillStyle = "#f8fafc";
        const lineW = Math.max(1, 0.07 * k);
        for (let i = 1; i < lanes; i++) {
          const x = center + (-ROAD_HALF + lw * i) * k;
          g.fillRect(x - lineW / 2, y, lineW, step);
        }
      }
    }
    // Dunst am Horizont
    const haze = g.createLinearGradient(0, horizon, 0, horizon + H * 0.12);
    haze.addColorStop(0, "rgba(224, 242, 254, .85)");
    haze.addColorStop(1, "rgba(224, 242, 254, 0)");
    g.fillStyle = haze;
    g.fillRect(-W, horizon, W * 3, H * 0.12);
  }

  function drawRoadside() {
    // Bäume und Pfosten links und rechts, von hinten nach vorn.
    const spacing = 7;
    const first = spacing - (travel % spacing);
    const items = [];
    for (let i = 0; i < 18; i++) {
      const z = first + i * spacing;
      if (z < 1.2) continue;
      const n = Math.floor((travel + z) / spacing);
      items.push({ z, side: -1, kind: n % 3 === 0 ? "post" : "tree", n });
      items.push({ z, side: 1, kind: n % 3 === 1 ? "post" : "tree", n: n + 7 });
    }
    items.sort((p, r) => r.z - p.z);
    for (const it of items) {
      const k = F / it.z;
      const x = sx(it.side * (ROAD_HALF + 1 + (it.n % 4) * 0.5), it.z);
      const y = sy(it.z);
      if (it.kind === "tree") {
        g.fillStyle = "#92400e";
        g.fillRect(x - 0.08 * k, y - 0.9 * k, 0.16 * k, 0.9 * k);
        g.fillStyle = it.n % 2 ? "#15803d" : "#16a34a";
        g.beginPath();
        g.arc(x, y - 1.2 * k, 0.55 * k, 0, Math.PI * 2);
        g.arc(x - 0.3 * k, y - 0.95 * k, 0.4 * k, 0, Math.PI * 2);
        g.arc(x + 0.3 * k, y - 0.95 * k, 0.4 * k, 0, Math.PI * 2);
        g.fill();
      } else {
        g.fillStyle = "#e2e8f0";
        g.fillRect(x - 0.05 * k, y - 0.7 * k, 0.1 * k, 0.7 * k);
        g.fillStyle = "#f97316";
        g.fillRect(x - 0.05 * k, y - 0.7 * k, 0.1 * k, 0.15 * k);
      }
    }
  }

  function drawGate(z) {
    if (z <= 0.8) return;
    const n = current.lanes;
    const lw = laneWidth(n);
    const k = F / z;
    const ground = sy(z);
    const top = ground - 2.4 * k;
    const boardH = 0.85 * k;
    // Pfosten und Querbalken
    g.fillStyle = "#334155";
    const postW = 0.12 * k;
    g.fillRect(sx(-ROAD_HALF - 0.35, z) - postW / 2, top, postW, ground - top);
    g.fillRect(sx(ROAD_HALF + 0.35, z) - postW / 2, top, postW, ground - top);
    g.fillRect(sx(-ROAD_HALF - 0.35, z), top - 0.06 * k, (ROAD_HALF * 2 + 0.7) * k, 0.12 * k);
    // Ein Schild pro Spur
    for (let i = 0; i < n; i++) {
      const left = sx(-ROAD_HALF + lw * i + 0.06, z);
      const width = (lw - 0.12) * k;
      let color = LANE_COLORS[i];
      if (phase === "crash" || phase === "impact" || phase === "pause") {
        const right = isRightOption(current.f.id, current.options[i]);
        color = right ? "#22c55e" : i === current.chosen ? "#ef4444" : "#94a3b8";
      }
      g.fillStyle = "rgba(15, 23, 42, .35)";
      roundRect(left + 0.04 * k, top + 0.08 * k, width, boardH, 0.12 * k);
      g.fillStyle = color;
      roundRect(left, top, width, boardH, 0.12 * k);
      // Buchstabe groß, Antwort darunter (wenn genug Platz)
      g.fillStyle = "#1e1b4b";
      g.textAlign = "center";
      g.textBaseline = "middle";
      const letterSize = 0.36 * k;
      g.font = `900 ${letterSize}px Nunito, sans-serif`;
      g.fillText("ABCD"[i], left + width / 2, top + boardH * 0.32);
      const textSize = Math.min(0.2 * k, 40 * dpr);
      if (textSize >= 7 * dpr) {
        g.font = `800 ${textSize}px Nunito, sans-serif`;
        fitText(optionText(current.options[i]), left + width / 2, top + boardH * 0.72, width * 0.92);
      }
    }
  }

  function fitText(text, x, y, maxW) {
    let s = text;
    if (g.measureText(s).width <= maxW) return g.fillText(s, x, y);
    while (s.length > 1 && g.measureText(s + "…").width > maxW) s = s.slice(0, -1);
    g.fillText(s + "…", x, y);
  }

  function roundRect(x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.fill();
  }

  function drawTruck(tr) {
    const z = tr.z;
    if (z <= 0.5) return;
    const k = F / z;
    const lw = laneWidth(tr.lanes);
    const cx = sx(laneX(tr.lane, tr.lanes), z);
    const ground = sy(z);
    const w = Math.min(lw * 0.95, 1.5) * k;
    const h = 1.9 * k;
    // Schatten
    g.fillStyle = "rgba(0,0,0,.25)";
    g.fillRect(cx - w * 0.55, ground - 0.05 * k, w * 1.1, 0.1 * k);
    // Räder
    g.fillStyle = "#111827";
    g.fillRect(cx - w * 0.48, ground - 0.35 * k, w * 0.22, 0.35 * k);
    g.fillRect(cx + w * 0.26, ground - 0.35 * k, w * 0.22, 0.35 * k);
    // Aufbau (Rückseite des Anhängers)
    g.fillStyle = "#f1f5f9";
    g.fillRect(cx - w / 2, ground - h, w, h - 0.3 * k);
    g.fillStyle = "#cbd5e1";
    g.fillRect(cx - 0.02 * k, ground - h, 0.04 * k, h - 0.3 * k);
    // Warnstreifen
    for (let i = 0; i < 6; i++) {
      g.fillStyle = i % 2 ? "#ef4444" : "#f8fafc";
      g.fillRect(cx - w / 2 + (w / 6) * i, ground - 0.42 * k, w / 6, 0.12 * k);
    }
    // Rücklichter
    g.fillStyle = "#dc2626";
    g.fillRect(cx - w / 2 + 0.06 * k, ground - 0.62 * k, 0.16 * k, 0.12 * k);
    g.fillRect(cx + w / 2 - 0.22 * k, ground - 0.62 * k, 0.16 * k, 0.12 * k);
    // Aufschrift „LKW"
    g.fillStyle = "#1e1b4b";
    g.font = `900 ${0.32 * k}px Nunito, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(state.lang === "ru" ? "ГРУЗОВИК" : "LKW", cx, ground - h * 0.6, w * 0.9);
  }

  function drawHood() {
    // Motorhaube des eigenen Autos (Sicht vom Fahrersitz).
    const top = H * 0.83;
    const hood = g.createLinearGradient(0, top, 0, H);
    hood.addColorStop(0, "#f43f5e");
    hood.addColorStop(1, "#9f1239");
    g.fillStyle = hood;
    g.beginPath();
    g.moveTo(-10, H);
    g.lineTo(-10, top + H * 0.08);
    g.quadraticCurveTo(W / 2, top - H * 0.035, W + 10, top + H * 0.08);
    g.lineTo(W + 10, H);
    g.fill();
    // Glanzlicht
    g.fillStyle = "rgba(255,255,255,.22)";
    g.beginPath();
    g.ellipse(W / 2, top + H * 0.045, W * 0.22, H * 0.012, 0, 0, Math.PI * 2);
    g.fill();
    // Springer als Kühlerfigur
    g.fillStyle = "#fff";
    g.font = `${H * 0.07}px serif`;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.fillText("♞", W / 2, top + H * 0.035);
  }

  function drawCrack() {
    // Gesprungene Scheibe nach dem Crash.
    g.save();
    g.strokeStyle = "rgba(255,255,255,.85)";
    g.lineWidth = 2 * dpr;
    let seed = crack.seed * 1000;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2 + rnd() * 0.3;
      let x = crack.x, y = crack.y;
      g.beginPath();
      g.moveTo(x, y);
      for (let s = 0; s < 4; s++) {
        const len = (0.05 + rnd() * 0.08) * H;
        x += Math.cos(ang + (rnd() - 0.5) * 0.6) * len;
        y += Math.sin(ang + (rnd() - 0.5) * 0.6) * len;
        g.lineTo(x, y);
      }
      g.stroke();
    }
    g.restore();
  }

  // ── Bedienung ────────────────────────────────────────────────────────
  el("raceStart").addEventListener("click", begin);
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("race").hidden) return;
    if ((phase === "intro" || phase === "over") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      return begin();
    }
    if (phase !== "answer" || !current) return;
    let i = "1234".indexOf(e.key);
    if (i < 0) i = "abcd".indexOf(e.key.toLowerCase());
    if (i >= 0 && i < current.lanes) choose(i);
  });

  // Nur zum Testen: aktueller Zustand.
  const peek = () => ({ phase, gateZ, truckZ: truck ? truck.z : null, score });

  return { open, stop, relabel, peek };
})();
