(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const storageKey = name => `dannunzio-study-v3-${name}`;
  const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const normalize = value => String(value).toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const safeGet = (name, fallback = null) => {
    try {
      const stored = localStorage.getItem(storageKey(name));
      return stored === null ? fallback : JSON.parse(stored);
    } catch {
      return fallback;
    }
  };

  const safeSet = (name, value) => {
    try {
      localStorage.setItem(storageKey(name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const lessons = window.DANNUNZIO_LESSONS || [];
  const lessonById = new Map(lessons.map(item => [item.id, item]));
  const quizBank = window.DANNUNZIO_QUIZZES || {};
  const movementOrder = ["mondo", "fratture", "immagine", "poetica", "opere", "conclusione"];

  const conclusionLesson = {
    id:"16",
    title:"Conclusione: una modernità controversa",
    section:"conclusione",
    html:`
      <p class="lead">D’Annunzio non è una sola formula. È il luogo in cui arte, mercato, vita privata, propaganda e politica imparano a usare la stessa macchina: la costruzione dell’immagine.</p>
      <h4>La grandezza</h4>
      <p>La sua lingua rinnova il repertorio poetico italiano attraverso musicalità, analogia, varietà metrica e precisione sensoriale. In <cite>Alcyone</cite> l’artificio raggiunge una naturalezza apparente: la parola si fa pioggia, fruscio, attesa, metamorfosi. Il poeta comprende inoltre con anticipo che l’autore moderno non vive soltanto nei libri, ma nella stampa, nella fotografia, nell’evento e nel racconto pubblico di sé.</p>
      <h4>Il limite</h4>
      <p>La centralità dell’individuo eccezionale può trasformare l’altro in materia: accade nelle relazioni di Andrea Sperelli e, sul piano collettivo, nell’idea di una massa destinata a essere guidata. Nazionalismo, culto dell’azione e linguaggio del comando non sono incidenti separabili a piacere dall’opera; appartengono alle contraddizioni storiche del personaggio.</p>
      <h4>La modernità controversa</h4>
      <p>D’Annunzio anticipa la società dello spettacolo senza esserne un semplice profeta positivo. Mostra insieme la potenza e il costo dell’auto-rappresentazione: la vita trasformata in opera acquista un’enorme efficacia pubblica, ma rischia di perdere verità, reciprocità e limite. Per questo continua a essere utile: non offre un modello da imitare, ma un caso straordinariamente lucido da comprendere.</p>`,
    summary:"Dal mondo di massa alla costruzione dell’esteta, dalla sua crisi al superuomo, dalla parola musicale alle opere: il percorso mostra una continuità nella ricerca di eccezionalità. La grandezza formale convive con limiti ideologici e relazionali che una lettura storica non deve cancellare.",
    essentials:[
      "Il percorso dannunziano collega società di massa, costruzione dell’individuo eccezionale, parola musicale e trasformazione estetica della realtà.",
      "L’innovazione linguistica e sensoriale di D’Annunzio resta distinta dai limiti politici e ideologici del poeta-vate.",
      "La costruzione pubblica dell’autore attraverso stampa, fotografia ed evento anticipa meccanismi centrali della comunicazione contemporanea.",
      "Nell’esteta e nel superuomo ricorre il rischio di trattare persone e masse come materia da plasmare.",
      "L’eredità di D’Annunzio è controversa: la grandezza artistica e la responsabilità storica devono essere comprese insieme."
    ],
    vocab:{
      "Auto-rappresentazione":"Costruzione pubblica e intenzionale della propria identità.",
      "Società dello spettacolo":"Sistema nel quale immagini ed eventi acquistano un ruolo centrale nella vita collettiva.",
      "Eredità":"Insieme degli effetti duraturi su lingua, cultura e modelli pubblici.",
      "Alterità":"Esistenza dell’altro come persona autonoma, non riducibile al desiderio del soggetto.",
      "Contraddizione":"Coesistenza non pacificata di grandezza artistica e limite storico."
    },
    maps:[]
  };
  lessonById.set(conclusionLesson.id, conclusionLesson);

  const movements = {
    mondo:{number:"1",title:"Il mondo precedente",eyebrow:"La realtà ricevuta",question:"Quale società, quale cultura e quale idea dell’artista riceve D’Annunzio dall’Italia di fine Ottocento?",lessonIds:["01"],quiz:"mondo",defaultVisual:"section-mondo.svg"},
    fratture:{number:"2",title:"Le fratture",eyebrow:"Vita, immagine, azione",question:"Quali esperienze e contraddizioni spingono D’Annunzio a trasformare la propria vita in un’opera?",lessonIds:["02","03"],quiz:"fratture",defaultVisual:"section-fratture.svg"},
    immagine:{number:"3",title:"L’immagine del mondo",eyebrow:"Estetismo e superomismo",question:"Che cosa accade quando la bellezza diventa un valore assoluto e, successivamente, un diritto di comando?",lessonIds:["05","11"],quiz:"estetismo",defaultVisual:"section-immagine.svg"},
    poetica:{number:"4",title:"La poetica",eyebrow:"La parola trasforma",question:"Quale lingua serve per trasformare il mondo in esperienza estetica, sensoriale e musicale?",lessonIds:["04"],quiz:"poetica",defaultVisual:"section-poetica.svg"},
    opere:{number:"5",title:"Le opere",eyebrow:"Laboratori testuali",question:"Dove estetismo, superomismo e panismo diventano personaggi, immagini, suono e conflitto?",lessonIds:["06","07","08","09","10","12","13","14","15"],quiz:"opere",defaultVisual:"section-opere.svg"},
    conclusione:{number:"6",title:"Conclusione",eyebrow:"Ricomporre senza assolvere",question:"Che cosa resta di D’Annunzio quando smettiamo di ridurlo all’esteta, al superuomo o al poeta-vate?",lessonIds:["16"],quiz:"conclusione",defaultVisual:"section-conclusione.svg"}
  };

  const mapInfo = {
    "allitterazione.png":{label:"Allitterazione",alt:"La ripetizione dei suoni risveglia la freschezza e prepara l’incontro sensuale nella natura.",keywords:["allitterazione","rapporti fonetici","ripetizione","fruscio","suono f"]},
    "amore.png":{label:"L’amore e la favola bella",alt:"La favola bella distingue tempi e soggetti dell’illusione amorosa fra D’Annunzio ed Ermione.",keywords:["favola bella","ieri t’illuse","oggi m’illude","amore","illusione"]},
    "andrea-maria.png":{label:"Andrea e Maria",alt:"Andrea vuole trasformare l’amore ingenuo di Maria in un amore sensuale; la persona resiste al progetto dell’esteta.",keywords:["maria","rivelazione","nome di elena","simulacro","alterità"]},
    "d-annunzio-nietzsche.png":{label:"D’Annunzio e Nietzsche",alt:"Nietzsche oltrepassa valori ereditati; D’Annunzio trasforma il superamento in superiorità e guida delle masse.",keywords:["nietzsche","übermensch","oltreuomo","valori","bestia elettiva"]},
    "misticismo.png":{label:"La misticità della natura",alt:"Il richiamo francescano viene rovesciato in una mistica sensuale della natura.",keywords:["mistic","francescan","laudata sii","cantico","religios"]},
    "nascita-esteta.png":{label:"Nascita dell’esteta",alt:"Andrea riceve dal padre il culto della bellezza, ma la debolezza della volontà trasforma l’ideale in finzione.",keywords:["andrea sperelli","padre","opera d’arte","habere","volontà","esteta"]},
    "onomatopea.png":{label:"Onomatopea",alt:"La parola imita il suono naturale e tende a dissolvere il significato razionale nella musica.",keywords:["onomatopea","croscio","rumore","suono della natura","imita"]},
    "pandeismo-panismo.png":{label:"Pandeismo e panismo",alt:"La fusione con la natura viene confrontata con una concezione religiosa del divino presente nel creato.",keywords:["panismo","pandeismo","fusione panica","fondersi","natura"]},
    "piacere.png":{label:"Il piacere",alt:"Andrea, Elena e Maria rappresentano seduzione, illusione di purezza e fallimento dell’esteta.",keywords:["il piacere","elena muti","maria ferres","romanzo","andrea"]},
    "poetica.png":{label:"La poetica",alt:"Musicalità, ricercatezza verbale e incontro delle sensualità organizzano la poetica dannunziana.",keywords:["poetica","musicalità","parola","sensualità","suggestion"]},
    "primo-momento-panico.png":{label:"Primo momento panico",alt:"Le similitudini avvicinano il corpo di Ermione agli elementi naturali e avviano la metamorfosi.",keywords:["prima fase","pare da scorza","volto","chiome","foglia","ginestre"]},
    "scandali.png":{label:"Gli scandali",alt:"La falsa morte, le relazioni, il lusso e le imprese pubbliche costruiscono una strategia di notorietà.",keywords:["scandal","falsa notizia","morte","debiti","volo su vienna","fiume","duse"]},
    "secondo-momento-panico.png":{label:"Secondo momento panico",alt:"Occhi, denti e cuore diventano polle, mandorle e pesca: Ermione appare creatura terrestre.",keywords:["seconda fase","polle","mandorle","pesca","creatura terrestre","occhi"]},
    "similitudine.png":{label:"Similitudine",alt:"Il confronto esplicito fra corpo e natura prepara la trasformazione della donna.",keywords:["similitudine","come una","come le","confronto","paragon"]},
    "superuomo.png":{label:"Superuomo",alt:"Sensualità, eccezionalità e posizione sopra il bene e il male definiscono la figura dannunziana.",keywords:["superuomo","superomismo","poeta-vate","comando","masse","eccezionale"]},
    "tre-giorni.png":{label:"La favola bella: tre tempi",alt:"La poesia distingue tre tempi dell’illusione e li lega a soggetti e luoghi diversi.",keywords:["tre giorni","ieri","oggi","domani","tempi dell’amore"]}
  };

  const sectionVisuals = {
    "section-mondo.svg":{label:"Il mondo precedente",alt:"La società di massa mette in crisi l’ordine ricevuto e prepara la risposta dell’individuo eccezionale."},
    "section-fratture.svg":{label:"Le fratture",alt:"Ambizione, notorietà e azione pubblica trasformano la vita di D’Annunzio in rappresentazione."},
    "section-immagine.svg":{label:"Esteta e superuomo",alt:"L’esteta si separa dalla massa; il superuomo pretende di guidarla."},
    "section-poetica.svg":{label:"La parola trasforma",alt:"Suono, sensi e figure retoriche conducono dalla parola alla metamorfosi panica."},
    "section-opere.svg":{label:"Le opere",alt:"Il piacere mette in scena la crisi dell’esteta; Alcyone realizza musica e metamorfosi."},
    "section-conclusione.svg":{label:"Un’eredità controversa",alt:"Innovazione linguistica, mito personale e limiti ideologici confluiscono in un’eredità controversa."}
  };

  const studyApp = $("#studyApp");
  const studyGrid = $("#studyGrid");
  const readingPane = $("#readingPane");
  const lessonContent = $("#lessonContent");
  const readingTools = $("#readingTools");
  const selectionStatus = $("#selectionStatus");
  const notebookText = $("#notebookText");
  const autosaveState = $("#autosaveState");
  const imageDialog = $("#imageDialog");
  const dialogImage = $("#dialogImage");
  const dialogCaption = $("#dialogCaption");
  const imageStage = $(".image-stage", imageDialog);
  const attempts = safeGet("attempts", {});
  let currentMovement = null;
  let currentLessonId = null;
  let currentNotebook = {notes:"",citations:[]};
  let currentVisualKey = null;
  let pendingLessonId = null;
  let pendingSelection = null;
  let saveTimer = null;
  let selectionTimer = null;
  let scrollFrame = 0;
  let toastTimer = null;
  let opener = null;
  let zoom = 1;
  let dragging = false;
  let dragOrigin = null;

  function getLesson(id) {
    return lessonById.get(id);
  }

  function visualFromKey(key) {
    if (mapInfo[key]) {
      return {key,label:mapInfo[key].label,alt:mapInfo[key].alt,keywords:mapInfo[key].keywords,path:`assets/images/maps/${key}`,thumb:`assets/images/thumbs/${key.replace(/\.png$/, ".webp")}`};
    }
    const info = sectionVisuals[key];
    return {key,label:info.label,alt:info.alt,keywords:[],path:`assets/images/${key}`,thumb:`assets/images/${key}`};
  }

  function visualsForLesson(item) {
    const movement = movements[currentMovement];
    const keys = [...(item.maps || []), movement.defaultVisual];
    return [...new Set(keys)].map(visualFromKey);
  }

  function renderSourceLesson(item, index) {
    const phase = currentMovement === "immagine" ? (item.id === "05" ? "Fase 3A · Estetismo" : "Fase 3B · Superomismo") : `Lezione ${item.id}`;
    return `<section id="lezione-${item.id}" class="source-lesson" data-lesson-id="${item.id}" aria-labelledby="titolo-${item.id}">
      <header><p class="source-label">${escapeHtml(phase)}</p><h3 id="titolo-${item.id}">${escapeHtml(item.title)}</h3></header>
      <div class="source-text">${item.html}</div>
      <details class="summary-card"><summary>Sintesi della lezione</summary><p>${escapeHtml(item.summary)}</p></details>
      ${index < movements[currentMovement].lessonIds.length - 1 ? `<p class="sr-only">Prosegue con la lezione successiva.</p>` : ""}
    </section>`;
  }

  function splitLongParagraph(element) {
    if (element.textContent.trim().length < 2300) return;
    const text = element.textContent.replace(/\s+/g, " ").trim();
    const sentences = text.match(/[^.!?…]+[.!?…]+[»”\"]?|[^.!?…]+$/g) || [text];
    const chunks = [];
    let chunk = "";
    sentences.forEach(sentence => {
      if (chunk.length > 900 && chunk.length + sentence.length > 1250) {
        chunks.push(chunk.trim());
        chunk = "";
      }
      chunk += `${sentence.trim()} `;
    });
    if (chunk.trim()) chunks.push(chunk.trim());
    const fragment = document.createDocumentFragment();
    chunks.forEach(value => {
      const paragraph = document.createElement("p");
      paragraph.textContent = value;
      fragment.append(paragraph);
    });
    element.replaceWith(fragment);
  }

  function normalizeReadingMarkup() {
    $$(".source-text", lessonContent).forEach(source => {
      $$(':scope > h4, :scope > h5', source).forEach(heading => {
        if (heading.textContent.length < 420) return;
        const paragraph = document.createElement("p");
        paragraph.innerHTML = heading.innerHTML;
        heading.replaceWith(paragraph);
      });
      $$(':scope > p', source).forEach(splitLongParagraph);
      $$("h4,h5,p,li", source).forEach(block => block.classList.add("reading-block"));
    });
  }

  function renderMovement(route) {
    currentMovement = route;
    const movement = movements[route];
    const items = movement.lessonIds.map(getLesson).filter(Boolean);
    studyApp.classList.remove("resource-mode");
    $("#studySectionLabel").textContent = `Movimento ${movement.number} · ${movement.title}`;
    $("#readingEyebrow").textContent = `Movimento ${movement.number} · ${movement.eyebrow}`;
    $("#readingMovementTitle").textContent = movement.title;
    $("#readingQuestion").textContent = movement.question;
    lessonContent.innerHTML = items.map(renderSourceLesson).join("");
    normalizeReadingMarkup();
    items.forEach(item => restoreHighlights(item.id));
    renderLessonJump(items);
    renderSequence(route);
    readingPane.scrollTop = 0;
    setActiveLesson(items[0]?.id || null, true);
    safeSet("last-route", route);
    safeSet("progress", Math.max(safeGet("progress", 0), movementOrder.indexOf(route) + 1));
    if (pendingLessonId && movement.lessonIds.includes(pendingLessonId)) {
      requestAnimationFrame(() => scrollToLesson(pendingLessonId));
      pendingLessonId = null;
    } else {
      requestAnimationFrame(syncReadingContext);
    }
  }

  function renderLessonJump(items) {
    const jump = $("#lessonJump");
    jump.innerHTML = items.map(item => `<button type="button" data-jump-lesson="${item.id}"><span class="sr-only">Vai a </span>${escapeHtml(item.id === "16" ? "Conclusione" : item.title)}</button>`).join("");
    jump.hidden = items.length < 2;
  }

  function renderSequence(route) {
    const index = movementOrder.indexOf(route);
    const previous = $("#previousMovement");
    const next = $("#nextMovement");
    if (index === 0) {
      previous.href = "#home";
      previous.textContent = "← Copertina";
    } else {
      const prevRoute = movementOrder[index - 1];
      previous.href = `#${prevRoute}`;
      previous.textContent = `← ${movements[prevRoute].title}`;
    }
    if (index === movementOrder.length - 1) {
      next.href = "#quiz-finale";
      next.textContent = "Quiz finale →";
    } else {
      const nextRoute = movementOrder[index + 1];
      next.href = `#${nextRoute}`;
      next.textContent = `${movements[nextRoute].title} →`;
    }
  }

  function renderSpecial(route) {
    currentMovement = route;
    currentLessonId = null;
    pendingSelection = null;
    studyApp.classList.add("resource-mode");
    $("#lessonJump").hidden = true;
    $("#studySectionLabel").textContent = "Risorse del percorso";
    $("#readingEyebrow").textContent = "Leggere · osservare · sedimentare";
    $("#readingMovementTitle").textContent = route === "mappe" ? "Mappe e schemi" : "Quiz finale";
    $("#readingQuestion").textContent = route === "mappe" ? "Sedici schemi associati ai punti precisi delle lezioni, disponibili anche come raccolta completa." : "Diciotto domande trasversali sui sei movimenti, con feedback e recupero degli errori.";
    $("#studyTitle").textContent = route === "mappe" ? "Mappe e schemi" : "Quiz finale";
    $("#previousMovement").href = route === "mappe" ? "#home" : "#conclusione";
    $("#previousMovement").textContent = route === "mappe" ? "← Copertina" : "← Conclusione";
    $("#nextMovement").href = route === "mappe" ? "#mondo" : "#home";
    $("#nextMovement").textContent = route === "mappe" ? "Inizia il percorso →" : "Copertina →";
    if (route === "mappe") {
      lessonContent.innerHTML = `<section class="resource-view"><header><p class="source-label">Sedici schemi originali</p><h3>Raccolta completa</h3><p>Durante la lettura ogni schema appare quando serve. Qui puoi consultarli e ingrandirli liberamente.</p></header><div class="map-gallery">${Object.keys(mapInfo).map(key => {
        const visual = visualFromKey(key);
        return `<button type="button" class="image-open" data-image="${visual.path}" data-alt="${escapeHtml(visual.alt)}"><img src="${visual.thumb}" width="720" height="480" alt="${escapeHtml(visual.alt)}" loading="lazy"><span>${escapeHtml(visual.label)}</span></button>`;
      }).join("")}</div></section>`;
    } else {
      lessonContent.innerHTML = `<section class="resource-view"><header><p class="source-label">Verifica trasversale</p><h3>Quiz finale</h3><p>Gli errori non chiudono il percorso: aprono una mini-lezione di recupero e possono essere riprovati separatamente.</p></header><div id="finalQuizMount"></div></section>`;
      const finalQuestions = [
        ...(quizBank.mondo || []).slice(0,2), ...(quizBank.fratture || []).slice(0,2),
        ...(quizBank.estetismo || []).slice(0,2), ...(quizBank.superomismo || []).slice(0,2),
        ...(quizBank.poetica || []).slice(0,2), ...(quizBank.opere || []).slice(0,6),
        ...(quizBank.conclusione || []).slice(0,2)
      ];
      renderQuiz($("#finalQuizMount"), "finale", finalQuestions);
    }
    readingPane.scrollTop = 0;
  }

  function setActiveLesson(id, force = false) {
    if (!id || (!force && id === currentLessonId)) return;
    flushNotebook();
    currentLessonId = id;
    const item = getLesson(id);
    if (!item) return;
    $("#studyTitle").textContent = item.title;
    $("#notebookTitle").textContent = `Taccuino · Lezione ${id}`;
    $$('[data-jump-lesson]').forEach(button => button.classList.toggle("active", button.dataset.jumpLesson === id));
    loadNotebook(id);
    updateReadingTools();
    renderVisualChoices(item);
    safeSet("last-lesson", id);
  }

  function scrollToLesson(id) {
    const target = document.getElementById(`lezione-${id}`);
    if (!target) return;
    target.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
    setActiveLesson(id);
  }

  function readingBlockAtFocus() {
    const paneRect = readingPane.getBoundingClientRect();
    const focusY = paneRect.top + Math.min(paneRect.height * .38, 340);
    const blocks = $$(".reading-block", lessonContent);
    let best = null;
    let bestDistance = Infinity;
    blocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      const point = rect.top <= focusY && rect.bottom >= focusY ? focusY : Math.min(Math.max(focusY, rect.top), rect.bottom);
      const distance = Math.abs(point - focusY);
      if (distance < bestDistance) {
        best = block;
        bestDistance = distance;
      }
    });
    return best;
  }

  function sourceLessonAtFocus() {
    const paneRect = readingPane.getBoundingClientRect();
    const focusY = paneRect.top + 150;
    const sources = $$(".source-lesson", lessonContent);
    let best = sources[0] || null;
    let bestDistance = Infinity;
    sources.forEach(source => {
      const rect = source.getBoundingClientRect();
      const distance = rect.top <= focusY && rect.bottom >= focusY ? 0 : Math.min(Math.abs(rect.top - focusY), Math.abs(rect.bottom - focusY));
      if (distance < bestDistance) {
        best = source;
        bestDistance = distance;
      }
    });
    return best;
  }

  function syncReadingContext() {
    scrollFrame = 0;
    if (!movements[currentMovement]) return;
    const source = sourceLessonAtFocus();
    if (source) setActiveLesson(source.dataset.lessonId);
    const block = readingBlockAtFocus();
    if (!block) return;
    $$('.reading-block[data-current="true"]', lessonContent).forEach(item => item.removeAttribute("data-current"));
    block.dataset.current = "true";
    const item = getLesson(block.closest(".source-lesson")?.dataset.lessonId || currentLessonId);
    if (item) updateContextVisual(resolveVisual(item, block.textContent));
    updateReadingProgress();
  }

  function resolveVisual(item, text) {
    const candidates = visualsForLesson(item);
    const normalizedText = normalize(text);
    let best = candidates[0];
    let bestScore = 0;
    candidates.forEach(candidate => {
      const score = candidate.keywords.reduce((total, keyword) => total + (normalizedText.includes(normalize(keyword)) ? Math.max(1, normalize(keyword).split(" ").length) : 0), 0);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    });
    return best;
  }

  function renderVisualChoices(item) {
    const candidates = visualsForLesson(item);
    $("#visualChoices").innerHTML = candidates.map(visual => `<button type="button" data-visual-key="${visual.key}" title="${escapeHtml(visual.label)}"><img src="${visual.thumb}" alt="" loading="lazy"><span>${escapeHtml(visual.label)}</span></button>`).join("");
    updateContextVisual(candidates[0], true);
  }

  function updateContextVisual(visual, force = false) {
    if (!visual || (!force && visual.key === currentVisualKey)) return;
    currentVisualKey = visual.key;
    const button = $("#contextImageButton");
    const image = $("#contextImage");
    image.src = visual.path;
    image.alt = visual.alt;
    button.dataset.image = visual.path;
    button.dataset.alt = visual.alt;
    $("#contextCaption").textContent = visual.alt;
    $$('[data-visual-key]').forEach(item => item.classList.toggle("active", item.dataset.visualKey === visual.key));
  }

  function notebookFor(id) {
    const value = safeGet(`notebook-${id}`, {notes:"",citations:[]});
    return {notes:typeof value?.notes === "string" ? value.notes : "",citations:Array.isArray(value?.citations) ? value.citations : []};
  }

  function loadNotebook(id) {
    currentNotebook = notebookFor(id);
    notebookText.value = currentNotebook.notes;
    autosaveState.textContent = "Salvataggio automatico";
    renderCitations();
  }

  function flushNotebook() {
    if (!currentLessonId) return;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    currentNotebook.notes = notebookText.value;
    const saved = safeSet(`notebook-${currentLessonId}`, currentNotebook);
    autosaveState.textContent = saved ? "Salvato" : "Salvataggio non disponibile";
  }

  function scheduleNotebookSave() {
    autosaveState.textContent = "Salvataggio…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      flushNotebook();
    }, 350);
  }

  function renderCitations() {
    const list = $("#citationList");
    list.innerHTML = currentNotebook.citations.map((citation, index) => `<li><q>${escapeHtml(citation.text)}</q><small> — ${escapeHtml(citation.source || "Lezione")}</small><button type="button" data-remove-citation="${index}" aria-label="Rimuovi citazione">×</button></li>`).join("");
    $("#emptyCitations").hidden = currentNotebook.citations.length > 0;
  }

  function highlightsFor(id) {
    const value = safeGet(`highlights-${id}`, []);
    if (!Array.isArray(value)) return [];
    return value.filter(item => item && Number.isInteger(item.start) && Number.isInteger(item.end) && item.end > item.start && typeof item.text === "string");
  }

  function saveHighlights(id, highlights) {
    return safeSet(`highlights-${id}`, highlights);
  }

  function sourceTextFor(id) {
    return $(`#lezione-${id} .source-text`, lessonContent);
  }

  function markTextOffsets(source, start, end, highlightId) {
    if (!source || start < 0 || end <= start || end > source.textContent.length) return false;
    const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
    const segments = [];
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeEnd = offset + node.nodeValue.length;
      if (nodeEnd > start && offset < end) {
        segments.push({node,start:Math.max(0,start - offset),end:Math.min(node.nodeValue.length,end - offset)});
      }
      offset = nodeEnd;
      if (offset >= end) break;
    }
    segments.reverse().forEach(segment => {
      if (segment.end <= segment.start || segment.node.parentElement?.closest(".student-highlight")) return;
      const selectedNode = segment.node.splitText(segment.start);
      selectedNode.splitText(segment.end - segment.start);
      const mark = document.createElement("mark");
      mark.className = "student-highlight";
      mark.dataset.highlightId = highlightId;
      mark.title = "Passo evidenziato";
      selectedNode.parentNode.insertBefore(mark, selectedNode);
      mark.append(selectedNode);
    });
    return segments.length > 0;
  }

  function restoreHighlights(id) {
    const source = sourceTextFor(id);
    if (!source) return;
    highlightsFor(id).sort((a,b) => a.start - b.start).forEach(item => markTextOffsets(source,item.start,item.end,item.id));
  }

  function citationMatchesHighlight(citation, highlight) {
    if (citation.highlightId && citation.highlightId === highlight.id) return true;
    return citation.text.replace(/\s+/g," ").trim() === highlight.text.replace(/\s+/g," ").trim();
  }

  function updateReadingTools() {
    const highlights = currentLessonId ? highlightsFor(currentLessonId) : [];
    const notebook = currentLessonId ? notebookFor(currentLessonId) : {citations:[]};
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatchesHighlight(citation,highlight)));
    const canHighlight = !!pendingSelection && pendingSelection.lessonId === currentLessonId;
    $("#highlightSelection").disabled = !canHighlight;
    $("#addSelection").disabled = !canHighlight;
    $("#addHighlights").disabled = waiting.length === 0;
    $("#clearHighlights").disabled = highlights.length === 0;
    $("#highlightCount").textContent = String(waiting.length);
    $("#addHighlights").setAttribute("aria-label", `Incolla nel taccuino ${waiting.length} passaggi evidenziati`);
    if (canHighlight) {
      const words = pendingSelection.text.split(/\s+/).filter(Boolean).length;
      selectionStatus.textContent = `Selezione pronta: ${words} ${words === 1 ? "parola" : "parole"}. Puoi evidenziarla o incollarla subito.`;
    } else if (highlights.length && waiting.length) {
      selectionStatus.textContent = `${highlights.length} ${highlights.length === 1 ? "passaggio evidenziato" : "passaggi evidenziati"}; ${waiting.length} ${waiting.length === 1 ? "da incollare" : "da incollare"} nel taccuino.`;
    } else if (highlights.length) {
      selectionStatus.textContent = `Tutti i passaggi evidenziati sono già nel taccuino.`;
    } else {
      selectionStatus.textContent = "Seleziona un passo, poi evidenzialo.";
    }
  }

  function captureSelection() {
    if (studyApp.hidden || !movements[currentMovement]) return;
    const selection = getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      pendingSelection = null;
      return updateReadingTools();
    }
    const range = selection.getRangeAt(0);
    const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    const source = ancestor?.closest?.(".source-lesson") || range.startContainer.parentElement?.closest(".source-lesson");
    const sourceText = source && $(".source-text",source);
    if (!sourceText || !sourceText.contains(range.startContainer) || !sourceText.contains(range.endContainer)) return;
    const rawText = range.toString();
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!text) return;
    const beforeStart = document.createRange();
    beforeStart.selectNodeContents(sourceText);
    beforeStart.setEnd(range.startContainer,range.startOffset);
    const beforeEnd = document.createRange();
    beforeEnd.selectNodeContents(sourceText);
    beforeEnd.setEnd(range.endContainer,range.endOffset);
    pendingSelection = {
      text:text.slice(0,5000),
      lessonId:source.dataset.lessonId,
      start:beforeStart.toString().length,
      end:beforeEnd.toString().length
    };
    if (currentLessonId !== pendingSelection.lessonId) setActiveLesson(pendingSelection.lessonId);
    else updateReadingTools();
  }

  function addPendingSelection() {
    if (!pendingSelection || pendingSelection.lessonId !== currentLessonId) return;
    flushNotebook();
    const selection = pendingSelection;
    const item = getLesson(selection.lessonId);
    const notebook = notebookFor(selection.lessonId);
    const duplicate = notebook.citations.some(citation => citation.text.replace(/\s+/g," ").trim() === selection.text.replace(/\s+/g," ").trim());
    let saved = true;
    if (!duplicate) {
      notebook.citations.push({text:selection.text,source:item?.title || `Lezione ${selection.lessonId}`,date:new Date().toISOString()});
      saved = safeSet(`notebook-${selection.lessonId}`,notebook);
      currentNotebook = notebook;
      renderCitations();
    }
    pendingSelection = null;
    getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast(duplicate ? "Questo passo è già nel taccuino." : saved ? "Selezione incollata nel taccuino." : "Impossibile salvare la selezione nel taccuino.");
  }

  function highlightPendingSelection() {
    if (!pendingSelection || pendingSelection.lessonId !== currentLessonId) return;
    const selection = pendingSelection;
    const source = sourceTextFor(selection.lessonId);
    const highlights = highlightsFor(selection.lessonId);
    if (!source || selection.end > source.textContent.length) {
      pendingSelection = null;
      updateReadingTools();
      return showToast("La selezione non è più disponibile: seleziona di nuovo il passo.");
    }
    if (highlights.some(item => selection.start < item.end && selection.end > item.start)) {
      pendingSelection = null;
      getSelection()?.removeAllRanges();
      updateReadingTools();
      return showToast("Questa selezione contiene già un passaggio evidenziato.");
    }
    const item = getLesson(selection.lessonId);
    const highlight = {
      id:`h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,
      text:selection.text,
      start:selection.start,
      end:selection.end,
      source:item?.title || `Lezione ${selection.lessonId}`,
      date:new Date().toISOString()
    };
    highlights.push(highlight);
    const saved = saveHighlights(selection.lessonId,highlights);
    markTextOffsets(source,highlight.start,highlight.end,highlight.id);
    pendingSelection = null;
    getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast(saved ? "Passo evidenziato. Puoi continuare a leggere." : "Passo evidenziato, ma il salvataggio locale non è disponibile.");
  }

  function addHighlightsToNotebook() {
    if (!currentLessonId) return;
    flushNotebook();
    const highlights = highlightsFor(currentLessonId);
    const notebook = notebookFor(currentLessonId);
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatchesHighlight(citation,highlight)));
    if (!waiting.length) return showToast("Non ci sono nuovi passaggi evidenziati da incollare.");
    waiting.forEach(highlight => notebook.citations.push({
      text:highlight.text,
      source:highlight.source,
      date:new Date().toISOString(),
      highlightId:highlight.id
    }));
    const saved = safeSet(`notebook-${currentLessonId}`,notebook);
    currentNotebook = notebook;
    renderCitations();
    updateReadingTools();
    showToast(saved ? `${waiting.length} ${waiting.length === 1 ? "passaggio incollato" : "passaggi incollati"} nel taccuino.` : "Impossibile salvare i passaggi nel taccuino.");
  }

  function clearHighlights() {
    if (!currentLessonId) return;
    const highlights = highlightsFor(currentLessonId);
    if (!highlights.length || !confirm(`Rimuovere ${highlights.length === 1 ? "il passaggio evidenziato" : `i ${highlights.length} passaggi evidenziati`} da questa lezione? Le citazioni già nel taccuino resteranno conservate.`)) return;
    const source = sourceTextFor(currentLessonId);
    const parents = new Set();
    $$("mark.student-highlight",source).forEach(mark => {
      parents.add(mark.parentNode);
      mark.replaceWith(...mark.childNodes);
    });
    parents.forEach(parent => parent?.normalize());
    saveHighlights(currentLessonId,[]);
    pendingSelection = null;
    getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast("Evidenziature rimosse; il taccuino non è stato modificato.");
  }

  function downloadNotebook() {
    if (!currentLessonId) return;
    flushNotebook();
    const item = getLesson(currentLessonId);
    const date = new Intl.DateTimeFormat("it-IT", {dateStyle:"long",timeStyle:"short"}).format(new Date());
    const citations = currentNotebook.citations.length ? currentNotebook.citations.map((citation,index) => `[${index + 1}] “${citation.text}”\nFonte: ${citation.source}`).join("\n\n") : "Nessuna citazione selezionata.";
    const text = `Gabriele D’Annunzio — ${item?.title || "Lezione"}\nData: ${date}\n\nAPPUNTI DELLO STUDENTE\n${currentNotebook.notes || "Nessun appunto personale."}\n\nCITAZIONI SELEZIONATE DALLA LEZIONE\n${citations}\n`;
    const blob = new Blob(["\ufeff", text], {type:"text/plain;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dannunzio-lezione-${currentLessonId}-appunti.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function clearNotebook() {
    const item = getLesson(currentLessonId);
    if (!currentLessonId || !confirm(`Cancellare appunti e citazioni di “${item?.title || "questa lezione"}”?`)) return;
    currentNotebook = {notes:"",citations:[]};
    notebookText.value = "";
    safeSet(`notebook-${currentLessonId}`, currentNotebook);
    renderCitations();
    updateReadingTools();
    autosaveState.textContent = "Taccuino cancellato";
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  function openLearningPanel(type) {
    const item = getLesson(currentLessonId);
    if (!item || !movements[currentMovement]) return;
    const dialog = $("#learningDialog");
    $("#learningKicker").textContent = item.title;
    const content = $("#learningContent");
    if (type === "essentials") {
      $("#learningTitle").textContent = "Saperi irrinunciabili";
      content.innerHTML = `<p>Conoscenze da conservare e riutilizzare nelle lezioni successive.</p><ul>${item.essentials.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`;
    } else if (type === "vocab") {
      $("#learningTitle").textContent = "Vocabolario";
      content.innerHTML = `<dl class="vocab-list">${Object.entries(item.vocab).map(([term,definition]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd>`).join("")}</dl>`;
    } else {
      const quizId = currentMovement === "immagine" && currentLessonId === "11" ? "superomismo" : movements[currentMovement].quiz;
      $("#learningTitle").textContent = "Test del movimento";
      content.innerHTML = `<p>Il test verifica i nessi dell’intero movimento, non soltanto la memoria di singole frasi.</p><div id="learningQuizMount"></div>`;
      renderQuiz($("#learningQuizMount"), quizId, quizBank[quizId] || []);
    }
    openModal(dialog);
  }

  function renderQuiz(mount, id, questions, only = null) {
    if (!mount) return;
    const shown = only ? only.map(index => [index, questions[index]]) : questions.map((item,index) => [index,item]);
    const form = document.createElement("form");
    form.className = "quiz-form";
    form.innerHTML = shown.map(([index,item],number) => `<fieldset data-question-index="${index}"><legend>${number + 1}. ${escapeHtml(item.text)}</legend>${item.options.map((option,optionIndex) => `<label><input type="radio" name="q${index}" value="${optionIndex}"> <span>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</span></label>`).join("")}</fieldset>`).join("") + `<div class="quiz-actions"><button type="submit">Correggi</button></div><div class="quiz-result" role="status" aria-live="polite"></div>`;
    mount.replaceChildren(form);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const wrong = [];
      let correct = 0;
      $$(".feedback", form).forEach(item => item.remove());
      shown.forEach(([index,item]) => {
        const picked = form.elements[`q${index}`]?.value;
        const isCorrect = picked !== "" && picked !== undefined && Number(picked) === item.answer;
        if (isCorrect) correct += 1;
        else wrong.push(index);
        const fieldset = $(`[data-question-index="${index}"]`, form);
        const feedback = document.createElement("p");
        feedback.className = `feedback ${isCorrect ? "right" : "wrong"}`;
        feedback.textContent = `${isCorrect ? "Corretto. " : "Da rivedere. "}${item.explain}`;
        fieldset.append(feedback);
      });
      const total = shown.length;
      const percent = total ? Math.round(correct / total * 100) : 0;
      const vote = Math.max(1, Math.round(percent / 10));
      const record = {date:new Date().toISOString(),correct,total,percent,vote,wrong};
      attempts[id] = [...(attempts[id] || []),record];
      safeSet("attempts", attempts);
      const result = $(".quiz-result", form);
      result.innerHTML = `<h3>Risultato: ${correct}/${total} · ${percent}% · voto ${vote}/10</h3><p>Formula: voto = max(1, arrotonda(percentuale ÷ 10)).</p>${wrong.length ? `<h3>Errori da recuperare</h3>${wrong.map(index => recoveryCard(questions[index])).join("")}<div class="quiz-actions"><button type="button" data-retry>Rifai soltanto gli errori</button></div>` : `<p class="right">Tutti i nessi verificati sono corretti.</p>`}<p class="history">Tentativo ${attempts[id].length}. I risultati precedenti restano memorizzati.</p>`;
      $("[data-retry]", result)?.addEventListener("click", () => renderQuiz(mount,id,questions,wrong));
      result.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"center"});
    });
  }

  function recoveryCard(item) {
    return `<article class="recovery-card wrong"><h4>${escapeHtml(item.concept)}</h4><p><b>Chiarimento.</b> ${escapeHtml(item.recovery)}</p><p><b>Esempio.</b> ${escapeHtml(item.example)}</p><p><b>Perché è corretta.</b> ${escapeHtml(item.explain)}</p><button type="button" data-recovery-anchor="${escapeHtml(item.anchor)}">Rileggi il punto mirato</button><p><b>Nuova domanda breve:</b> ${escapeHtml(item.text)}</p></article>`;
  }

  function renderFullIndex() {
    $("#fullIndex").innerHTML = movementOrder.map(route => {
      const movement = movements[route];
      const items = movement.lessonIds.map(getLesson).filter(Boolean);
      return `<section class="index-group"><h3>${movement.number}. ${escapeHtml(movement.title)}</h3><button type="button" data-index-route="${route}">Apri il movimento</button><ol>${items.map(item => `<li><button type="button" data-index-route="${route}" data-index-lesson="${item.id}">${escapeHtml(item.title)}</button></li>`).join("")}</ol></section>`;
    }).join("");
  }

  function renderNotesOverview() {
    const allItems = [...lessons, conclusionLesson];
    const rows = allItems.map(item => ({item,notebook:notebookFor(item.id)})).filter(row => row.notebook.notes.trim() || row.notebook.citations.length);
    $("#notesOverview").innerHTML = rows.length ? rows.map(({item,notebook}) => `<button type="button" data-open-notebook="${item.id}"><span><b>${escapeHtml(item.title)}</b><br><small>${notebook.notes.trim() ? `${notebook.notes.trim().slice(0,90)}${notebook.notes.trim().length > 90 ? "…" : ""}` : "Solo citazioni selezionate"}</small></span><span>${notebook.citations.length} cit.</span></button>`).join("") : "<p>Non hai ancora scritto appunti né raccolto citazioni.</p>";
  }

  function routeForLesson(id) {
    return movementOrder.find(route => movements[route].lessonIds.includes(id));
  }

  function goToLesson(id) {
    const route = routeForLesson(id);
    if (!route) return;
    pendingLessonId = id;
    if (location.hash === `#${route}` && currentMovement === route) {
      scrollToLesson(id);
      pendingLessonId = null;
    } else {
      location.hash = route;
    }
  }

  function showStudy(route) {
    studyApp.hidden = false;
    $("#contenuto").inert = true;
    $("#contenuto").setAttribute("aria-hidden", "true");
    $(".site-footer").hidden = true;
    document.body.classList.add("study-mode");
    document.body.classList.remove("cover-visible");
    if (route === "mappe" || route === "quiz-finale") renderSpecial(route);
    else renderMovement(route);
    requestAnimationFrame(() => readingPane.focus({preventScroll:true}));
  }

  function showHome() {
    flushNotebook();
    studyApp.hidden = true;
    studyApp.classList.remove("resource-mode");
    $("#contenuto").inert = false;
    $("#contenuto").removeAttribute("aria-hidden");
    $(".site-footer").hidden = false;
    document.body.classList.remove("study-mode");
    updateCoverState();
  }

  function handleRoute() {
    const route = decodeURIComponent(location.hash.slice(1)) || "home";
    if (movements[route] || route === "mappe" || route === "quiz-finale") showStudy(route);
    else showHome();
  }

  function updateReadingProgress() {
    if (studyApp.hidden) return updateCoverState();
    const max = readingPane.scrollHeight - readingPane.clientHeight;
    $("#readingBar").style.width = `${max > 0 ? readingPane.scrollTop / max * 100 : 0}%`;
  }

  function updateCoverState() {
    const cover = $("#home");
    const visible = !cover || scrollY < Math.max(0,cover.offsetHeight - 120);
    document.body.classList.toggle("cover-visible", visible);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#readingBar").style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  }

  function openModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    opener?.focus?.();
  }

  function openImage(path, alt) {
    zoom = 1;
    dialogImage.style.setProperty("--zoom", 1);
    dialogImage.src = path;
    dialogImage.alt = alt || "";
    dialogCaption.textContent = alt || "";
    openModal(imageDialog);
  }

  function setTheme() {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
    safeSet("theme",html.dataset.theme);
  }

  function setFont() {
    const html = document.documentElement;
    const fonts = ["small","medium","large"];
    html.dataset.font = fonts[(fonts.indexOf(html.dataset.font) + 1) % fonts.length];
    safeSet("font",html.dataset.font);
  }

  function bindEvents() {
    addEventListener("hashchange", handleRoute);
    addEventListener("scroll", updateCoverState, {passive:true});
    addEventListener("pageshow", () => setTimeout(() => { handleRoute();updateCoverState(); }, 80));
    addEventListener("beforeunload", flushNotebook);
    readingPane.addEventListener("scroll", () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(syncReadingContext);
    }, {passive:true});

    $("#themeBtn").addEventListener("click", setTheme);
    $("#studyThemeBtn").addEventListener("click", setTheme);
    $("#fontBtn").addEventListener("click", setFont);
    $("#studyFontBtn").addEventListener("click", setFont);
    $("#resumeBtn").addEventListener("click", () => {
      pendingLessonId = safeGet("last-lesson", null);
      location.hash = safeGet("last-route", "mondo");
    });

    document.addEventListener("click", event => {
      const openButton = event.target.closest("[data-open]");
      if (openButton) {
        opener = openButton;
        if (openButton.dataset.open === "notesDialog") renderNotesOverview();
        openModal(document.getElementById(openButton.dataset.open));
        return;
      }
      const imageButton = event.target.closest(".image-open");
      if (imageButton && imageButton.dataset.image) {
        opener = imageButton;
        openImage(imageButton.dataset.image,imageButton.dataset.alt || $("img",imageButton)?.alt);
        return;
      }
      const visualButton = event.target.closest("[data-visual-key]");
      if (visualButton) {
        updateContextVisual(visualFromKey(visualButton.dataset.visualKey),true);
        return;
      }
      const jump = event.target.closest("[data-jump-lesson]");
      if (jump) {
        scrollToLesson(jump.dataset.jumpLesson);
        return;
      }
      const indexTarget = event.target.closest("[data-index-route]");
      if (indexTarget) {
        closeModal($("#indexDialog"));
        if (indexTarget.dataset.indexLesson) goToLesson(indexTarget.dataset.indexLesson);
        else location.hash = indexTarget.dataset.indexRoute;
        return;
      }
      const notebookTarget = event.target.closest("[data-open-notebook]");
      if (notebookTarget) {
        closeModal($("#notesDialog"));
        goToLesson(notebookTarget.dataset.openNotebook);
        return;
      }
      const removeCitation = event.target.closest("[data-remove-citation]");
      if (removeCitation) {
        currentNotebook.citations.splice(Number(removeCitation.dataset.removeCitation),1);
        safeSet(`notebook-${currentLessonId}`,currentNotebook);
        renderCitations();
        updateReadingTools();
        return;
      }
      const recovery = event.target.closest("[data-recovery-anchor]");
      if (recovery) {
        const anchor = recovery.dataset.recoveryAnchor;
        closeModal($("#learningDialog"));
        if (/^lezione-\d+$/.test(anchor)) goToLesson(anchor.replace("lezione-",""));
      }
    });

    $$('[data-target-lesson]').forEach(link => link.addEventListener("click", () => { pendingLessonId = link.dataset.targetLesson; }));
    $$('[data-learning-panel]').forEach(button => button.addEventListener("click", () => openLearningPanel(button.dataset.learningPanel)));
    $$('[data-mobile-view]').forEach(button => button.addEventListener("click", () => {
      const view = button.dataset.mobileView;
      studyGrid.dataset.mobilePanel = view;
      $$('[data-mobile-view]').forEach(item => item.classList.toggle("active",item === button));
      if (view === "read") requestAnimationFrame(syncReadingContext);
    }));

    notebookText.addEventListener("input", scheduleNotebookSave);
    $("#downloadNotes").addEventListener("click", downloadNotebook);
    $("#clearNotebook").addEventListener("click", clearNotebook);
    $("#highlightSelection").addEventListener("click", highlightPendingSelection);
    $("#addSelection").addEventListener("click", addPendingSelection);
    $("#addHighlights").addEventListener("click", addHighlightsToNotebook);
    $("#clearHighlights").addEventListener("click", clearHighlights);
    readingTools.addEventListener("pointerdown", event => { if (event.target.closest("button")) event.preventDefault(); });
    lessonContent.addEventListener("pointerup", () => setTimeout(captureSelection,0));
    lessonContent.addEventListener("keyup", event => { if (event.key === "Shift" || event.key.startsWith("Arrow")) setTimeout(captureSelection,0); });
    document.addEventListener("selectionchange", () => {
      clearTimeout(selectionTimer);
      selectionTimer = setTimeout(captureSelection,90);
    });

    $$('dialog').forEach(dialog => {
      dialog.addEventListener("click", event => { if (event.target === dialog) closeModal(dialog); });
      $(".dialog-close",dialog)?.addEventListener("click", event => { event.preventDefault();closeModal(dialog); });
    });
    addEventListener("keydown", event => {
      if (event.key === "Escape") {
        $$('dialog[open]').forEach(closeModal);
        pendingSelection = null;
        getSelection()?.removeAllRanges();
        updateReadingTools();
      }
      if (studyApp.hidden || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const index = movementOrder.indexOf(currentMovement);
      if (index < 0) return;
      const nextIndex = event.key === "ArrowRight" ? Math.min(movementOrder.length - 1,index + 1) : Math.max(0,index - 1);
      if (nextIndex !== index) location.hash = movementOrder[nextIndex];
    });

    $$('[data-zoom]').forEach(button => button.addEventListener("click", () => {
      zoom = button.dataset.zoom === "reset" ? 1 : Math.min(3.5,Math.max(.6,zoom + (button.dataset.zoom === "+" ? .25 : -.25)));
      dialogImage.style.setProperty("--zoom",zoom);
    }));
    imageStage.addEventListener("pointerdown", event => {
      if (zoom <= 1) return;
      dragging = true;
      dragOrigin = {x:event.clientX,y:event.clientY,left:imageStage.scrollLeft,top:imageStage.scrollTop};
      imageStage.setPointerCapture(event.pointerId);
    });
    imageStage.addEventListener("pointermove", event => {
      if (!dragging || !dragOrigin) return;
      imageStage.scrollLeft = dragOrigin.left - (event.clientX - dragOrigin.x);
      imageStage.scrollTop = dragOrigin.top - (event.clientY - dragOrigin.y);
    });
    imageStage.addEventListener("pointerup", () => { dragging = false;dragOrigin = null; });

    const years = {
      1863:"Nasce a Pescara: la distanza dai grandi centri diventerà un elemento della sua ambizione.",
      1879:"Pubblica Primo vere; nel 1880 userà la falsa notizia della morte per accrescerne la notorietà.",
      1889:"Il piacere mette in scena il fascino e il fallimento dell’esteta Andrea Sperelli.",
      1892:"La bestia elettiva testimonia una ricezione selettiva e semplificante di Nietzsche.",
      1903:"Escono Maia, Elettra e Alcyone: parola pubblica, mito e tregua panica convivono.",
      1918:"Il volo su Vienna trasforma l’azione militare in evento simbolico e mediatico.",
      1919:"Occupa Fiume; nel 1920 proclama la Reggenza italiana del Carnaro.",
      1921:"Si stabilisce nella proprietà che diventerà il Vittoriale, monumento della propria vita.",
      1938:"Muore a Gardone Riviera lasciando un’eredità artistica e politica controversa."
    };
    $$('[data-year]').forEach(button => button.addEventListener("click", () => {
      $$('[data-year]').forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      $("#timelineOutput").textContent = years[button.dataset.year];
    }));
  }

  document.documentElement.dataset.theme = safeGet("theme","light");
  document.documentElement.dataset.font = safeGet("font","medium");
  renderFullIndex();
  bindEvents();
  handleRoute();
  updateCoverState();
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
})();
