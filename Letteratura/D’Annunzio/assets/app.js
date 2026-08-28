(() => {
  "use strict";
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const key = name => `dannunzio-${name}`;
  const steps = ["mondo", "fratture", "immagine", "poetica", "opere", "conclusione"];
  const safeGet = (name, fallback = null) => {
    try {
      const value = localStorage.getItem(key(name));
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };
  const safeSet = (name, value) => {
    try { localStorage.setItem(key(name), JSON.stringify(value)); } catch {}
  };

  const mapInfo = {
    "allitterazione.png": ["Allitterazione", "La ripetizione dei suoni risveglia la freschezza e prepara l’incontro sensuale nella natura."],
    "amore.png": ["L’amore e la favola bella", "La favola bella distingue tempi e soggetti dell’illusione amorosa fra D’Annunzio ed Ermione."],
    "andrea-maria.png": ["Andrea e Maria", "Andrea vuole trasformare l’amore ingenuo di Maria in un amore sensuale; la persona resiste al progetto dell’esteta."],
    "d-annunzio-nietzsche.png": ["D’Annunzio e Nietzsche", "Nietzsche oltrepassa valori ereditati; D’Annunzio trasforma il superamento in superiorità e guida delle masse."],
    "misticismo.png": ["La misticità della natura", "Il richiamo francescano viene rovesciato in una mistica sensuale della natura."],
    "nascita-esteta.png": ["Nascita dell’esteta", "Andrea riceve dal padre il culto della bellezza, ma la debolezza della volontà trasforma l’ideale in finzione."],
    "onomatopea.png": ["Onomatopea", "La parola imita il suono naturale e tende a dissolvere il significato razionale nella musica."],
    "pandeismo-panismo.png": ["Pandeismo e panismo", "La fusione con la natura viene confrontata con una concezione religiosa del divino presente nel creato."],
    "piacere.png": ["Il piacere", "Andrea, Elena e Maria rappresentano seduzione, illusione di purezza e fallimento dell’esteta."],
    "poetica.png": ["La poetica", "Musicalità, ricercatezza verbale e incontro delle sensualità organizzano la poetica dannunziana."],
    "primo-momento-panico.png": ["Primo momento panico", "Le similitudini avvicinano il corpo di Ermione agli elementi naturali e avviano la metamorfosi."],
    "scandali.png": ["Gli scandali", "La falsa morte, le relazioni, il lusso e le imprese pubbliche costruiscono una strategia di notorietà."],
    "secondo-momento-panico.png": ["Secondo momento panico", "Occhi, denti e cuore diventano polle, mandorle e pesca: Ermione appare creatura terrestre."],
    "similitudine.png": ["Similitudine", "Il confronto esplicito fra corpo e natura prepara la trasformazione della donna."],
    "superuomo.png": ["Superuomo", "Sensualità, eccezionalità e posizione sopra il bene e il male definiscono la figura dannunziana."],
    "tre-giorni.png": ["La favola bella: tre giorni", "La poesia distingue tre tempi dell’illusione e li lega a soggetti e luoghi diversi."]
  };

  const labelFromFile = file => mapInfo[file]?.[0] || file.replace(/\.png$/,"").replaceAll("-"," ");
  const altFromFile = file => mapInfo[file]?.[1] || `Schema concettuale: ${labelFromFile(file)}.`;

  function renderLessons() {
    const lessons = window.DANNUNZIO_LESSONS || [];
    const byId = new Map(lessons.map(item => [item.id, item]));
    $$(".lesson-mount").forEach(mount => {
      const item = byId.get(mount.dataset.lessonId);
      if (!item) {
        mount.innerHTML = "<p role='alert'>Lezione non disponibile.</p>";
        return;
      }
      const maps = item.maps.map(file => `<button type="button" class="image-open" data-image="assets/images/maps/${file}" data-alt="${altFromFile(file)}"><img src="assets/images/thumbs/${file.replace(/\.png$/,".webp")}" alt="${altFromFile(file)}" width="720" height="480" loading="lazy"><span>${labelFromFile(file)}</span></button>`).join("");
      const vocab = Object.entries(item.vocab).map(([term, definition]) => `<dt>${term}</dt><dd>${definition}</dd>`).join("");
      mount.innerHTML = `<section id="lezione-${item.id}" class="source-lesson" aria-labelledby="titolo-${item.id}">
        <header><p class="source-label">Lezione originale ${item.id}</p><h3 id="titolo-${item.id}">${item.title}</h3></header>
        <div class="source-text">${item.html}</div>
        <aside class="apparatus" aria-label="Apparati didattici aggiuntivi">
          <details><summary>Sintesi della lezione</summary><p>${item.summary}</p></details>
          <div class="study-grid"><section><h3>Saperi irrinunciabili</h3><ul>${item.essentials.map(value => `<li>${value}</li>`).join("")}</ul></section><section><h3>Vocabolario</h3><dl>${vocab}</dl></section></div>
          ${maps ? `<div class="lesson-map-strip">${maps}</div>` : ""}
        </aside>
      </section>`;
    });
  }

  function renderGallery() {
    const gallery = $("#mapGallery");
    gallery.innerHTML = Object.entries(mapInfo).map(([file, [label, alt]]) => `<button type="button" class="image-open" data-image="assets/images/maps/${file}" data-alt="${alt}"><img src="assets/images/thumbs/${file.replace(/\.png$/,".webp")}" width="720" height="480" alt="${alt}" loading="lazy"><span>${label}</span></button>`).join("");
  }

  const q = (text, options, answer, explain, anchor, concept, recovery, example) => ({text, options, answer, explain, anchor, concept, recovery, example});
  const bank = {
    mondo: [
      q("Quale trasformazione storica apre il percorso?",["La società borghese diventa società di massa","La nobiltà torna a governare l’Italia","Il mercato editoriale scompare"],0,"La crescita della massa modifica politica, pubblico e ruolo dell’artista.","mondo","Società di massa","La folla entra nella storia, nei consumi e nella comunicazione.","La stampa amplia il pubblico ma rende la bellezza parte del mercato."),
      q("Come reagisce il primo estetismo alla massa?",["La considera depositaria della bellezza","Difende la bellezza come privilegio di pochi","Rinuncia a ogni distinzione sociale"],1,"L’estetismo costruisce una risposta aristocratica alla democratizzazione.","mondo","Estetismo e massa","Il bello viene contrapposto al numero, all’utile e al consumo comune.","Il «diluvio democratico» è percepito come minaccia."),
      q("Che cosa cambia con il superuomo dannunziano?",["L’artista abbandona ogni ruolo pubblico","La massa diventa autonoma","L’artista pretende di guidare la massa"],2,"Il superuomo supera il ritiro dell’esteta attraverso comando e azione.","mondo","Dall’esteta al superuomo","La separazione aristocratica diventa pretesa di guida.","Il poeta-vate parla alla collettività e non soltanto a pochi cultori."),
      q("Perché Manzoni e Verga compaiono nel mondo precedente?",["Offrono due risposte anteriori e diverse alla presenza popolare","Sono i maestri diretti di D’Annunzio","Condividono il superomismo"],0,"Servono a mostrare che il problema del popolo precede D’Annunzio.","mondo","Precedenti letterari","Confrontare non significa attribuire dipendenza diretta.","Provvidenza manzoniana e pessimismo verghiano non coincidono."),
      q("Quale tensione prepara la frattura successiva?",["Ordine classico contro lingua latina","Artista contro società di massa","Campagna contro città medievale"],1,"Il bisogno di distinguersi cresce dentro una società che tende a omologare.","mondo","Tensione generativa","La crisi collettiva incontra l’ambizione individuale.","D’Annunzio vuole uscire dalla provincia e imporsi sulla scena nazionale.")
    ],
    fratture: [
      q("Quale sentimento-base individua la seconda lezione?",["Paura della natura","Nostalgia dell’infanzia","Ambizione di emergere"],2,"La distanza dai centri culturali alimenta il desiderio di primeggiare.","lezione-02","Ambizione","La provincia è il punto di partenza di una strategia di affermazione.","Dalla Pescara del 1863 D’Annunzio mira alla scena nazionale."),
      q("Quando fu fatta circolare la falsa notizia della morte?",["1880","1889","1918"],0,"La notizia segue la seconda edizione di Primo vere ed è attestata nel 1880.","lezione-03","Cronologia della notorietà","Non va confuso l’inizio del periodo romano con l’anno della trovata pubblicitaria.","Il trafiletto sulla caduta da cavallo compare nel novembre 1880."),
      q("Che cosa rende diversi gli scandali elencati?",["Sono tutti episodi inventati","Alcuni sono trovate pubblicitarie, altri azioni storiche e politiche","Sono soltanto relazioni amorose"],1,"Marketing personale, lusso, guerra e Fiume hanno natura e conseguenze differenti.","lezione-03","Tipi di scandalo","La notorietà unifica episodi che restano storicamente diversi.","Il volo su Vienna non equivale a un pettegolezzo mondano."),
      q("Come va descritto il rapporto con il fascismo?",["Come totale estraneità","Come adesione senza tensioni","Come rapporto di influenza, vicinanza e autonomia conflittuale"],2,"D’Annunzio offrì linguaggi e rituali, ma mantenne anche rivalità e autonomia personale.","lezione-03","D’Annunzio e fascismo","Evitare sia l’assoluzione sia l’identificazione meccanica.","Il regime lo celebrò e insieme lo tenne sotto controllo."),
      q("Quale funzione assume la vita pubblica?",["Diventa parte della costruzione artistica del personaggio","Resta separata dalle opere","Serve a nascondere ogni ambizione"],0,"Gesto, casa, impresa e stampa partecipano alla vita come rappresentazione.","fratture","Vita come opera","La biografia offre un contesto, non una causa automatica di ogni testo.","Il Vittoriale organizza oggetti e memoria come una scena.")
    ],
    estetismo: [
      q("Qual è il valore supremo dell’esteta?",["L’utile economico","La bellezza","L’uguaglianza politica"],1,"L’estetismo ordina la vita secondo forma e bellezza.","estetismo","Culto del bello","Il principio estetico prevale sulle norme pratiche e morali.","Ambienti, abiti e relazioni vengono trasformati in composizione."),
      q("Che cosa significa fare della vita un’opera d’arte?",["Costruire gesti e ambienti come forme estetiche","Scrivere una sola autobiografia","Rinunciare alla vita pubblica"],0,"L’esistenza stessa diventa materiale da comporre e mostrare.","lezione-05","Arte e vita","La formula riguarda il modo di vivere e di rappresentarsi.","La casa e il personaggio pubblico partecipano alla stessa opera."),
      q("Perché Andrea Sperelli non è un modello riuscito?",["Non possiede cultura","Rifiuta ogni piacere","La volontà debole trasforma l’ideale in menzogna e possesso"],2,"Il narratore mostra il restringimento della vita e l’incapacità di autenticità.","lezione-07","Crisi dell’esteta","Il fascino formale convive con il fallimento morale e relazionale.","Andrea accende il sentimento con l’immaginazione mentre le parole mentono."),
      q("Come va interpretato il rapporto fra autore e Andrea?",["Come identità perfetta","Come relazione complessa, non semplice portavoce","Come totale opposizione"],1,"Andrea incarna nuclei dannunziani, ma il romanzo ne rappresenta anche la crisi.","lezione-06","Autore e personaggio","Un personaggio può esprimere e insieme mettere in questione un’idea.","La prosa seduce mentre la vicenda mostra il vuoto dell’esteta."),
      q("Quale mondo preferisce Andrea?",["La Roma papale delle ville e delle fontane","La città industriale","La campagna verista"],0,"La Roma aristocratica diventa scenario del proprio sogno estetico.","lezione-07","Roma dell’esteta","Lo spazio è selezionato e trasformato in scenografia.","Andrea preferirebbe Villa Medici al Colosseo.")
    ],
    superomismo: [
      q("Come avviene la ricezione dannunziana di Nietzsche?",["In modo puramente filologico","Anche attraverso traduzioni e mediazioni francesi","Senza conoscere alcuna idea nietzscheana"],1,"La ricezione è selettiva e mediata, non una lettura lineare di un solo libro.","lezione-11","Ricezione di Nietzsche","D’Annunzio rielabora una moda culturale europea.","La bestia elettiva del 1892 deproblematizza motivi nietzscheani."),
      q("Che cosa NON è l’oltreuomo nietzscheano?",["Superamento dei valori ereditati","Figura fedele alla terra","Capo biologicamente superiore destinato a comandare la massa"],2,"Nietzsche non propone una semplice selezione del più forte.","lezione-11","Oltreuomo","L’uomo è presentato come ponte e passaggio, non come specie da sostituire militarmente.","Creare valori non equivale a comandare un esercito."),
      q("Che cosa aggiunge il superuomo all’esteta?",["Azione e pretesa di comando","Rinuncia al culto della bellezza","Obbedienza alla morale comune"],0,"Il culto del bello resta, ma viene proiettato nella guida pubblica.","superomismo","Dall’esteta al comando","L’isolamento contemplativo diventa protagonismo.","Il poeta-vate si presenta come guida e comandante."),
      q("Quale differenza centrale separa D’Annunzio da Nietzsche?",["Nietzsche difende la morale tradizionale","D’Annunzio politicizza e semplifica l’individuo eccezionale","D’Annunzio rifiuta ogni vitalismo"],1,"La complessità filosofica viene ridotta a vitalismo, superiorità e comando.","lezione-11","Trasformazione dannunziana","Somiglianza lessicale non significa identità concettuale.","L’oltreuomo crea valori; il superuomo dannunziano guida le masse."),
      q("Quale figura pubblica realizza il progetto superomistico?",["Il narratore impersonale","Il poeta appartato","Il poeta-vate e comandante"],2,"D’Annunzio mette in scena la continuità fra parola, impresa e guida.","superomismo","Poeta-vate","La letteratura viene prolungata fuori dal libro.","Fiume trasforma la retorica in azione politica.")
    ],
    poetica: [
      q("Qual è lo scopo principale della parola poetica?",["Registrare dati neutrali","Suggerire e suggestionare attraverso suono e sensi","Dimostrare un teorema"],1,"La parola agisce sul lettore attraverso musicalità e percezione.","poetica","Parola musicale","Il significato razionale non viene solo comunicato, ma trasformato.","Il fruscio delle f evoca freschezza prima della spiegazione."),
      q("Che cosa fa l’allitterazione?",["Ripete suoni con funzione espressiva","Confronta due oggetti con come","Imita soltanto versi animali"],0,"La ripetizione fonica costruisce atmosfera e senso.","lezione-04","Allitterazione","Non è ornamento neutro: orienta la percezione.","Fresche, fruscio, fan, foglie fanno sentire il movimento."),
      q("Come opera l’onomatopea?",["Elimina ogni suono","Riproduce linguisticamente un rumore","Sostituisce la similitudine"],1,"La parola tende a diventare voce della natura.","lezione-04","Onomatopea","Il suono del termine contribuisce al significato.","Il croscio varia con la diversa fronda."),
      q("Quale funzione ha la similitudine nella Pioggia?",["Blocca la metamorfosi","Descrive soltanto il paesaggio","Avvicina corpo e natura fino alla trasformazione"],2,"I confronti preparano la fusione panica di Ermione.","lezione-04","Similitudine e metamorfosi","Il come è una soglia fra somiglianza e trasformazione.","Il volto è molle come foglia e le chiome profumano come ginestre."),
      q("Che cosa indica la mistica sensuale?",["Una conversione religiosa ortodossa","Una lode della natura vissuta attraverso i sensi","Il rifiuto del corpo"],1,"Il modello francescano viene rovesciato dentro natura e sensualità.","lezione-04","Misticismo dei sensi","La forma religiosa sopravvive ma cambia direzione.","Laudata sii è rivolta alla sera personificata.")
    ],
    opere: [
      q("Quando viene pubblicato Il piacere?",["1889","1903","1912"],0,"Il romanzo appartiene alla fase romana e all’estetismo di fine Ottocento.","lezione-06","Cronologia del Piacere","Non confondere la data del romanzo con quella delle Laudi.","Il piacere precede Alcyone di oltre un decennio."),
      q("Perché Andrea fallisce con Maria?",["Perché non la incontra mai","Perché la sovrappone a Elena e nega la sua alterità","Perché rinuncia all’estetismo"],1,"Il nome di Elena rivela il progetto di trasformare Maria in un simulacro.","lezione-10","Gioco analogico","L’altro non può essere trattato come materia inerte.","La sintassi si frantuma quando il nome sbagliato viene pronunciato."),
      q("Quanti libri delle Laudi vengono realizzati?",["Tre","Sette","Cinque"],2,"Il ciclo ne prevedeva sette, ma i libri compiuti sono cinque.","lezione-12","Le Laudi","Progetto e realizzazione vanno distinti.","Maia, Elettra, Alcyone, Merope e Asterope."),
      q("Come va datato Asterope?",["Pubblicato nel 1933, mentre D’Annunzio era vivo","Pubblicato postumo nel 1939","Pubblicato con Alcyone nel 1903"],0,"D’Annunzio muore nel 1938: il volume del 1933 non è postumo.","lezione-12","Asterope","Controllare la cronologia impedisce un errore evidente.","I Canti della guerra latina sono noti anche come Asterope."),
      q("Che struttura ideale possiede Alcyone?",["Una cronaca parlamentare","Un diario dell’estate toscana","Un romanzo di formazione"],1,"Le liriche seguono il movimento stagionale dalla tarda primavera a settembre.","lezione-13","Alcyone","La stagione ordina la metamorfosi e la tregua.","Il paesaggio va dai colli fiesolani alla costa tirrenica."),
      q("Che cosa avviene nella Sera fiesolana?",["La natura viene antropomorfizzata","Il poeta descrive una battaglia","La donna viene trasformata in statua"],0,"Sera, campagna, pioggia e colline assumono tratti umani.","lezione-14","Antropomorfizzazione","Qui il movimento prevalente va dalla natura verso forme umane.","La sera ha viso di perla e grandi occhi umidi."),
      q("Qual è il primo gesto della Pioggia nel pineto?",["Corri","Taci","Ricorda"],1,"L’imperativo sospende le parole umane e apre l’ascolto.","lezione-15","Taci","La metamorfosi comincia con un cambiamento di linguaggio.","Le parole nuove sono quelle pronunciate da gocce, foglie e animali."),
      q("Come procede la metamorfosi di Ermione?",["Per paragoni e trasformazioni progressive","Con un unico evento improvviso","Soltanto attraverso la biografia della Duse"],0,"Corpo e interiorità vengono accostati a elementi naturali in due momenti.","lezione-15","Metamorfosi panica","La similitudine apre una progressiva materializzazione.","Occhi-polle, denti-mandorle e cuore-pesca segnano la seconda fase."),
      q("Come va trattata la pioggia come purificazione?",["Come unico significato obbligatorio","Come errore da cancellare sempre","Come interpretazione possibile, non dato univoco"],2,"Il testo sostiene la trasformazione; la purificazione è una lettura.","lezione-15","Dato e interpretazione","Un’interpretazione va motivata e dichiarata.","La pioggia modifica i corpi, ma il testo non offre una definizione teorica."),
      q("Che cosa accomuna Il piacere e le liriche paniche?",["La trasformazione estetica della realtà","La stessa forma narrativa","Il rifiuto della sensualità"],0,"Andrea trasforma persone in immagini; la poesia trasforma corpi e natura.","opere","Arte e trasformazione","La somiglianza non elimina la differenza fra manipolazione e metamorfosi.","Maria diventa simulacro, Ermione creatura terrestre.")
    ],
    conclusione: [
      q("Qual è una grandezza indiscutibile di D’Annunzio?",["L’innovazione linguistica e musicale","L’assenza di artificio","La neutralità politica"],0,"La sua lingua modifica ritmo, lessico e possibilità sensoriali della poesia.","conclusione","Grandezza artistica","Valutare l’arte non impone di assolvere l’ideologia.","Alcyone influenza profondamente la lirica del Novecento."),
      q("Quale limite attraversa estetismo e politica?",["La volontà di riconoscere sempre l’altro","La tendenza a trattare persone e masse come materia da formare","Il rifiuto della visibilità"],1,"Il dominio dell’esteta e quello del vate condividono una gerarchia.","conclusione","Dominio e alterità","Il limite emerge nel rapporto con individui e collettività.","Andrea plasma Maria; il vate pretende di guidare la massa."),
      q("In che senso D’Annunzio è moderno?",["Anticipa la centralità dell’immagine pubblica e dell’evento","Rifiuta la stampa","Vive soltanto nei libri"],0,"Comprende che autore, medium, gesto e pubblico formano un unico sistema.","conclusione","Modernità mediale","La vita pubblica diventa parte dell’opera.","Scandalo, fotografia, impresa e casa monumentale costruiscono il personaggio."),
      q("Come va giudicata l’eredità dannunziana?",["Come modello integralmente positivo","Come fenomeno privo di valore artistico","Come eredità controversa, fra grandezza e limiti"],2,"Una lettura storica tiene insieme innovazione, ideologia e responsabilità.","conclusione","Eredità controversa","Comprendere non significa celebrare né cancellare.","La musicalità di Alcyone convive con il linguaggio del comando."),
      q("Quale catena ricompone il percorso?",["Opere → nascita → casualità","Mondo di massa → fratture → estetismo e superomismo → poetica → opere","Scandalo → assoluzione → silenzio"],1,"I sei movimenti mostrano come la risposta storica diventi visione, forma e opera.","conclusione","Catena interpretativa","Ogni passaggio deve preparare il successivo.","La paura della massa prepara l’eccezionalità, che richiede una parola capace di agire.")
    ]
  };

  const attempts = safeGet("attempts", {});
  function renderQuiz(mount, id, questions, only = null) {
    const shown = only ? only.map(index => [index, questions[index]]) : questions.map((item, index) => [index, item]);
    const form = document.createElement("form");
    form.className = "quiz-form";
    form.innerHTML = shown.map(([index, item], number) => `<fieldset><legend>${number + 1}. ${item.text}</legend>${item.options.map((option, optionIndex) => `<label><input type="radio" name="q${index}" value="${optionIndex}"> <span>${String.fromCharCode(65 + optionIndex)}. ${option}</span></label>`).join("")}</fieldset>`).join("") + `<div class="quiz-actions"><button type="submit">Correggi</button></div><div class="quiz-result" role="status" aria-live="polite"></div>`;
    mount.replaceChildren(form);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const wrong = [];
      let correct = 0;
      shown.forEach(([index, item]) => {
        const picked = form.elements[`q${index}`]?.value;
        if (picked !== "" && Number(picked) === item.answer) correct += 1;
        else wrong.push(index);
      });
      const total = shown.length;
      const percent = Math.round(correct / total * 100);
      const vote = Math.max(1, Math.round(percent / 10));
      const record = {date:new Date().toISOString(), correct, total, percent, vote, wrong};
      attempts[id] = [...(attempts[id] || []), record];
      safeSet("attempts", attempts);
      const result = $(".quiz-result", form);
      result.innerHTML = `<h4>Risultato: ${correct}/${total} · ${percent}% · voto ${vote}/10</h4><p>Formula: voto = max(1, arrotonda(percentuale ÷ 10)).</p>` + (wrong.length ? `<h4>Errori da recuperare</h4>${wrong.map(index => recoveryCard(questions[index])).join("")}<div class="quiz-actions"><button type="button" data-retry>Rifai soltanto gli errori</button></div>` : `<p class="right">Tutti i nessi verificati sono corretti.</p>`) + `<p class="history">Tentativo ${attempts[id].length}. I risultati precedenti restano memorizzati.</p>`;
      result.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"center"});
      $("[data-retry]", result)?.addEventListener("click", () => renderQuiz(mount, id, questions, wrong));
    });
  }
  const recoveryCard = item => `<article class="recovery-card wrong"><h5>${item.concept}</h5><p><b>Chiarimento.</b> ${item.recovery}</p><p><b>Esempio.</b> ${item.example}</p><p><b>Perché è corretta.</b> ${item.explain}</p><a href="#${item.anchor}">Rileggi il punto mirato</a><p><b>Nuova domanda breve:</b> ${item.text}</p></article>`;

  renderLessons();
  renderGallery();
  $$(".section-quiz").forEach(section => {
    const id = section.dataset.quiz;
    renderQuiz($(".quiz-mount", section), id, bank[id]);
  });
  const finalQuestions = [
    ...bank.mondo.slice(0,2), ...bank.fratture.slice(0,2), ...bank.estetismo.slice(0,2),
    ...bank.superomismo.slice(0,2), ...bank.poetica.slice(0,2), ...bank.opere.slice(0,6),
    ...bank.conclusione.slice(0,2)
  ];
  renderQuiz($("[data-final-quiz]"), "finale", finalQuestions);

  const html = document.documentElement;
  html.dataset.theme = safeGet("theme", "light");
  html.dataset.font = safeGet("font", "medium");
  $("#themeBtn").addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
    safeSet("theme", html.dataset.theme);
  });
  const fonts = ["small", "medium", "large"];
  $("#fontBtn").addEventListener("click", () => {
    html.dataset.font = fonts[(fonts.indexOf(html.dataset.font) + 1) % fonts.length];
    safeSet("font", html.dataset.font);
  });

  const dialogs = $$("dialog");
  let opener = null;
  const openModal = dialog => {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };
  const closeModal = dialog => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    opener?.focus();
  };
  $$("[data-open]").forEach(button => button.addEventListener("click", () => {
    opener = button;
    openModal(document.getElementById(button.dataset.open));
  }));
  dialogs.forEach(dialog => {
    dialog.addEventListener("close", () => opener?.focus());
    dialog.addEventListener("click", event => { if (event.target === dialog) closeModal(dialog); });
    $(".dialog-close", dialog)?.addEventListener("click", event => { event.preventDefault(); closeModal(dialog); });
  });
  addEventListener("keydown", event => {
    if (event.key === "Escape") dialogs.filter(dialog => dialog.hasAttribute("open")).forEach(closeModal);
  });

  const notes = $("#notesArea");
  const noteStatus = $("#notesStatus");
  notes.value = safeGet("notes", "");
  $("#saveNotes").addEventListener("click", () => { safeSet("notes", notes.value); noteStatus.textContent = "Appunti salvati."; });
  $("#clearNotes").addEventListener("click", () => {
    if (confirm("Svuotare definitivamente gli appunti?")) {
      notes.value = "";
      safeSet("notes", "");
      noteStatus.textContent = "Appunti svuotati.";
    }
  });
  $("#exportNotes").addEventListener("click", () => {
    const blob = new Blob([`Appunti — Gabriele D’Annunzio\n\n${notes.value}`], {type:"text/plain;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "appunti-dannunzio.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  const imageDialog = $("#imageDialog");
  const dialogImage = $("#dialogImage");
  const dialogCaption = $("#dialogCaption");
  const imageStage = $(".image-stage", imageDialog);
  let zoom = 1;
  let dragging = false;
  let origin = null;
  $$(".image-open").forEach(button => button.addEventListener("click", () => {
    opener = button;
    zoom = 1;
    dialogImage.style.setProperty("--zoom", 1);
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.dataset.alt || $("img", button)?.alt || "";
    dialogCaption.textContent = dialogImage.alt;
    openModal(imageDialog);
  }));
  $$("[data-zoom]").forEach(button => button.addEventListener("click", () => {
    zoom = button.dataset.zoom === "reset" ? 1 : Math.min(3.5, Math.max(.6, zoom + (button.dataset.zoom === "+" ? .25 : -.25)));
    dialogImage.style.setProperty("--zoom", zoom);
  }));
  imageStage.addEventListener("pointerdown", event => {
    if (zoom <= 1) return;
    dragging = true;
    origin = {x:event.clientX, y:event.clientY, left:imageStage.scrollLeft, top:imageStage.scrollTop};
    imageStage.setPointerCapture(event.pointerId);
  });
  imageStage.addEventListener("pointermove", event => {
    if (!dragging || !origin) return;
    imageStage.scrollLeft = origin.left - (event.clientX - origin.x);
    imageStage.scrollTop = origin.top - (event.clientY - origin.y);
  });
  imageStage.addEventListener("pointerup", () => { dragging = false; origin = null; });

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
  $$("[data-year]").forEach(button => button.addEventListener("click", () => {
    $$("[data-year]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    $("#timelineOutput").textContent = years[button.dataset.year];
  }));

  const lessons = $$(".lesson");
  const navLinks = $$(".path-index a[href^='#']");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const active = link.hash === `#${id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      safeSet("last", id);
      safeSet("progress", Math.max(safeGet("progress", 0), steps.indexOf(id) + 1));
    });
  }, {rootMargin:"-28% 0px -62% 0px"});
  lessons.forEach(lesson => observer.observe(lesson));
  $("#resumeBtn").addEventListener("click", () => document.getElementById(safeGet("last", "mondo"))?.scrollIntoView());
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#readingBar").style.width = `${max ? scrollY / max * 100 : 0}%`;
    document.body.classList.toggle("cover-visible", scrollY < $("#home").offsetHeight - 120);
  };
  addEventListener("scroll", updateScroll, {passive:true});
  addEventListener("pageshow", () => setTimeout(updateScroll, 100));
  updateScroll();
  addEventListener("keydown", event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const current = location.hash.slice(1);
    const index = steps.indexOf(current);
    const next = event.key === "ArrowRight" ? Math.min(steps.length - 1, index < 0 ? 0 : index + 1) : Math.max(0, index < 0 ? 0 : index - 1);
    location.hash = steps[next];
  });
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
})();
