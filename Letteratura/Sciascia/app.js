(() => {
  "use strict";
  const STORAGE_KEY = "gbprof-sciascia-v1";
  const defaultState = { lastRoute: "mondo/lezione", visited: [], completed: [], notes: "", tests: {}, recoveryNotes: {} };
  let state = loadState();

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const views = { home: $("#homeView"), section: $("#sectionView"), finale: $("#finalView"), fonti: $("#sourcesView") };
  const tabs = [
    ["lezione", "Lezione"], ["sintesi", "Sintesi"], ["saperi", "Saperi"],
    ["vocabolario", "Vocabolario"], ["mappa", "Mappa"], ["test", "Test"]
  ];

  function loadState() {
    try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return { ...defaultState }; }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateProgress(); }
  function escapeHTML(value = "") { return value.replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function showView(name) { Object.entries(views).forEach(([key, view]) => view.hidden = key !== name); }
  function setRoute(route) { location.hash = route; }

  function buildNavigation() {
    $("#navList").innerHTML = SCIASCIA_SECTIONS.map(s => `<li><button data-route="${s.id}/lezione"><b>${s.number}</b><span>${s.title}</span></button></li>`).join("");
    $("#homeIndex").innerHTML = SCIASCIA_SECTIONS.map(s => `<button data-route="${s.id}/lezione"><b>${s.number}</b><span>${s.title.replace("Le ", "").replace("Il ", "L’")}</span></button>`).join("");
  }

  function openMenu(open = true) {
    $("#sideNav").classList.toggle("open", open);
    $("#sideNav").setAttribute("aria-hidden", String(!open));
    $("#menuButton").setAttribute("aria-expanded", String(open));
    $("#scrim").hidden = !open;
    if (open) $("#closeMenu").focus();
  }
  function openNotes(open = true) {
    $("#notesPanel").classList.toggle("open", open);
    $("#notesPanel").setAttribute("aria-hidden", String(!open));
    $("#scrim").hidden = !open;
    if (open) { $("#notesArea").value = state.notes || ""; $("#closeNotes").focus(); }
  }

  function renderSection(section, activeTab = "lezione") {
    showView("section");
    if (!tabs.some(([id]) => id === activeTab)) activeTab = "lezione";
    if (!state.visited.includes(section.id)) state.visited.push(section.id);
    state.lastRoute = `${section.id}/${activeTab}`;
    saveState();
    $("#sectionView").innerHTML = `
      <header class="section-hero" data-number="${section.number}">
        <div class="section-hero-inner"><p class="section-kicker">MOVIMENTO ${section.number} · LEONARDO SCIASCIA</p>
        <h1>${section.title}</h1><p class="lead">${section.subtitle}</p><blockquote>${section.question}</blockquote></div>
      </header>
      <nav class="tabbar" aria-label="Materiali della sezione">${tabs.map(([id,label]) => `<button data-tab="${id}" class="${id===activeTab?"active":""}" aria-current="${id===activeTab?"page":"false"}">${label}</button>`).join("")}</nav>
      <div class="section-body" id="tabContent"></div>`;
    renderTab(section, activeTab);
    updateCurrentNavigation(section.id);
    window.scrollTo(0, 0);
  }

  function renderTab(section, tab) {
    const target = $("#tabContent");
    $$("[data-tab]").forEach(btn => {
      const active = btn.dataset.tab === tab; btn.classList.toggle("active", active); btn.setAttribute("aria-current", active ? "page" : "false");
    });
    if (tab === "lezione") {
      target.innerHTML = `<div class="lesson-layout"><article class="lesson-copy">${section.lesson.map(part => `<section id="${part.id}"><h2>${part.heading}</h2><p>${part.text}</p></section>`).join("")}</article><aside class="lesson-aside"><p class="panel-label">FILO DEL RAGIONAMENTO</p><ol>${section.lesson.map(part => `<li><a href="#${section.id}/lezione/${part.id}" data-anchor="${part.id}">${part.heading}</a></li>`).join("")}</ol><div class="section-actions"><button class="secondary" data-tab-jump="sintesi">Vai alla sintesi</button></div></aside></div>`;
    } else if (tab === "sintesi") {
      target.innerHTML = `<article class="content-panel"><p class="panel-label">IN 150 PAROLE</p><h2>La tesi e i suoi nessi</h2><p>${section.summary}</p><button class="primary" data-tab-jump="saperi">Che cosa deve restare →</button></article>`;
    } else if (tab === "saperi") {
      target.innerHTML = `<article class="content-panel"><p class="panel-label">SAPERI IRRINUNCIABILI</p><h2>Devi saper spiegare…</h2><ul class="essential-list">${section.essentials.map(item => `<li>${item}</li>`).join("")}</ul></article>`;
    } else if (tab === "vocabolario") {
      target.innerHTML = `<article class="content-panel"><p class="panel-label">LESSICO DI PRECISIONE</p><h2>Parole che fanno pensare</h2><dl class="vocab-grid">${section.vocab.map(([term,definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl></article>`;
    } else if (tab === "mappa") {
      target.innerHTML = `<article class="content-panel"><p class="panel-label">MAPPA CONCETTUALE</p><h2>Il nesso in una sola immagine</h2><figure class="map-frame"><img src="${section.map}" alt="${section.mapAlt}"><figcaption>${section.mapAlt}</figcaption></figure></article>`;
    } else if (tab === "test") {
      target.innerHTML = `<article class="content-panel"><p class="panel-label">VERIFICA FORMATIVA</p><h2>Controlla i nessi, non la memoria cieca</h2><p class="quiz-intro">Cinque domande, tre opzioni e una sola corretta. Ricevi subito un riscontro. Al termine: <strong>voto = max(1, arrotonda(percentuale × 10))</strong>. Il recupero riguarda soltanto gli errori.</p><div id="quizMount"></div></article>`;
      renderQuiz($("#quizMount"), section.id, section.questions);
    }
    target.querySelectorAll("[data-tab-jump]").forEach(btn => btn.addEventListener("click", () => setRoute(`${section.id}/${btn.dataset.tabJump}`)));
    target.querySelectorAll("[data-anchor]").forEach(a => a.addEventListener("click", event => { event.preventDefault(); document.getElementById(a.dataset.anchor)?.scrollIntoView({behavior:"smooth"}); }));
  }

  function renderQuiz(mount, key, questions, onlyIndices = null) {
    const indices = onlyIndices || questions.map((_, index) => index);
    const testState = state.tests[key] || { attempts: [], lastWrong: [], answers: {} };
    mount.innerHTML = `<form class="quiz-form" novalidate>${indices.map(index => questionHTML(questions[index], index, testState.answers[index])).join("")}<button class="primary submit-quiz" type="submit">Calcola risultato</button><p class="status quiz-status" role="status"></p></form><div class="quizResult" aria-live="polite"></div>${attemptHistory(testState.attempts)}`;
    const form = mount.querySelector("form");
    form.querySelectorAll("input[type=radio]").forEach(input => input.addEventListener("change", () => {
      const index = Number(input.name.replace("q-", ""));
      testState.answers[index] = Number(input.value);
      state.tests[key] = testState; saveState();
      const q = questions[index];
      const feedback = form.querySelector(`[data-feedback="${index}"]`);
      const correct = Number(input.value) === q.correct;
      feedback.className = `inline-feedback ${correct ? "correct" : "incorrect"}`;
      feedback.textContent = `${correct ? "Corretto." : "Non ancora."} ${q.feedback}`;
      feedback.hidden = false;
    }));
    form.addEventListener("submit", event => {
      event.preventDefault();
      const unanswered = indices.filter(index => testState.answers[index] === undefined);
      if (unanswered.length) { form.querySelector(".quiz-status").textContent = `Rispondi ancora a ${unanswered.length} ${unanswered.length===1?"domanda":"domande"}.`; return; }
      const wrong = indices.filter(index => testState.answers[index] !== questions[index].correct);
      const correctCount = indices.length - wrong.length;
      const percent = Math.round(correctCount / indices.length * 100);
      const grade = Math.max(1, Math.round(percent / 10));
      const attempt = { at: new Date().toISOString(), correct: correctCount, total: indices.length, percent, grade, wrong, mode: onlyIndices ? "recupero" : "completo" };
      testState.attempts.push(attempt); testState.lastWrong = wrong; state.tests[key] = testState;
      if (!wrong.length && key !== "finale" && !state.completed.includes(key)) state.completed.push(key);
      saveState();
      renderResult(mount.querySelector(".quizResult"), key, questions, attempt, mount);
      const oldHistory = mount.querySelector(".attempts"); if (oldHistory) oldHistory.outerHTML = attemptHistory(testState.attempts);
      mount.querySelector(".quizResult").scrollIntoView({behavior:"smooth", block:"start"});
    });
  }

  function questionHTML(q, index, selected) {
    return `<fieldset class="question-card"><legend>${index + 1}. ${q.stem}</legend>${q.options.map((option, optionIndex) => `<label class="option"><input type="radio" name="q-${index}" value="${optionIndex}" ${selected===optionIndex?"checked":""}><span><b>${String.fromCharCode(65+optionIndex)}.</b> ${option}</span></label>`).join("")}<p class="inline-feedback" data-feedback="${index}" hidden></p></fieldset>`;
  }

  function renderResult(box, key, questions, attempt, mount) {
    const wrongItems = attempt.wrong.map(index => `<li><strong>Domanda ${index + 1}:</strong> ${questions[index].stem}</li>`).join("");
    box.innerHTML = `<section class="result"><h3>Risultato del ${attempt.mode}</h3><div class="score-big">${attempt.grade}/10</div><p>${attempt.correct}/${attempt.total} corrette · ${attempt.percent}%</p>${attempt.wrong.length ? `<p>Errori da riparare:</p><ul class="error-list">${wrongItems}</ul>` : `<p><strong>Tutti i nessi sono solidi.</strong> La sezione è completata.</p>`}</section>${attempt.wrong.length ? `<section><p class="panel-label">RECUPERO MIRATO</p><h3>Una mini-lezione per ogni errore</h3><div class="recovery-grid">${attempt.wrong.map(index => recoveryHTML(key, questions[index], index)).join("")}</div><button class="primary retry-wrong">Rifai soltanto le domande sbagliate</button></section>` : ""}`;
    box.querySelectorAll("[data-recovery-note]").forEach(area => area.addEventListener("input", () => { state.recoveryNotes[area.dataset.recoveryNote] = area.value; saveState(); }));
    box.querySelectorAll("[data-lesson-anchor]").forEach(link => link.addEventListener("click", event => {
      event.preventDefault(); setRoute(`${link.dataset.lessonSection}/lezione`); setTimeout(() => document.getElementById(link.dataset.lessonAnchor)?.scrollIntoView(), 80);
    }));
    box.querySelector(".retry-wrong")?.addEventListener("click", () => renderQuiz(mount, key, questions, attempt.wrong));
  }

  function recoveryHTML(key, q, index) {
    const [concept, clarification, example, anchor] = q.recovery;
    const noteKey = `${key}-${index}`;
    const section = SCIASCIA_SECTIONS.find(item => item.lesson.some(part => part.id === anchor));
    const sectionId = section ? section.id : key;
    return `<article class="recovery-card"><h4>${concept}</h4><p><strong>Chiarimento.</strong> ${clarification}</p><p><strong>Esempio.</strong> ${example}</p><p><a href="#${sectionId}/lezione/${anchor}" data-lesson-section="${sectionId}" data-lesson-anchor="${anchor}">Rileggi il passaggio mirato →</a></p><label for="recovery-${noteKey}"><strong>Domanda-lampo:</strong> spiega con parole tue perché questo nesso è importante.</label><textarea id="recovery-${noteKey}" data-recovery-note="${noteKey}">${escapeHTML(state.recoveryNotes[noteKey] || "")}</textarea></article>`;
  }

  function attemptHistory(attempts = []) {
    if (!attempts.length) return "";
    return `<div class="attempts"><strong>Tentativi conservati:</strong> ${attempts.map((a,i) => `${i+1}) ${a.grade}/10 · ${a.percent}% · ${a.mode}`).join(" — ")}</div>`;
  }

  function renderFinal() {
    showView("finale"); state.lastRoute = "finale"; saveState(); updateCurrentNavigation("");
    views.finale.innerHTML = `<p class="eyebrow">VERIFICA FINALE FACOLTATIVA</p><h1>Sei nessi,<br><em>un solo percorso</em></h1><p class="lead" style="color:var(--muted)">Una domanda per ogni movimento. Non misura un catalogo di dati: controlla se sai ricostruire la traiettoria dal mondo ricevuto all’eredità civile.</p><div class="content-panel"><div id="finalQuizMount"></div></div>`;
    renderQuiz($("#finalQuizMount"), "finale", SCIASCIA_FINAL_TEST);
    window.scrollTo(0,0);
  }

  function renderSources() {
    showView("fonti"); state.lastRoute = "fonti"; saveState(); updateCurrentNavigation("");
    views.fonti.innerHTML = `<p class="eyebrow">CURATELA E TRASPARENZA</p><h1>Fonti<br><em>universitarie</em></h1><div class="source-note"><strong>Criterio.</strong> Tutte le fonti documentarie usate sono ospitate da università italiane. La PWA distingue dati verificabili e letture critiche; evita di derivare automaticamente le opere dalla biografia. I contenuti restano disponibili offline, mentre i collegamenti qui sotto richiedono rete.</div><h2>Bibliografia essenziale</h2><ul class="source-list">${SCIASCIA_SOURCES.map(source => `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></li>`).join("")}</ul><h2>Asse interpretativo</h2><p>Sciascia è presentato come scrittore dell’indagine sulla verità quando il potere ne interrompe la trasformazione in giustizia. La mafia è un laboratorio decisivo di questo problema, non un’etichetta capace di esaurire l’autore.</p><h2>Formula della valutazione</h2><p><code>voto = max(1, arrotonda(percentuale × 10))</code>. Ogni tentativo viene conservato sul dispositivo; il recupero mostra soltanto gli errori e consente di rifare solo quelli.</p>`;
    window.scrollTo(0,0);
  }

  function route() {
    openMenu(false); openNotes(false);
    const clean = (location.hash || "#home").slice(1);
    if (clean === "home") { showView("home"); updateCurrentNavigation(""); window.scrollTo(0,0); return; }
    if (clean === "finale") { renderFinal(); return; }
    if (clean === "fonti") { renderSources(); return; }
    const [sectionId, tab = "lezione", anchor] = clean.split("/");
    const section = SCIASCIA_SECTIONS.find(s => s.id === sectionId);
    if (!section) { setRoute("home"); return; }
    renderSection(section, tab);
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView(), 80);
  }

  function updateCurrentNavigation(id) {
    $$("#navList button").forEach(btn => btn.classList.toggle("current", btn.dataset.route?.startsWith(id + "/")));
  }
  function updateProgress() {
    const visitedWeight = state.visited.length / SCIASCIA_SECTIONS.length * 60;
    const completeWeight = state.completed.length / SCIASCIA_SECTIONS.length * 40;
    $("#progressBar").style.width = `${Math.min(100, visitedWeight + completeWeight)}%`;
  }

  function resetAll() {
    if (!confirm("Vuoi cancellare note, progressi, risultati e tentativi di recupero su questo dispositivo?")) return;
    localStorage.removeItem(STORAGE_KEY); state = { ...defaultState, visited: [], completed: [], tests: {}, recoveryNotes: {} }; openMenu(false); setRoute("home"); updateProgress();
  }

  function exportNotes() {
    const content = `Leonardo Sciascia — note personali\n\n${$("#notesArea").value}\n`;
    const blob = new Blob([content], {type:"text/plain;charset=utf-8"}); const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "note-sciascia.txt"; link.click(); URL.revokeObjectURL(url);
  }

  document.addEventListener("click", event => {
    const routeButton = event.target.closest("[data-route]"); if (routeButton) setRoute(routeButton.dataset.route);
    const tabButton = event.target.closest("[data-tab]"); if (tabButton) { const current = location.hash.slice(1).split("/")[0]; setRoute(`${current}/${tabButton.dataset.tab}`); }
  });
  $("#menuButton").addEventListener("click", () => openMenu(true));
  $("#closeMenu").addEventListener("click", () => openMenu(false));
  $("#notesButton").addEventListener("click", () => openNotes(true));
  $("#closeNotes").addEventListener("click", () => openNotes(false));
  $("#scrim").addEventListener("click", () => { openMenu(false); openNotes(false); });
  $("#resumeButton").addEventListener("click", () => setRoute(state.lastRoute || "mondo/lezione"));
  $("#homeResume").addEventListener("click", () => setRoute(state.lastRoute || "mondo/lezione"));
  $("#resetButton").addEventListener("click", resetAll);
  $("#saveNotes").addEventListener("click", () => { state.notes = $("#notesArea").value; saveState(); $("#notesStatus").textContent = "Note salvate su questo dispositivo."; });
  $("#exportNotes").addEventListener("click", exportNotes);
  document.addEventListener("keydown", event => { if (event.key === "Escape") { openMenu(false); openNotes(false); } });
  window.addEventListener("hashchange", route);
  buildNavigation(); updateProgress(); route();

  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Service worker non registrato", error)));
})();
