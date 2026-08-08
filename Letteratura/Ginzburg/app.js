(() => {
  "use strict";

  const DATA = window.LESSON_DATA;
  const STORAGE_KEY = "gbprof-ginzburg-v1";
  const tabs = [
    ["lesson", "Lezione"], ["summary", "Sintesi"], ["essentials", "Saperi"],
    ["vocabulary", "Vocabolario"], ["map", "Mappa"], ["quiz", "Test"]
  ];
  const defaultState = { lastSection: 0, visited: [], notes: {}, quizzes: {} };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const els = {
    cover: $("#coverView"), lesson: $("#lessonView"), final: $("#finalView"),
    drawer: $("#drawer"), scrim: $("#scrim"), nav: $("#drawerNav"), route: $("#coverRoute"),
    tabs: $("#sectionTabs"), panel: $("#panelContent"), notes: $("#sectionNotes"),
    saveStatus: $("#saveStatus"), readingBar: $("#readingBar")
  };
  let state = loadState();
  let activeSection = Math.min(state.lastSection || 0, DATA.length - 1);
  let activeTab = "lesson";
  let noteTimer;

  function loadState() {
    try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return structuredClone(defaultState); }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function showView(view) {
    [els.cover, els.lesson, els.final].forEach(node => node.classList.toggle("active", node === view));
    closeDrawer();
    window.scrollTo({ top: 0, behavior: "instant" });
    updateReadingProgress();
  }
  function openDrawer() {
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    $("#menuButton").setAttribute("aria-expanded", "true");
    els.scrim.hidden = false;
    $("#closeMenu").focus();
  }
  function closeDrawer() {
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    $("#menuButton").setAttribute("aria-expanded", "false");
    els.scrim.hidden = true;
  }
  function updateNav() {
    els.nav.innerHTML = DATA.map((s, i) => `
      <button type="button" data-section="${i}" class="${i === activeSection ? "active" : ""}">
        <span class="nav-number">${s.number}</span><span>${s.title}</span>
        <span class="nav-check" aria-label="${state.visited.includes(i) ? "Visitata" : "Non ancora visitata"}">${state.visited.includes(i) ? "✓" : ""}</span>
      </button>`).join("");
    $$('[data-section]', els.nav).forEach(b => b.addEventListener("click", () => renderSection(Number(b.dataset.section))));
  }
  function buildRoute() {
    els.route.innerHTML = DATA.map((s, i) => `<button class="route-step" data-route="${i}" type="button"><b>${s.number}</b><span>${s.title}</span></button>`).join("");
    $$('[data-route]', els.route).forEach(b => b.addEventListener("click", () => renderSection(Number(b.dataset.route))));
  }
  function renderSection(index, tab = "lesson") {
    activeSection = index;
    activeTab = tab;
    const s = DATA[index];
    state.lastSection = index;
    if (!state.visited.includes(index)) state.visited.push(index);
    saveState();
    document.documentElement.style.setProperty("--section-color", s.color);
    $("#lessonHero").style.setProperty("--section-color", s.color);
    $("#sectionNumber").textContent = `${s.number} / 06`;
    $("#sectionTitle").textContent = s.title;
    $("#sectionSubtitle").textContent = s.subtitle;
    $("#generativeQuestion").textContent = s.question;
    $("#sectionCounter").textContent = `${index + 1} di ${DATA.length}`;
    $("#prevSection").disabled = index === 0;
    $("#nextSection").textContent = index === DATA.length - 1 ? "Verifica finale →" : "Successiva →";
    els.notes.value = state.notes[s.id] || "";
    els.saveStatus.textContent = "";
    renderTabs();
    renderPanel();
    updateNav();
    showView(els.lesson);
  }
  function renderTabs() {
    els.tabs.innerHTML = tabs.map(([id, label]) => `<button type="button" role="tab" id="tab-${id}" aria-controls="panelContent" aria-selected="${id === activeTab}" data-tab="${id}">${label}</button>`).join("");
    $$('[data-tab]', els.tabs).forEach(button => button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      renderTabs(); renderPanel(); window.scrollTo({ top: $("#lessonView").offsetTop + $("#lessonHero").offsetHeight - 70, behavior: "smooth" });
    }));
  }
  function renderPanel() {
    const s = DATA[activeSection];
    els.panel.setAttribute("role", "tabpanel");
    els.panel.setAttribute("aria-labelledby", `tab-${activeTab}`);
    const renderers = {
      lesson: () => `<p class="eyebrow">Lezione estesa</p><h2>${s.subtitle}</h2>${s.lesson}`,
      summary: () => `<p class="eyebrow">Sintesi</p><h2>Il percorso in breve</h2><p class="summary-panel">${s.summary}</p>`,
      essentials: () => `<p class="eyebrow">Saperi irrinunciabili</p><h2>Ciò che devi saper spiegare</h2><ol class="essentials-list">${s.essentials.map(x => `<li>${x}</li>`).join("")}</ol>`,
      vocabulary: () => `<p class="eyebrow">Vocabolario essenziale</p><h2>Parole per pensare</h2><dl class="vocabulary">${s.vocabulary.map(([t,d]) => `<div class="term"><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>`,
      map: () => `<p class="eyebrow">Mappa concettuale</p><h2>Il nesso visivo</h2><figure class="map-figure"><img src="${s.map}" alt="${s.mapAlt}" width="1400" height="900"><figcaption>${s.mapAlt}</figcaption></figure>`,
      quiz: () => renderQuizPanel(s.id, s.questions)
    };
    if (activeTab === "quiz") {
      els.panel.innerHTML = "";
      renderQuiz(els.panel, s.id, s.questions, null);
    } else {
      els.panel.innerHTML = renderers[activeTab]();
    }
  }

  function quizState(id, total) {
    if (!state.quizzes[id]) state.quizzes[id] = { correctStatus: Array(total).fill(false), attempts: [] };
    if (state.quizzes[id].correctStatus.length !== total) state.quizzes[id].correctStatus = Array(total).fill(false);
    return state.quizzes[id];
  }
  function renderQuiz(container, id, questions, subset) {
    const template = $("#quizTemplate").content.cloneNode(true);
    container.innerHTML = ""; container.appendChild(template);
    const root = $("[data-quiz]", container);
    root.dataset.quizId = id;
    const indexes = subset || questions.map((_, i) => i);
    root.dataset.indexes = indexes.join(",");
    const list = $(".quiz-questions", root);
    list.innerHTML = indexes.map((qi, displayIndex) => questionMarkup(questions[qi], qi, displayIndex)).join("");
    $$('input[type="radio"]', root).forEach(input => input.addEventListener("change", () => immediateFeedback(root, questions, input)));
    $(".submit-quiz", root).addEventListener("click", () => submitQuiz(root, id, questions, indexes, Boolean(subset)));
    const existing = quizState(id, questions.length);
    if (existing.attempts.length) {
      $(".quiz-warning", root).textContent = `Tentativi salvati: ${existing.attempts.length}. Una nuova consegna non li cancellerà.`;
    }
  }
  function questionMarkup(q, originalIndex, displayIndex) {
    const letters = ["A", "B", "C"];
    return `<article class="question-card" data-question="${originalIndex}">
      <fieldset><legend><span class="question-index">${displayIndex + 1}</span>${q.q}</legend>
      <div class="options">${q.options.map((opt, oi) => `<label class="option"><input type="radio" name="q-${originalIndex}" value="${oi}"><span class="option-letter">${letters[oi]}</span><span>${opt}</span></label>`).join("")}</div></fieldset>
      <p class="answer-feedback" aria-live="polite"></p></article>`;
  }
  function immediateFeedback(root, questions, input) {
    const card = input.closest(".question-card");
    const q = questions[Number(card.dataset.question)];
    const correct = Number(input.value) === q.correct;
    const feedback = $(".answer-feedback", card);
    feedback.className = `answer-feedback ${correct ? "correct" : "wrong"}`;
    feedback.textContent = `${correct ? "Corretta." : "Non corretta."} ${q.explanation}`;
  }
  function submitQuiz(root, id, questions, indexes, isRecovery) {
    const answers = indexes.map(i => {
      const chosen = $(`input[name="q-${i}"]:checked`, root);
      return chosen ? Number(chosen.value) : null;
    });
    const warning = $(".quiz-warning", root);
    if (answers.some(a => a === null)) { warning.textContent = "Rispondi a tutte le domande prima di consegnare."; return; }
    const qState = quizState(id, questions.length);
    indexes.forEach((qi, pos) => { qState.correctStatus[qi] = answers[pos] === questions[qi].correct; });
    const score = qState.correctStatus.filter(Boolean).length;
    const total = questions.length;
    const percentage = Math.round(score / total * 100);
    const vote = Math.max(1, Math.round(score / total * 10));
    const wrong = qState.correctStatus.map((ok, i) => ok ? -1 : i).filter(i => i >= 0);
    qState.attempts.push({ at: new Date().toISOString(), mode: isRecovery ? "recupero" : "completo", score, total, percentage, vote });
    saveState();
    showResults(root, id, questions, qState, wrong, score, total, percentage, vote);
    updateNav();
  }
  function showResults(root, id, questions, qState, wrong, score, total, percentage, vote) {
    const results = $(".quiz-results", root);
    results.hidden = false;
    results.innerHTML = `
      <p class="eyebrow">Risultato aggiornato</p><h3>${wrong.length ? "Hai alcuni nessi da riparare" : "Tutti i nessi sono saldi"}</h3>
      <div class="score-grid"><div class="score-box"><strong>${score}/${total}</strong><span>risposte</span></div><div class="score-box"><strong>${percentage}%</strong><span>percentuale</span></div><div class="score-box"><strong>${vote}/10</strong><span>voto</span></div></div>
      <p><small>Formula: voto = max(1, arrotonda(risposte corrette ÷ totale × 10)).</small></p>
      ${wrong.length ? `<h3>Errori e mini-lezioni di recupero</h3>${wrong.map(i => recoveryMarkup(questions[i], i)).join("")}<button class="primary-button retry-button" type="button">Rifai solo le ${wrong.length} ${wrong.length === 1 ? "domanda sbagliata" : "domande sbagliate"}</button>` : `<p><strong>Non risultano errori.</strong> Puoi comunque rileggere la lezione o conservare questo tentativo nello storico.</p>`}
      <details class="attempt-history"><summary>Storico dei tentativi (${qState.attempts.length})</summary><ol>${qState.attempts.map(a => `<li>${formatDate(a.at)} · ${a.mode} · ${a.score}/${a.total} · ${a.vote}/10</li>`).join("")}</ol></details>`;
    if (wrong.length) $(".retry-button", results).addEventListener("click", () => renderQuiz(root.closest(".content-card") || root.parentElement, id, questions, wrong));
    $$('a[href^="#"]', results).forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      const anchor = link.getAttribute("href").slice(1);
      const sectionIndex = DATA.findIndex(section => section.lesson.includes(`id="${anchor}"`));
      if (sectionIndex < 0) return;
      renderSection(sectionIndex, "lesson");
      requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function recoveryMarkup(q, index) {
    return `<article class="recovery-card"><h4>${index + 1}. ${q.recovery[0]}</h4><p><strong>Chiarimento:</strong> ${q.recovery[1]}</p><p><strong>Esempio dalla lezione:</strong> ${q.recovery[2]}</p><p><strong>Nuova domanda breve:</strong> In che modo l’esempio conferma il concetto appena chiarito?</p><a href="#${q.anchor}">Rileggi il passaggio collegato</a></article>`;
  }
  function formatDate(iso) { return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
  function openFinal() {
    document.documentElement.style.setProperty("--section-color", "#7d6639");
    renderQuiz($("#finalQuiz"), "final", window.FINAL_QUIZ.questions, null);
    showView(els.final);
  }
  function updateReadingProgress() {
    if (!els.lesson.classList.contains("active")) { els.readingBar.style.width = `${state.visited.length / DATA.length * 100}%`; return; }
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const local = scrollable > 0 ? root.scrollTop / scrollable : 0;
    els.readingBar.style.width = `${Math.min(100, ((activeSection + local) / DATA.length) * 100)}%`;
  }
  function resume() { renderSection(Math.min(state.lastSection || 0, DATA.length - 1)); }

  $("#menuButton").addEventListener("click", openDrawer);
  $("#closeMenu").addEventListener("click", closeDrawer);
  els.scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
  $("#startButton").addEventListener("click", () => renderSection(0));
  $("#coverResume").addEventListener("click", resume);
  $("#resumeButton").addEventListener("click", resume);
  $("#homeButton").addEventListener("click", () => showView(els.cover));
  $("#backToCover").addEventListener("click", () => showView(els.cover));
  $("#prevSection").addEventListener("click", () => { if (activeSection > 0) renderSection(activeSection - 1); });
  $("#nextSection").addEventListener("click", () => activeSection < DATA.length - 1 ? renderSection(activeSection + 1) : openFinal());
  $("#finalQuizButton").addEventListener("click", openFinal);
  $("#finalBack").addEventListener("click", () => renderSection(activeSection));
  $("#resetButton").addEventListener("click", () => {
    if (!confirm("Vuoi cancellare progressi, note e risultati dei test salvati su questo dispositivo?")) return;
    state = structuredClone(defaultState); saveState(); updateNav(); els.notes.value = ""; closeDrawer(); showView(els.cover);
  });
  els.notes.addEventListener("input", () => {
    clearTimeout(noteTimer); els.saveStatus.textContent = "Salvataggio…";
    noteTimer = setTimeout(() => { state.notes[DATA[activeSection].id] = els.notes.value; saveState(); els.saveStatus.textContent = "Salvato sul dispositivo"; }, 350);
  });
  window.addEventListener("scroll", updateReadingProgress, { passive: true });

  buildRoute(); updateNav(); updateReadingProgress();
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(err => console.warn("Service worker non registrato", err)));
})();
