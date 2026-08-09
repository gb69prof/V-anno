(() => {
  "use strict";

  const STORAGE_KEY = "gbprof-morante-v1";
  const DATA = Array.isArray(window.LESSON_DATA) ? window.LESSON_DATA : [];
  const FINAL = window.FINAL_QUIZ && Array.isArray(window.FINAL_QUIZ.questions)
    ? window.FINAL_QUIZ.questions
    : [];
  const TABS = [
    ["lesson", "Lezione"],
    ["summary", "Sintesi"],
    ["essentials", "Saperi"],
    ["vocabulary", "Vocabolario"],
    ["map", "Mappa"],
    ["quiz", "Test"]
  ];
  const DEFAULT_STATE = { lastSection: 0, visited: [], notes: {}, quizzes: {} };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const els = {
    cover: $("#coverView"),
    lesson: $("#lessonView"),
    final: $("#finalView"),
    error: $("#errorView"),
    drawer: $("#drawer"),
    scrim: $("#scrim"),
    nav: $("#drawerNav"),
    route: $("#coverRoute"),
    tabs: $("#sectionTabs"),
    panel: $("#panelContent"),
    notes: $("#sectionNotes"),
    saveStatus: $("#saveStatus"),
    readingBar: $("#readingBar"),
    courseProgress: $("#courseProgress"),
    drawerProgressText: $("#drawerProgressText"),
    drawerProgressBar: $("#drawerProgressBar")
  };

  let state = loadState();
  let activeSection = clampSection(state.lastSection);
  let activeTab = "lesson";
  let noteTimer;
  let drawerReturnFocus = null;

  function cloneDefaultState() {
    return { lastSection: 0, visited: [], notes: {}, quizzes: {} };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        ...cloneDefaultState(),
        ...saved,
        visited: Array.isArray(saved.visited) ? saved.visited : [],
        notes: saved.notes && typeof saved.notes === "object" ? saved.notes : {},
        quizzes: saved.quizzes && typeof saved.quizzes === "object" ? saved.quizzes : {}
      };
    } catch (error) {
      console.warn("Dati locali non leggibili: riparto da uno stato vuoto.", error);
      return cloneDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      els.saveStatus.textContent = "Salvataggio locale non disponibile";
      console.warn("Impossibile salvare i dati locali.", error);
    }
  }

  function clampSection(index) {
    if (!DATA.length) return 0;
    const number = Number.isFinite(Number(index)) ? Number(index) : 0;
    return Math.max(0, Math.min(Math.trunc(number), DATA.length - 1));
  }

  function showView(view, focusTarget = "#main") {
    [els.cover, els.lesson, els.final, els.error].forEach(node => {
      if (node) node.classList.toggle("active", node === view);
    });
    closeDrawer(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    updateReadingProgress();
    requestAnimationFrame(() => $(focusTarget)?.focus({ preventScroll: true }));
  }

  function openDrawer() {
    drawerReturnFocus = document.activeElement;
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    $("#menuButton").setAttribute("aria-expanded", "true");
    els.scrim.hidden = false;
    document.body.classList.add("drawer-open");
    $("#closeMenu").focus();
  }

  function closeDrawer(restoreFocus = true) {
    if (!els.drawer.classList.contains("open")) return;
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    $("#menuButton").setAttribute("aria-expanded", "false");
    els.scrim.hidden = true;
    document.body.classList.remove("drawer-open");
    if (restoreFocus && drawerReturnFocus instanceof HTMLElement) drawerReturnFocus.focus();
  }

  function trapDrawerFocus(event) {
    if (event.key !== "Tab" || !els.drawer.classList.contains("open")) return;
    const focusable = $$('button:not([disabled]), a[href], textarea, input, [tabindex]:not([tabindex="-1"])', els.drawer)
      .filter(node => !node.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateCourseProgress() {
    const visited = new Set(state.visited.map(Number).filter(i => i >= 0 && i < DATA.length)).size;
    const percent = DATA.length ? Math.round((visited / DATA.length) * 100) : 0;
    els.courseProgress.textContent = `${visited} di ${DATA.length}`;
    els.courseProgress.setAttribute("aria-label", `${visited} sezioni visitate su ${DATA.length}`);
    els.drawerProgressText.textContent = `${percent}%`;
    els.drawerProgressBar.style.width = `${percent}%`;
  }

  function updateNav() {
    els.nav.innerHTML = DATA.map((section, index) => {
      const visited = state.visited.includes(index);
      return `
        <button type="button" data-section="${index}" class="${index === activeSection ? "active" : ""}" ${index === activeSection ? 'aria-current="page"' : ""}>
          <span class="nav-number">${section.number || String(index + 1).padStart(2, "0")}</span>
          <span>${section.title}</span>
          <span class="nav-check" aria-label="${visited ? "Sezione visitata" : "Sezione non ancora visitata"}">${visited ? "✓" : ""}</span>
        </button>`;
    }).join("");
    $$('[data-section]', els.nav).forEach(button => {
      button.addEventListener("click", () => renderSection(Number(button.dataset.section)));
    });
    updateCourseProgress();
  }

  function buildRoute() {
    els.route.innerHTML = DATA.map((section, index) => `
      <button class="route-step" data-route="${index}" type="button">
        <b>${section.number || String(index + 1).padStart(2, "0")}</b>
        <span>${section.title}</span>
      </button>`).join("");
    $$('[data-route]', els.route).forEach(button => {
      button.addEventListener("click", () => renderSection(Number(button.dataset.route)));
    });
  }

  function renderSection(index, tab = "lesson") {
    activeSection = clampSection(index);
    activeTab = TABS.some(([id]) => id === tab) ? tab : "lesson";
    const section = DATA[activeSection];
    state.lastSection = activeSection;
    if (!state.visited.includes(activeSection)) state.visited.push(activeSection);
    saveState();

    const color = section.color || "#9f1734";
    document.documentElement.style.setProperty("--section-color", color);
    $("#sectionNumber").textContent = `${section.number || String(activeSection + 1).padStart(2, "0")} / ${String(DATA.length).padStart(2, "0")}`;
    $("#sectionTitle").textContent = section.title;
    $("#sectionSubtitle").textContent = section.subtitle || "";
    $("#generativeQuestion").textContent = section.question || "";
    $("#sectionCounter").textContent = `${activeSection + 1} di ${DATA.length}`;
    $("#prevSection").disabled = activeSection === 0;
    $("#nextSection").textContent = activeSection === DATA.length - 1 ? "Verifica finale →" : "Successiva →";
    els.notes.value = state.notes[section.id] || "";
    els.saveStatus.textContent = "";

    renderTabs();
    renderPanel();
    updateNav();
    showView(els.lesson);
  }

  function renderTabs() {
    els.tabs.innerHTML = TABS.map(([id, label]) => `
      <button type="button" role="tab" id="tab-${id}" aria-controls="panelContent" aria-selected="${id === activeTab}" tabindex="${id === activeTab ? "0" : "-1"}" data-tab="${id}">${label}</button>`).join("");
    $$('[data-tab]', els.tabs).forEach(button => {
      button.addEventListener("click", () => selectTab(button.dataset.tab));
      button.addEventListener("keydown", handleTabKeys);
    });
  }

  function selectTab(tab) {
    activeTab = tab;
    renderTabs();
    renderPanel();
    requestAnimationFrame(() => $(`[data-tab="${tab}"]`, els.tabs)?.focus());
  }

  function handleTabKeys(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const ids = TABS.map(([id]) => id);
    let next = ids.indexOf(activeTab);
    if (event.key === "ArrowLeft") next = (next - 1 + ids.length) % ids.length;
    if (event.key === "ArrowRight") next = (next + 1) % ids.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ids.length - 1;
    selectTab(ids[next]);
  }

  function renderPanel() {
    const section = DATA[activeSection];
    els.panel.setAttribute("role", "tabpanel");
    els.panel.setAttribute("aria-labelledby", `tab-${activeTab}`);
    els.panel.setAttribute("tabindex", "0");

    if (activeTab === "quiz") {
      renderQuiz(els.panel, section.id, section.questions || [], null);
      return;
    }

    const renderers = {
      lesson: () => `<p class="kicker">Lezione estesa</p><h2>${section.subtitle || section.title}</h2>${section.lesson || ""}`,
      summary: () => `<p class="kicker">Sintesi</p><h2>Il movimento in breve</h2><div class="summary-panel">${section.summary || ""}</div>`,
      essentials: () => `<p class="kicker">Saperi irrinunciabili</p><h2>Ciò che devi saper spiegare</h2><ol class="essentials-list">${(section.essentials || []).map(item => `<li>${item}</li>`).join("")}</ol>`,
      vocabulary: () => `<p class="kicker">Vocabolario essenziale</p><h2>Parole per leggere Morante</h2><dl class="vocabulary">${(section.vocabulary || []).map(([term, definition]) => `<div class="term"><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl>`,
      map: () => `<p class="kicker">Mappa concettuale</p><h2>Il nesso visivo</h2><figure class="map-figure"><img src="${section.map}" alt="${section.mapAlt || "Mappa concettuale della sezione"}" width="1400" height="900" loading="lazy"><figcaption>${section.mapAlt || "Mappa concettuale della sezione."}</figcaption></figure>`
    };
    els.panel.innerHTML = renderers[activeTab]();
  }

  function quizState(id, total) {
    if (!state.quizzes[id] || typeof state.quizzes[id] !== "object") {
      state.quizzes[id] = { correctStatus: Array(total).fill(false), attempts: [] };
    }
    const record = state.quizzes[id];
    if (!Array.isArray(record.correctStatus) || record.correctStatus.length !== total) record.correctStatus = Array(total).fill(false);
    if (!Array.isArray(record.attempts)) record.attempts = [];
    return record;
  }

  function renderQuiz(container, id, questions, subset = null) {
    container.innerHTML = "";
    if (!questions.length) {
      container.innerHTML = '<p role="alert">Il test di questa sezione non è ancora disponibile.</p>';
      return;
    }
    container.appendChild($("#quizTemplate").content.cloneNode(true));
    const root = $("[data-quiz]", container);
    const indexes = Array.isArray(subset) ? subset : questions.map((_, index) => index);
    root.dataset.quizId = id;
    root.dataset.indexes = indexes.join(",");
    $(".quiz-questions", root).innerHTML = indexes.map((questionIndex, displayIndex) =>
      questionMarkup(questions[questionIndex], questionIndex, displayIndex)
    ).join("");

    $$('input[type="radio"]', root).forEach(input => {
      input.addEventListener("change", () => immediateFeedback(root, questions, input));
    });
    $(".submit-quiz", root).addEventListener("click", () => submitQuiz(root, id, questions, indexes, Array.isArray(subset)));

    const existing = quizState(id, questions.length);
    if (existing.attempts.length) {
      $(".quiz-warning", root).textContent = `Tentativi già salvati: ${existing.attempts.length}. La nuova consegna sarà aggiunta allo storico.`;
    }
  }

  function questionMarkup(question, originalIndex, displayIndex) {
    const letters = ["A", "B", "C"];
    const options = Array.isArray(question.options) ? question.options.slice(0, 3) : [];
    return `<article class="question-card" data-question="${originalIndex}">
      <fieldset>
        <legend><span class="question-index">${displayIndex + 1}</span>${question.q}</legend>
        <div class="options">${options.map((option, optionIndex) => `
          <label class="option">
            <input type="radio" name="q-${originalIndex}" value="${optionIndex}">
            <span class="option-letter" aria-hidden="true">${letters[optionIndex]}</span>
            <span>${option}</span>
          </label>`).join("")}</div>
      </fieldset>
      <p class="answer-feedback" aria-live="polite"></p>
    </article>`;
  }

  function immediateFeedback(root, questions, input) {
    const card = input.closest(".question-card");
    const question = questions[Number(card.dataset.question)];
    const correct = Number(input.value) === Number(question.correct);
    const feedback = $(".answer-feedback", card);
    feedback.className = `answer-feedback ${correct ? "correct" : "wrong"}`;
    feedback.innerHTML = `<strong>${correct ? "Corretta." : "Non corretta."}</strong> ${question.explanation || "Rivedi il concetto nella lezione."}`;
  }

  function submitQuiz(root, id, questions, indexes, isRecovery) {
    const answers = indexes.map(index => {
      const chosen = $(`input[name="q-${index}"]:checked`, root);
      return chosen ? Number(chosen.value) : null;
    });
    const warning = $(".quiz-warning", root);
    if (answers.some(answer => answer === null)) {
      warning.textContent = "Rispondi a tutte le domande prima di consegnare.";
      const unanswered = $$(".question-card", root).find(card => !$("input:checked", card));
      $("input", unanswered || root)?.focus();
      return;
    }

    const record = quizState(id, questions.length);
    indexes.forEach((questionIndex, position) => {
      record.correctStatus[questionIndex] = answers[position] === Number(questions[questionIndex].correct);
    });
    const score = record.correctStatus.filter(Boolean).length;
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const vote = Math.max(1, Math.round((score / total) * 10));
    const wrong = record.correctStatus
      .map((isCorrect, index) => isCorrect ? -1 : index)
      .filter(index => index >= 0);

    record.attempts.push({
      at: new Date().toISOString(),
      mode: isRecovery ? "recupero" : "test completo",
      score,
      total,
      percentage,
      vote
    });
    saveState();
    showResults(root, id, questions, record, wrong, score, total, percentage, vote);
    updateNav();
  }

  function showResults(root, id, questions, record, wrong, score, total, percentage, vote) {
    const results = $(".quiz-results", root);
    results.hidden = false;
    results.innerHTML = `
      <p class="kicker">Risultato aggiornato</p>
      <h3>${wrong.length ? "Ci sono nessi da ricostruire" : "La traiettoria è salda"}</h3>
      <div class="score-grid" aria-label="Risultato del test">
        <div class="score-box"><strong>${score}/${total}</strong><span>risposte corrette</span></div>
        <div class="score-box"><strong>${percentage}%</strong><span>percentuale</span></div>
        <div class="score-box"><strong>${vote}/10</strong><span>voto</span></div>
      </div>
      <p class="formula"><small>Formula: voto = massimo tra 1 e l’arrotondamento di (risposte corrette ÷ domande × 10).</small></p>
      ${wrong.length
        ? `<h3>Errori e mini-lezioni di recupero</h3>${wrong.map(index => recoveryMarkup(questions[index], index)).join("")}<button class="primary-button retry-button" type="button">Rifai solo ${wrong.length === 1 ? "la domanda sbagliata" : `le ${wrong.length} domande sbagliate`}</button>`
        : '<p class="all-correct"><strong>Nessun errore.</strong> Il tentativo resta nello storico; puoi tornare alla lezione per consolidare i passaggi.</p>'}
      <details class="attempt-history">
        <summary>Storico dei tentativi (${record.attempts.length})</summary>
        <ol>${record.attempts.slice().reverse().map(attempt => `<li><time datetime="${attempt.at}">${formatDate(attempt.at)}</time> · ${attempt.mode} · ${attempt.score}/${attempt.total} · ${attempt.vote}/10</li>`).join("")}</ol>
      </details>`;

    if (wrong.length) {
      $(".retry-button", results).addEventListener("click", () => {
        const container = root.closest(".content-card") || root.parentElement;
        renderQuiz(container, id, questions, wrong);
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    $$('a[href^="#"]', results).forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      const anchor = link.getAttribute("href").slice(1);
      const sectionIndex = DATA.findIndex(section => String(section.lesson || "").includes(`id="${anchor}"`));
      if (sectionIndex < 0) return;
      renderSection(sectionIndex, "lesson");
      requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function recoveryMarkup(question, index) {
    const recovery = Array.isArray(question.recovery) ? question.recovery : [];
    const anchor = question.anchor || "main";
    return `<article class="recovery-card">
      <h4>${index + 1}. ${recovery[0] || "Riprendi il concetto centrale"}</h4>
      <p><strong>Chiarimento:</strong> ${recovery[1] || question.explanation || "Rileggi il passaggio indicato."}</p>
      <p><strong>Esempio dalla lezione:</strong> ${recovery[2] || "Collega il concetto a uno degli esempi discussi nella sezione."}</p>
      <p><strong>Nuova domanda breve:</strong> ${recovery[3] || "Quale nesso unisce questo esempio al concetto appena chiarito?"}</p>
      <a href="#${anchor}">Rileggi il passaggio collegato</a>
    </article>`;
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit"
      }).format(new Date(iso));
    } catch {
      return "data non disponibile";
    }
  }

  function openFinal() {
    if (!FINAL.length) {
      alert("La verifica finale non è ancora disponibile.");
      return;
    }
    document.documentElement.style.setProperty("--section-color", "#9f1734");
    renderQuiz($("#finalQuiz"), "final", FINAL, null);
    showView(els.final, "#finalTitle");
  }

  function updateReadingProgress() {
    if (!DATA.length) return;
    if (!els.lesson.classList.contains("active")) {
      const visited = new Set(state.visited).size;
      els.readingBar.style.width = `${Math.min(100, (visited / DATA.length) * 100)}%`;
      return;
    }
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const localProgress = scrollable > 0 ? root.scrollTop / scrollable : 0;
    els.readingBar.style.width = `${Math.min(100, ((activeSection + localProgress) / DATA.length) * 100)}%`;
  }

  function resume() {
    renderSection(clampSection(state.lastSection));
  }

  function resetData() {
    const confirmed = window.confirm("Vuoi cancellare definitivamente progressi, note, risultati e storico dei test salvati su questo dispositivo?");
    if (!confirmed) return;
    state = cloneDefaultState();
    saveState();
    activeSection = 0;
    activeTab = "lesson";
    els.notes.value = "";
    updateNav();
    closeDrawer(false);
    showView(els.cover, "#coverTitle");
  }

  function showContentError(message) {
    $("#errorMessage").textContent = message;
    showView(els.error, "#errorTitle");
  }

  function bindEvents() {
    $("#menuButton").addEventListener("click", openDrawer);
    $("#closeMenu").addEventListener("click", () => closeDrawer(true));
    els.scrim.addEventListener("click", () => closeDrawer(true));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeDrawer(true);
      trapDrawerFocus(event);
    });
    $("#startButton").addEventListener("click", () => renderSection(0));
    $("#coverResume").addEventListener("click", resume);
    $("#resumeButton").addEventListener("click", resume);
    $("#homeButton").addEventListener("click", () => showView(els.cover, "#coverTitle"));
    $("#backToCover").addEventListener("click", () => showView(els.cover, "#coverTitle"));
    $("#prevSection").addEventListener("click", () => {
      if (activeSection > 0) renderSection(activeSection - 1);
    });
    $("#nextSection").addEventListener("click", () => {
      if (activeSection < DATA.length - 1) renderSection(activeSection + 1);
      else openFinal();
    });
    $("#finalQuizButton").addEventListener("click", openFinal);
    $("#finalBack").addEventListener("click", () => renderSection(activeSection));
    $("#resetButton").addEventListener("click", resetData);
    els.notes.addEventListener("input", () => {
      clearTimeout(noteTimer);
      els.saveStatus.textContent = "Salvataggio…";
      noteTimer = setTimeout(() => {
        state.notes[DATA[activeSection].id] = els.notes.value;
        saveState();
        els.saveStatus.textContent = "Nota salvata sul dispositivo";
      }, 350);
    });
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
  }

  function init() {
    bindEvents();
    if (DATA.length !== 6) {
      showContentError(`Il percorso richiede esattamente sei sezioni; ne sono state trovate ${DATA.length}.`);
      return;
    }
    buildRoute();
    updateNav();
    updateReadingProgress();
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
          .catch(error => console.warn("Service worker non registrato.", error));
      });
    }
  }

  init();
})();
