(() => {
  "use strict";

  const STORAGE_KEY = "vittorini-pwa-state-v1";
  const sections = [...window.VITTORINI_CONTENT].sort((a, b) => Number(a.number) - Number(b.number));
  const defaultState = {
    completed: [],
    current: "home",
    notes: {},
    quizHistory: {},
    pendingErrors: {},
    font: "normal",
    focus: false
  };

  let state = loadState();
  let deferredInstallPrompt = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return { ...defaultState, ...saved };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateProgress();
  }

  function render() {
    const template = $("#lessonTemplate");
    const views = $("#lessonViews");
    const nav = $("#sectionNav");
    const route = $("#routeCards");

    sections.forEach((section, index) => {
      nav.appendChild(makeNavButton(section));
      route.appendChild(makeRouteButton(section));

      const fragment = template.content.cloneNode(true);
      const article = $(".lesson", fragment);
      article.id = section.id;
      article.dataset.view = section.id;
      $(".section-number", article).textContent = `Movimento ${section.number} di 06`;
      $(".section-title", article).textContent = section.title;
      $(".generative-question", article).textContent = section.question;
      $(".chapter-mark", article).textContent = section.number;

      renderLesson(section, $(".panel[data-panel='lesson']", article));
      renderSummary(section, $(".panel[data-panel='summary']", article));
      renderEssentials(section, $(".panel[data-panel='essentials']", article));
      renderGlossary(section, $(".panel[data-panel='glossary']", article));
      renderMap(section, $(".panel[data-panel='map']", article));
      renderQuiz(section, $(".panel[data-panel='quiz']", article));
      renderNotes(section, $(".panel[data-panel='notes']", article));

      const previous = $(".prev-button", article);
      const next = $(".next-button", article);
      previous.textContent = index === 0 ? "← Copertina" : `← ${sections[index - 1].shortTitle}`;
      next.textContent = index === sections.length - 1 ? "Torna alla copertina →" : `${sections[index + 1].shortTitle} →`;
      previous.addEventListener("click", () => showView(index === 0 ? "home" : sections[index - 1].id));
      next.addEventListener("click", () => showView(index === sections.length - 1 ? "home" : sections[index + 1].id));

      const complete = $(".complete-button", article);
      complete.addEventListener("click", () => toggleComplete(section.id));

      wireTabs(article);
      views.appendChild(fragment);
    });

    applyPreferences();
    refreshCompletionUI();
    updateProgress();
    wireGlobalEvents();

    const requested = location.hash.replace("#", "");
    showView(sections.some(section => section.id === requested) ? requested : "home", false);
  }

  function makeNavButton(section) {
    const button = document.createElement("button");
    button.className = "nav-link";
    button.dataset.target = section.id;
    button.innerHTML = `<span>${section.number}</span><span>${section.shortTitle}</span>`;
    button.addEventListener("click", () => showView(section.id));
    return button;
  }

  function makeRouteButton(section) {
    const button = document.createElement("button");
    button.className = "route-card";
    button.innerHTML = `<span>${section.number}</span><strong>${section.shortTitle}</strong>`;
    button.addEventListener("click", () => showView(section.id));
    return button;
  }

  function renderLesson(section, panel) {
    section.lesson.forEach((block, index) => {
      const heading = document.createElement("h2");
      heading.textContent = block.title;
      panel.appendChild(heading);
      block.paragraphs.forEach((text, paragraphIndex) => {
        const p = paragraph(text);
        if (index === 0 && paragraphIndex === 0) p.className = "lede";
        panel.appendChild(p);
      });
    });
    const bridge = document.createElement("div");
    bridge.className = "bridge";
    bridge.innerHTML = `<p class="eyebrow">Ponte al movimento successivo</p><p>${section.bridge}</p>`;
    panel.appendChild(bridge);
  }

  function paragraph(text) {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }

  function renderSummary(section, panel) {
    panel.innerHTML = `<div class="summary-card"><p class="eyebrow">In sintesi</p><h2>${section.shortTitle}</h2><p>${section.summary}</p></div>`;
  }

  function renderEssentials(section, panel) {
    const card = document.createElement("div");
    card.className = "essential-card";
    card.innerHTML = `<p class="eyebrow">Saperi irrinunciabili</p><h2>Devi saper spiegare…</h2>`;
    const list = document.createElement("ol");
    list.className = "essential-list";
    section.essentials.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    card.appendChild(list);
    panel.appendChild(card);
  }

  function renderGlossary(section, panel) {
    panel.innerHTML = `<p class="eyebrow">Vocabolario essenziale</p><h2>Parole che organizzano il pensiero</h2>`;
    const grid = document.createElement("dl");
    grid.className = "glossary-grid";
    section.glossary.forEach(([term, definition]) => {
      const card = document.createElement("div");
      card.className = "term-card";
      card.innerHTML = `<dt>${term}</dt><dd>${definition}</dd>`;
      grid.appendChild(card);
    });
    panel.appendChild(grid);
  }

  function renderMap(section, panel) {
    panel.innerHTML = `
      <p class="eyebrow">Mappa concettuale</p>
      <h2>Il nesso in un colpo d’occhio</h2>
      <figure class="map-frame">
        <img src="${section.map}" alt="${section.mapAlt}" loading="lazy">
        <figcaption>Le frecce nominano le relazioni: non indicano una successione automatica, ma un percorso interpretativo.</figcaption>
      </figure>`;
  }

  function renderQuiz(section, panel, indices = null, isRetry = false) {
    const questions = indices || section.quiz.map((_, index) => index);
    panel.replaceChildren();
    const intro = document.createElement("div");
    intro.className = "quiz-intro";
    intro.innerHTML = `
      <p class="eyebrow">${isRetry ? "Recupero mirato" : "Verifica della sezione"}</p>
      <h2>${isRetry ? "Riprova soltanto gli errori" : "Cinque domande, tre alternative"}</h2>
      <p>${isRetry ? "Il tentativo precedente resta nello storico." : "Ogni domanda controlla un nesso insegnato nella lezione."}</p>
      <p>Formula: <span class="formula">voto = max(1, arrotonda(corrette ÷ totale × 10))</span></p>`;
    panel.appendChild(intro);

    const form = document.createElement("form");
    form.className = "quiz-form";
    form.dataset.section = section.id;
    form.dataset.indices = JSON.stringify(questions);
    questions.forEach((questionIndex, order) => {
      const question = section.quiz[questionIndex];
      const fieldset = document.createElement("fieldset");
      fieldset.className = "question-card";
      fieldset.dataset.questionIndex = questionIndex;
      const legend = document.createElement("legend");
      legend.textContent = `${order + 1}. ${question.q}`;
      fieldset.appendChild(legend);
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q-${section.id}-${questionIndex}`;
        input.value = optionIndex;
        label.append(input, document.createTextNode(option));
        fieldset.appendChild(label);
      });
      form.appendChild(fieldset);
    });
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "primary-button quiz-submit";
    submit.textContent = isRetry ? "Correggi il recupero" : "Correggi la verifica";
    form.appendChild(submit);
    form.addEventListener("submit", event => gradeQuiz(event, section, questions, isRetry));
    panel.appendChild(form);
    renderHistory(section, panel);
  }

  function gradeQuiz(event, section, indices, isRetry) {
    event.preventDefault();
    const form = event.currentTarget;
    let correct = 0;
    const wrong = [];

    indices.forEach(questionIndex => {
      const question = section.quiz[questionIndex];
      const fieldset = $(`[data-question-index="${questionIndex}"]`, form);
      const selected = $(`input[name="q-${section.id}-${questionIndex}"]:checked`, fieldset);
      const answer = selected ? Number(selected.value) : -1;
      const isCorrect = answer === question.answer;
      if (isCorrect) correct += 1;
      else wrong.push(questionIndex);
      $$("input", fieldset).forEach(input => { input.disabled = true; });
      const feedback = document.createElement("p");
      feedback.className = `question-feedback ${isCorrect ? "correct" : "wrong"}`;
      feedback.textContent = `${isCorrect ? "Corretto." : `Da rivedere. La risposta corretta è ${String.fromCharCode(65 + question.answer)}.`} ${question.explanation}`;
      fieldset.appendChild(feedback);
    });

    const percentage = Math.round((correct / indices.length) * 100);
    const grade = Math.max(1, Math.round((correct / indices.length) * 10));
    const attempt = {
      date: new Date().toISOString(),
      type: isRetry ? "recupero" : "test",
      correct,
      total: indices.length,
      percentage,
      grade,
      wrong
    };
    state.quizHistory[section.id] = [...(state.quizHistory[section.id] || []), attempt];
    state.pendingErrors[section.id] = wrong;
    saveState();
    $(".quiz-submit", form).remove();
    showResult(section, form.parentElement, attempt);
  }

  function showResult(section, panel, attempt) {
    $$(".result-card, .recovery-area", panel).forEach(node => node.remove());
    const result = document.createElement("section");
    result.className = "result-card";
    result.innerHTML = `
      <p class="eyebrow">Risultato</p>
      <div class="result-score">${attempt.correct}/${attempt.total}</div>
      <h2>${attempt.percentage}% · voto ${attempt.grade}/10</h2>
      <p>${attempt.wrong.length ? `Hai ${attempt.wrong.length} nesso/i da riparare.` : "Hai riconosciuto tutti i nessi della sezione."}</p>`;
    panel.appendChild(result);

    if (attempt.wrong.length) {
      const area = document.createElement("div");
      area.className = "recovery-area";
      area.innerHTML = `<p class="eyebrow">Lezione di recupero</p><h2>Ripariamo soltanto ciò che non ha funzionato</h2>`;
      attempt.wrong.forEach(index => area.appendChild(makeRecoveryCard(section.quiz[index], index)));
      const retry = document.createElement("button");
      retry.className = "primary-button retry-button";
      retry.textContent = `Riprova le ${attempt.wrong.length} domande sbagliate`;
      retry.addEventListener("click", () => {
        renderQuiz(section, panel, attempt.wrong, true);
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      area.appendChild(retry);
      panel.appendChild(area);
    }
    renderHistory(section, panel);
  }

  function makeRecoveryCard(question, index) {
    const card = document.createElement("article");
    card.className = "recovery-card";
    card.dataset.recoveryFor = index;
    card.innerHTML = `
      <h3>${question.concept}</h3>
      <dl>
        <dt>Chiarimento</dt><dd>${question.clarification}</dd>
        <dt>Esempio dalla lezione</dt><dd>${question.example}</dd>
        <dt>Domanda ponte</dt><dd>${question.retry}</dd>
      </dl>`;
    return card;
  }

  function renderHistory(section, panel) {
    $(".history-block", panel)?.remove();
    const history = state.quizHistory[section.id] || [];
    if (!history.length) return;
    const block = document.createElement("section");
    block.className = "history-block";
    const list = history.map((attempt, index) => {
      const date = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(attempt.date));
      return `<li>Tentativo ${index + 1} · ${attempt.type} · ${attempt.correct}/${attempt.total} · voto ${attempt.grade}/10 · ${date}</li>`;
    }).join("");
    block.innerHTML = `<h3>Storico dei tentativi</h3><ol class="history-list">${list}</ol>`;
    panel.appendChild(block);
  }

  function renderNotes(section, panel) {
    panel.innerHTML = `
      <div class="notes-card">
        <p class="eyebrow">Taccuino personale</p>
        <h2>Appunti su ${section.shortTitle.toLowerCase()}</h2>
        <label for="notes-${section.id}">Scrivi domande, collegamenti o parole da ricordare</label>
        <textarea id="notes-${section.id}" placeholder="I tuoi appunti restano su questo dispositivo…"></textarea>
        <p class="save-status" role="status" aria-live="polite"></p>
      </div>`;
    const textarea = $("textarea", panel);
    textarea.value = state.notes[section.id] || "";
    const status = $(".save-status", panel);
    let timer;
    textarea.addEventListener("input", () => {
      clearTimeout(timer);
      status.textContent = "Salvataggio…";
      timer = setTimeout(() => {
        state.notes[section.id] = textarea.value;
        saveState();
        status.textContent = "Salvato in locale.";
      }, 350);
    });
  }

  function wireTabs(article) {
    const tabs = $$(".lesson-tabs [role='tab']", article);
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(item => item.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      $$(".panel", article).forEach(panel => { panel.hidden = panel.dataset.panel !== tab.dataset.panel; });
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }));
  }

  function showView(id, updateHash = true) {
    $$(".view").forEach(view => view.classList.toggle("active", view.dataset.view === id));
    state.current = id;
    saveState();
    if (updateHash) history.replaceState(null, "", `#${id}`);
    closePanels();
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#main").focus({ preventScroll: true });
  }

  function toggleComplete(id) {
    state.completed = state.completed.includes(id)
      ? state.completed.filter(item => item !== id)
      : [...state.completed, id];
    saveState();
    refreshCompletionUI();
  }

  function refreshCompletionUI() {
    sections.forEach(section => {
      const done = state.completed.includes(section.id);
      const article = $(`#${section.id}`);
      const button = $(".complete-button", article);
      button.classList.toggle("done", done);
      button.textContent = done ? "✓ Completata" : "Segna come completata";
      $(`.nav-link[data-target="${section.id}"]`)?.classList.toggle("complete", done);
    });
  }

  function updateProgress() {
    const percentage = Math.round((state.completed.length / sections.length) * 100);
    $("#progressBar").style.width = `${percentage}%`;
    $("#progressText").value = `${percentage}%`;
    $("#progressText").textContent = `${percentage}%`;
  }

  function wireGlobalEvents() {
    $("#startButton").addEventListener("click", () => showView(sections[0].id));
    $("#resumeButton").addEventListener("click", () => showView(state.current === "home" ? sections[0].id : state.current));
    $("#homeButton").addEventListener("click", () => showView("home"));
    $(".brand").addEventListener("click", event => { event.preventDefault(); showView("home"); });

    $("#menuButton").addEventListener("click", () => openPanel("sideNav"));
    $("#settingsButton").addEventListener("click", () => openPanel("toolsPanel"));
    $("#closeMenu").addEventListener("click", closePanels);
    $("#closeTools").addEventListener("click", closePanels);
    $("#backdrop").addEventListener("click", closePanels);

    $("#installButton").addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
      } else {
        $("#installDialog").showModal();
      }
    });
    $("#resetButton").addEventListener("click", () => $("#confirmDialog").showModal());
    $("#confirmReset").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = { ...defaultState };
      location.replace(location.pathname + "#home");
      location.reload();
    });

    $$(".segmented button").forEach(button => button.addEventListener("click", () => {
      state.font = button.dataset.font;
      saveState();
      applyPreferences();
    }));
    $("#focusToggle").addEventListener("change", event => {
      state.focus = event.target.checked;
      saveState();
      applyPreferences();
    });

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#installButton").textContent = "Installa l’app";
    });
    window.addEventListener("hashchange", () => {
      const id = location.hash.replace("#", "");
      if (id === "home" || sections.some(section => section.id === id)) showView(id, false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closePanels();
    });
  }

  function openPanel(id) {
    closePanels();
    $(`#${id}`).classList.add("open");
    $("#backdrop").classList.add("open");
    if (id === "sideNav") $("#menuButton").setAttribute("aria-expanded", "true");
  }

  function closePanels() {
    $("#sideNav").classList.remove("open");
    $("#toolsPanel").classList.remove("open");
    $("#backdrop").classList.remove("open");
    $("#menuButton").setAttribute("aria-expanded", "false");
  }

  function applyPreferences() {
    document.body.classList.remove("font-small", "font-normal", "font-large");
    document.body.classList.add(`font-${state.font}`);
    document.body.classList.toggle("focus-mode", Boolean(state.focus));
    $$(".segmented button").forEach(button => button.classList.toggle("active", button.dataset.font === state.font));
    $("#focusToggle").checked = Boolean(state.focus);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => {
      console.error("Service worker non registrato:", error);
    }));
  }

  render();
})();
