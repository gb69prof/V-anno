"use strict";

const quizData = {
  s1: [
    {q:"Perché la modernizzazione italiana è decisiva per la nascita del Futurismo?",o:["Perché fu rapida ma diseguale e rese visibile il contrasto fra ritmi nuovi e forme ereditate","Perché eliminò in pochi anni ogni differenza fra Nord e Sud","Perché impose per legge uno stile artistico industriale"],c:0,e:"La modernizzazione fu reale ma concentrata e contraddittoria: proprio l'accelerazione incompleta alimentò la tensione futurista.",r:{concept:"Modernizzazione diseguale",clarification:"Nuove industrie e città non trasformarono nello stesso modo tutto il paese.",example:"Il triangolo Milano–Torino–Genova cresce mentre vaste aree restano agricole.",anchor:"#s1-a1",check:"In una frase: perché il ritardo può produrre desiderio di accelerazione?"}},
    {q:"Che funzione ha l'attacco futurista ai musei?",o:["Propone un censimento tecnico delle collezioni","Mette in scena un parricidio simbolico contro l'autorità del passato","Chiede di sostituire l'arte italiana con quella francese"],c:1,e:"L'iperbole contro i musei serve a spezzare simbolicamente la dipendenza dal primato storico italiano.",r:{concept:"Antipassatismo",clarification:"Il bersaglio è l'obbligo di misurare il presente sul passato, espresso però come cancellazione violenta.",example:"L'Italia celebrata per le rovine viene accusata di non creare un nuovo primato.",anchor:"#s1-a2",check:"Qual è la differenza fra criticare l'autorità del passato e cancellare la memoria?"}},
    {q:"Quale rapporto lega Futurismo e d'Annunzio?",o:["Una totale estraneità estetica e politica","Una continuazione fedele senza polemiche","Un conflitto in cui il movimento rifiuta l'estetismo ma riprende autopromozione e arte-vita"],c:2,e:"D'Annunzio è insieme predecessore, modello operativo e avversario da superare.",r:{concept:"Modello e antagonista",clarification:"Un movimento può costruire la propria differenza assorbendo pratiche del bersaglio.",example:"Marinetti attacca la scrittura dannunziana ma usa spettacolarità pubblica e autore-personaggio.",anchor:"#s1-a3",check:"Indica un elemento rifiutato e uno ripreso da d'Annunzio."}},
    {q:"Perché la stampa di massa è parte della storia futurista?",o:["Perché il manifesto usa il giornale per creare pubblicamente il movimento","Perché i futuristi pubblicano soltanto cronache neutrali","Perché sostituisce del tutto teatri e libri"],c:0,e:"La pubblicazione su un grande quotidiano trasforma il testo in evento e il nome del gruppo in notizia.",r:{concept:"Manifesto e media",clarification:"Il medium non è un contenitore casuale: amplia il pubblico e partecipa all'effetto.",example:"La prima pagina di Le Figaro dà al lancio del 1909 risonanza internazionale.",anchor:"#s1-a3",check:"Che cosa produce il manifesto oltre a dichiarare principi?"}},
    {q:"Quale problema prepara la poetica futurista?",o:["La mancanza di temi antichi nella scuola","La percezione che una vita accelerata non sia resa da forme statiche e lineari","L'impossibilità tecnica di stampare fotografie"],c:1,e:"La frattura nasce dall'insufficienza percepita delle forme tradizionali rispetto ai nuovi ritmi.",r:{concept:"Crisi della rappresentazione",clarification:"Non basta aggiungere una macchina a un testo tradizionale: occorre trasformarne la forma.",example:"Cronofotografia e cinema suggeriscono di scomporre il movimento.",anchor:"#s1-a4",check:"Perché un tema moderno non garantisce una forma moderna?"}}
  ],
  s2: [
    {q:"In che senso il manifesto del 1909 'crea' il Futurismo?",o:["Registra soltanto un gruppo già consolidato da decenni","Sostituisce tutte le opere future","Dà nome, racconto d'origine e programma a una rete ancora da organizzare"],c:2,e:"L'annuncio è performativo: produce identità e reclutamento mentre presenta il movimento.",r:{concept:"Origine costruita",clarification:"Un movimento esiste anche perché un atto pubblico lo nomina e ne organizza il noi.",example:"Il prologo dell'incidente e gli undici punti funzionano come mito e programma.",anchor:"#s2-a1",check:"Quali tre elementi offre il testo alla rete nascente?"}},
    {q:"Qual è l'ambivalenza delle serate futuriste?",o:["Innovano la performance ma rischiano di confondere provocazione e sopraffazione","Sono spettacoli silenziosi e privati","Separano rigorosamente pubblico e opera"],c:0,e:"La reazione del pubblico entra nell'evento; la stessa intensità può però diventare culto dello scontro.",r:{concept:"Performance e conflitto",clarification:"Coinvolgere lo spettatore è innovativo; considerare ogni rissa un successo elimina un criterio critico.",example:"Fischi e tumulti sono assorbiti nella serata come energia dell'opera.",anchor:"#s2-a2",check:"Quando la provocazione smette di essere soltanto simbolica?"}},
    {q:"Perché il 1916 segna una frattura del primo Futurismo?",o:["Marinetti ritira tutti i manifesti","Muoiono Boccioni e Sant'Elia mentre il gruppo è già diviso dalla guerra","Il regime fascista vieta il movimento"],c:1,e:"Le morti di due protagonisti e le diverse scelte interventiste spezzano la stagione iniziale.",r:{concept:"Guerra reale",clarification:"La guerra passa da metafora rigeneratrice a esperienza di morte e dispersione.",example:"Palazzeschi si allontana; Boccioni e Sant'Elia muoiono nel 1916.",anchor:"#s2-a3",check:"Nomina una conseguenza biografica e una conseguenza collettiva della guerra."}},
    {q:"Qual è la formulazione storicamente più corretta sul rapporto col fascismo?",o:["Futurismo e fascismo sono sempre fenomeni senza contatti","Esistono forti affinità e una compromissione reale, ma anche divergenze e fasi diverse","Il Futurismo fu l'unica arte di Stato imposta dal regime"],c:1,e:"Distinguere affinità, responsabilità e scarti evita sia l'assoluzione sia l'equazione semplicistica.",r:{concept:"Affinità e scarti",clarification:"Nazionalismo e violenza avvicinano; anticlericalismo e repubblicanesimo creano attriti.",example:"Marinetti si allontana nel 1920 e torna poi nell'orbita mussoliniana.",anchor:"#s2-a4",check:"Indica un'affinità e una divergenza."}},
    {q:"Che cosa dimostra la presenza di futuriste come Benedetta Cappa o Rosa Rosà?",o:["Che la misoginia del 1909 non è mai esistita","Che tutte le futuriste condividono ogni tesi di Marinetti","Che le donne partecipano e rielaborano il movimento senza cancellarne la misoginia programmatica"],c:2,e:"La presenza attiva rende il quadro più complesso, ma non assolve il testo fondativo.",r:{concept:"Conflitto di genere",clarification:"Partecipazione femminile e misoginia possono coesistere in tensione.",example:"Alcune futuriste rispondono o correggono il linguaggio virilista dall'interno.",anchor:"#s2-a5",check:"Perché 'c'erano donne' non basta a negare la misoginia?"}}
  ],
  s3: [
    {q:"Che cosa rappresentano le linee-forza?",o:["Soltanto il contorno geometrico degli oggetti","Direzioni di energia che collegano figura e ambiente","Le regole prospettiche del Rinascimento"],c:1,e:"Le linee-forza mostrano tensione e direzione, dissolvendo l'isolamento dell'oggetto.",r:{concept:"Linee-forza",clarification:"Il segno descrive ciò che il corpo produce nello spazio, non solo il suo bordo.",example:"Nella scultura di Boccioni il corpo sembra prolungarsi nell'aria.",anchor:"#s3-a1",check:"Che differenza c'è tra contorno e linea-forza?"}},
    {q:"La simultaneità futurista è…",o:["una forma che organizza più tempi e punti di vista nello stesso campo","una confusione priva di progetto","una rigorosa sequenza cronologica"],c:0,e:"La simultaneità non elimina l'organizzazione: tenta di dare forma alla compresenza degli stimoli.",r:{concept:"Simultaneità",clarification:"Più elementi convivono senza essere ridotti a una fila temporale unica.",example:"La metropoli presenta nello stesso istante traffico, luci, voci e folla.",anchor:"#s3-a2",check:"Fornisci un esempio quotidiano di percezione simultanea."}},
    {q:"Qual è il paradosso dell'abolizione futurista dell'io?",o:["Il movimento smette di avere autori riconoscibili","Ogni opera diventa un documento scientifico","La teoria rifiuta l'io psicologico, ma costruisce autori visibili e una materia emotivamente investita"],c:2,e:"L'impersonalità proclamata convive con la forte volontà autoriale e con emozioni aggressive.",r:{concept:"Io e materia",clarification:"Ridurre l'introspezione non elimina il soggetto che seleziona e comanda.",example:"Marinetti proclama l'ascolto della materia mentre costruisce una potentissima figura pubblica.",anchor:"#s3-a3",check:"Perché una scrittura senza 'io' grammaticale può restare soggettiva?"}},
    {q:"Perché la macchina futurista è definita anche un mito?",o:["Perché i futuristi negano l'esistenza delle industrie","Perché concentra valori di potenza e velocità più di quanto analizzi lavoro e costi sociali","Perché appare soltanto in racconti fantastici"],c:1,e:"La macchina è caricata di valori simbolici, mentre le condizioni industriali restano spesso fuori campo.",r:{concept:"Mito della macchina",clarification:"Celebrare una tecnologia non equivale a comprenderne produzione, potere ed effetti.",example:"La fabbrica diventa energia estetica, non indagine sulla fatica operaia.",anchor:"#s3-a4",check:"Quale domanda sociale manca spesso alla tecnolatria?"}},
    {q:"Quale giudizio sulle forme futuriste è più accurato?",o:["Ogni dinamismo conduce necessariamente al fascismo","Le forme sono del tutto neutrali e prive di storia","Le forme possono essere riusate diversamente, ma il loro primo impiego resta criticamente rilevante"],c:2,e:"Occorre evitare sia il determinismo sia l'idea di neutralità assoluta.",r:{concept:"Forma e ideologia",clarification:"Un procedimento migra fra contesti, ma porta con sé una storia da interrogare.",example:"La poesia visiva riprende il paroliberismo senza adottare militarismo e nazionalismo.",anchor:"#s3-a5",check:"Che cosa cambia quando una tecnica passa a un altro contesto?"}}
  ],
  s4: [
    {q:"Quale caratteristica rende operativo il manifesto futurista?",o:["Il tono neutrale e descrittivo","L'uso di noi, imperativi, elenchi e opposizioni per creare adesione","L'assenza di un destinatario"],c:1,e:"La retorica del manifesto non informa soltanto: organizza un soggetto collettivo e mobilita.",r:{concept:"Retorica del manifesto",clarification:"Forma grammaticale e politica cooperano nel costruire il gruppo.",example:"La ripetizione di 'Noi vogliamo' trasforma affermazioni in azione collettiva.",anchor:"#s4-a1",check:"Quale effetto produce il pronome 'noi'?"}},
    {q:"Perché Marinetti privilegia il verbo all'infinito?",o:["Per sottrarlo a persona e tempo determinati e suggerire continuità","Per rendere la frase più simile alla prosa ottocentesca","Per eliminare ogni azione dal testo"],c:0,e:"L'infinito mira a un'azione continua e meno legata alla psicologia individuale.",r:{concept:"Verbo all'infinito",clarification:"La forma verbale riduce coordinate personali e temporali.",example:"'Correre' appare come energia d'azione più che come gesto di un personaggio definito.",anchor:"#s4-a2",check:"Quale informazione perde un verbo passando da 'io corro' a 'correre'?"}},
    {q:"Che cos'è l'immaginazione senza fili?",o:["Il rifiuto di ogni immagine","La ripetizione delle similitudini tradizionali","La costruzione di analogie rapide fra realtà lontane"],c:2,e:"L'analogia deve creare una scarica fra termini distanti senza lunga spiegazione.",r:{concept:"Immaginazione senza fili",clarification:"Il nesso non è arbitrario: produce un nuovo campo di percezione.",example:"Suono, arma, numero e corpo possono essere accostati in un montaggio.",anchor:"#s4-a3",check:"Crea un'analogia fra città e circuito."}},
    {q:"Nelle parole in libertà, che ruolo ha la tipografia?",o:["È una decorazione aggiunta dopo la scrittura","Partecipa al significato mediante dimensione, direzione, peso e spazio","Serve soltanto a rendere uniformi tutte le pagine"],c:1,e:"La pagina diventa campo compositivo: il modo in cui la parola appare modifica il modo in cui agisce.",r:{concept:"Tipografia espressiva",clarification:"Forma visiva e contenuto verbale non sono separabili.",example:"Una parola enorme può produrre graficamente l'intensità di un'esplosione.",anchor:"#s4-a4",check:"Come può uno spazio bianco modificare ritmo o senso?"}},
    {q:"Perché la poetica futurista è intermediale?",o:["Perché applica principi dinamici passando fra scrittura, suono, pittura, teatro e architettura","Perché usa un solo linguaggio per tutte le arti","Perché rifiuta ogni rapporto fra testo e immagine"],c:0,e:"Gli stessi principi migrano e si trasformano in media diversi.",r:{concept:"Intermedialità",clarification:"Non significa uniformità, ma scambio di procedimenti.",example:"Il rumore diventa musica con Russolo e grafia in una tavola parolibera.",anchor:"#s4-a5",check:"Indica un principio futurista presente in due arti diverse."}}
  ],
  s5: [
    {q:"Quali tre dimensioni vanno considerate nel manifesto del 1909?",o:["Biografia, paesaggio, dialogo","Racconto, programma e oggetto mediatico","Romanzo, commedia e trattato scientifico"],c:1,e:"Prologo narrativo, punti programmatici e lancio sul giornale cooperano all'effetto.",r:{concept:"Manifesto triplice",clarification:"Separare le tre dimensioni fa perdere la forza complessiva del testo.",example:"L'incidente crea il mito; gli undici punti il programma; Le Figaro l'evento.",anchor:"#s5-a1",check:"Associa a ogni dimensione un elemento del manifesto."}},
    {q:"Quale problema etico emerge in Zang Tumb Tumb?",o:["La battaglia è resa troppo silenziosa","La sperimentazione elimina ogni ritmo","Lo spettacolo sonoro può dissolvere la sofferenza dei corpi"],c:2,e:"La forma fa percepire l'artiglieria, ma rischia di estetizzare la guerra cancellandone le vittime.",r:{concept:"Estetizzazione della guerra",clarification:"Trasformare violenza in intensità formale può rimuovere chi la subisce.",example:"Onomatopee e tipografia dominano mentre l'individuo scompare nel rumore.",anchor:"#s5-a2",check:"Come si può ammirare la forma senza neutralizzarne il problema?"}},
    {q:"Che cosa rende La città che sale più di un'illustrazione della modernità?",o:["Costruisce con colori e direzioni la sensazione di crescita e compenetrazione","Presenta una veduta urbana immobile e dettagliata","Elimina ogni presenza di uomini e animali"],c:0,e:"Il quadro trasforma il processo storico in vortice percettivo, non si limita a mostrare un cantiere.",r:{concept:"Compenetrazione pittorica",clarification:"L'opera organizza energia tra elementi, non un catalogo di oggetti moderni.",example:"Cavalli, operai e impalcature confluiscono nello stesso movimento.",anchor:"#s5-a3",check:"Quale funzione hanno le diagonali nel quadro?"}},
    {q:"In Forme uniche della continuità nello spazio, il corpo…",o:["viene fissato in una posa classica","è rimodellato dal movimento e dalla pressione dell'ambiente","è riprodotto con anatomia fotografica"],c:1,e:"La figura incorpora avanzamento, aria e resistenza nelle proprie superfici.",r:{concept:"Continuità scultorea",clarification:"La velocità non è un tema esterno: trasforma i volumi.",example:"I profili si espandono e rendono incerto il confine fra corpo e spazio.",anchor:"#s5-a4",check:"Perché l'opera non ha bisogno di ripetere più gambe?"}},
    {q:"Qual è l'innovazione degli Intonarumori?",o:["Escludere i suoni urbani dalla musica","Registrare fedelmente senza trasformare","Rendere famiglie di rumori materiale acustico controllabile e componibile"],c:2,e:"Russolo non copia soltanto l'ambiente: progetta strumenti per organizzarlo musicalmente.",r:{concept:"Rumore composto",clarification:"Il confine musicale si sposta quando il rumore può essere selezionato e modulato.",example:"Rombi e ronzii diventano timbri eseguibili.",anchor:"#s5-a5",check:"Che differenza c'è fra ascoltare un motore e comporre con un rumore simile?"}}
  ],
  s6: [
    {q:"Qual è il nesso corretto fra le sei sezioni?",o:["Ogni sezione è indipendente e non modifica le altre","Il contesto rende intelligibile la frattura, la visione richiede forme e le opere le verificano","Le opere determinano retroattivamente tutti gli eventi storici"],c:1,e:"La catena è interpretativa e causale con cautela, non meccanica.",r:{concept:"Traiettoria",clarification:"Ogni passaggio prepara un problema che il successivo affronta.",example:"Una realtà percepita come simultanea rende necessaria una pagina non lineare.",anchor:"#s6-a1",check:"Formula il ponte fra immagine del mondo e poetica."}},
    {q:"Che cosa significa dire che il supporto non è neutro?",o:["Pagina, voce, spazio e pubblico partecipano alla costruzione del significato","Il contenuto non ha alcuna importanza","Ogni supporto trasmette sempre la stessa ideologia"],c:0,e:"Le condizioni materiali dell'opera orientano percezione e senso senza determinarli interamente.",r:{concept:"Supporto significativo",clarification:"Come appare o accade un testo modifica ciò che può fare.",example:"La dimensione di una parola in una tavola parolibera ne cambia l'intensità.",anchor:"#s6-a2",check:"Fornisci un esempio digitale in cui l'interfaccia modifica il messaggio."}},
    {q:"Qual è il modo corretto di confrontare Futurismo e cultura digitale?",o:["Affermare che Marinetti inventò tecnicamente internet","Usare somiglianze di sensibilità senza inventare una discendenza diretta","Negare ogni analogia fra velocità futurista e comunicazione istantanea"],c:1,e:"Il paragone è utile come strumento critico, non come profezia o genealogia non documentata.",r:{concept:"Analogia, non genealogia",clarification:"Somigliare non significa derivare storicamente.",example:"Feed rapidi e futurismo condividono culto dell'aggiornamento, ma hanno origini tecniche diverse.",anchor:"#s6-a3",check:"Quale prova servirebbe per parlare di influenza diretta?"}},
    {q:"Quale giudizio tiene insieme le contraddizioni del movimento?",o:["L'innovazione assolve ogni scelta politica","La compromissione politica rende inesistente ogni innovazione","Innovazione formale e responsabilità storica sono entrambe reali"],c:2,e:"Un giudizio maturo non usa una verità per cancellare l'altra.",r:{concept:"Doppio giudizio",clarification:"Comprendere non significa né celebrare né ridurre a una sola etichetta.",example:"Le parole in libertà sono feconde; guerra e misoginia restano parti del programma.",anchor:"#s6-a4",check:"Scrivi due frasi che conservino entrambe le verità."}},
    {q:"Che cosa caratterizzerebbe un'avanguardia responsabile?",o:["Accelerare sempre e considerare ogni limite un nemico","Sperimentare rendendo visibili costi, esclusioni e fini","Rinunciare a ogni trasformazione per proteggere il passato"],c:1,e:"Innovazione e critica devono procedere insieme; il limite può essere anche una forma di responsabilità.",r:{concept:"Avanguardia responsabile",clarification:"Essere nuovi non garantisce essere giusti.",example:"Una tecnologia può ampliare capacità ma deve essere valutata per chi include e chi danneggia.",anchor:"#s6-a5",check:"Indica un limite che può rendere migliore un'innovazione."}}
  ]
};

const STORAGE_KEY = "futurismo-gbprof-v1";
let state = loadState();
let deferredInstall = null;
let toastTimer;

function loadState(){
  try { return Object.assign({completed:[],notes:{},attempts:{},last:"s1"},JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")); }
  catch { return {completed:[],notes:{},attempts:{},last:"s1"}; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function esc(s){ return String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m])); }
function showToast(msg){ const t=document.querySelector("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200); }
function goTo(id){
  const el=document.getElementById(id); if(!el)return;
  if(id.startsWith("s")){state.last=id;saveState();}
  el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}

document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.go)));
document.querySelector("#resumeBtn").addEventListener("click",()=>goTo(state.last||"s1"));
document.addEventListener("click",ev=>{
  const link=ev.target.closest(".recovery-card a[href^='#']"); if(!link)return;
  ev.preventDefault();
  const target=document.querySelector(link.getAttribute("href")), chapter=link.closest(".chapter");
  chapter?.querySelector('.chapter-tabs [data-tab="lesson"]')?.click();
  setTimeout(()=>target?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}),0);
});

document.querySelectorAll(".chapter-tabs").forEach(nav=>{
  nav.addEventListener("click",ev=>{
    const btn=ev.target.closest("button[data-tab]"); if(!btn)return;
    const chapter=nav.closest(".chapter");
    nav.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===btn));
    chapter.querySelectorAll(":scope > .panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===btn.dataset.tab));
  });
});

function updateProgress(){
  const count=state.completed.length, pct=Math.round(count/6*100);
  document.querySelector("#progressText").textContent=`${count} di 6 sezioni completate`;
  document.querySelector("#progressPercent").textContent=`${pct}%`;
  document.querySelector("#progressBar").style.width=`${pct}%`;
  document.querySelectorAll("[data-complete]").forEach(btn=>{
    const done=state.completed.includes(btn.dataset.complete);
    btn.classList.toggle("done",done);btn.textContent=done?"Completata ✓":"Segna come completata";
  });
}
document.querySelectorAll("[data-complete]").forEach(btn=>btn.addEventListener("click",()=>{
  const id=btn.dataset.complete, i=state.completed.indexOf(id);
  if(i<0)state.completed.push(id);else state.completed.splice(i,1);
  saveState();updateProgress();showToast(i<0?"Sezione completata":"Completamento rimosso");
}));

document.querySelectorAll("textarea[data-notes]").forEach(area=>{
  const id=area.dataset.notes;area.value=state.notes[id]||"";
  let timer; area.addEventListener("input",()=>{
    clearTimeout(timer); area.nextElementSibling.textContent="Salvataggio…";
    timer=setTimeout(()=>{state.notes[id]=area.value;saveState();area.nextElementSibling.textContent="Salvato";},350);
  });
});

function renderQuiz(id, onlyIds=null){
  const root=document.querySelector(`.quiz[data-quiz="${id}"]`), data=quizData[id];
  const ids=onlyIds||data.map((_,i)=>i), retry=Boolean(onlyIds);
  root.dataset.activeIds=ids.join(",");
  root.innerHTML=`<div class="quiz-intro"><h3>${retry?"Recupero mirato":"Verifica della sezione"}</h3><p>${retry?"Sono presenti soltanto i quesiti errati nell'ultimo tentativo.":"5 quesiti, tre opzioni, una sola corretta. Il feedback compare subito."} Formula: <b>voto = max(1, arrotonda(percentuale × 10))</b>.</p></div>`+
    ids.map((idx,pos)=>questionHTML(id,idx,pos,retry)).join("")+
    `<div class="quiz-actions"><button type="button" data-submit>Calcola risultato</button><button type="button" class="alt" data-clear>Azzera risposte</button></div><div class="quiz-result" aria-live="polite"></div>`;
  root.querySelectorAll("input[type=radio]").forEach(input=>input.addEventListener("change",()=>instantFeedback(root,id,Number(input.dataset.q))));
  root.querySelector("[data-submit]").addEventListener("click",()=>submitQuiz(root,id));
  root.querySelector("[data-clear]").addEventListener("click",()=>renderQuiz(id,onlyIds));
}
function questionHTML(section,idx,pos,retry){
  const item=quizData[section][idx];
  return `<div class="question-card" data-qcard="${idx}">${retry?'<div class="retry-marker">Da recuperare</div>':''}<fieldset><legend>${pos+1}. ${esc(item.q)}</legend>${item.o.map((x,i)=>`<label class="option"><input type="radio" name="${section}-q${idx}" value="${i}" data-q="${idx}"><span><b>${String.fromCharCode(65+i)}.</b> ${esc(x)}</span></label>`).join("")}</fieldset><div class="instant-feedback" data-feedback></div></div>`;
}
function instantFeedback(root,section,idx){
  const item=quizData[section][idx], card=root.querySelector(`[data-qcard="${idx}"]`), picked=card.querySelector("input:checked"), box=card.querySelector("[data-feedback]");
  const ok=Number(picked.value)===item.c;
  box.className=`instant-feedback visible ${ok?"correct":"wrong"}`;
  box.innerHTML=`<b>${ok?"Corretto.":"Non è corretto."}</b> ${esc(item.e)}`;
}
function submitQuiz(root,section){
  const ids=root.dataset.activeIds.split(",").filter(Boolean).map(Number), answers={}, missing=[];
  ids.forEach(idx=>{const x=root.querySelector(`input[name="${section}-q${idx}"]:checked`);if(x)answers[idx]=Number(x.value);else missing.push(idx);});
  if(missing.length){showToast(`Rispondi ancora a ${missing.length} ${missing.length===1?"domanda":"domande"}`);root.querySelector(`[data-qcard="${missing[0]}"] input`).focus();return;}
  const wrong=ids.filter(idx=>answers[idx]!==quizData[section][idx].c), correct=ids.length-wrong.length, pct=Math.round(correct/ids.length*100), grade=Math.max(1,Math.round(pct/10));
  const attempt={at:new Date().toISOString(),scope:ids,wrong,correct,total:ids.length,pct,grade};
  state.attempts[section]=state.attempts[section]||[];state.attempts[section].push(attempt);saveState();
  const result=root.querySelector(".quiz-result");
  result.innerHTML=`<div class="result"><h3><span class="score">${correct}/${ids.length}</span> · ${pct}% · voto ${grade}/10</h3>${wrong.length?`<p>Di seguito compaiono esclusivamente i ${wrong.length} errori e il recupero collegato.</p><div class="errors-list">${wrong.map(idx=>recoveryHTML(section,idx)).join("")}</div><div class="quiz-actions"><button type="button" data-retry>Rifai soltanto gli errori</button></div>`:`<p>Nessun errore in questo tentativo. I nessi verificati risultano acquisiti.</p>`}${historyHTML(section)}</div>`;
  const retry=result.querySelector("[data-retry]");if(retry)retry.addEventListener("click",()=>{renderQuiz(section,wrong);root.scrollIntoView({behavior:"smooth",block:"start"});});
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function recoveryHTML(section,idx){
  const q=quizData[section][idx],r=q.r;
  return `<article class="recovery-card"><h4>Errore: ${esc(q.q)}</h4><p><b>Concetto:</b> ${esc(r.concept)}</p><p><b>Chiarimento:</b> ${esc(r.clarification)}</p><p><b>Esempio:</b> ${esc(r.example)}</p><p><a href="${r.anchor}">Torna al punto esatto della lezione</a></p><p><b>Nuova domanda breve:</b> ${esc(r.check)}</p></article>`;
}
function historyHTML(section){
  const a=state.attempts[section]||[];
  return `<div class="history"><b>Storico conservato:</b> ${a.map((x,i)=>`#${i+1} ${x.correct}/${x.total}, ${x.pct}%, voto ${x.grade}`).join(" · ")}</div>`;
}
Object.keys(quizData).forEach(id=>renderQuiz(id));

const resetDialog=document.querySelector("#resetDialog");
document.querySelector("#resetBtn").addEventListener("click",()=>resetDialog.showModal());
document.querySelector("#confirmReset").addEventListener("click",()=>{
  localStorage.removeItem(STORAGE_KEY);state=loadState();
  document.querySelectorAll("textarea[data-notes]").forEach(a=>{a.value="";a.nextElementSibling.textContent="";});
  Object.keys(quizData).forEach(id=>renderQuiz(id));updateProgress();showToast("Dati locali azzerati");
});

window.addEventListener("beforeinstallprompt",ev=>{ev.preventDefault();deferredInstall=ev;});
document.querySelector("#installBtn").addEventListener("click",async()=>{
  if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;return;}
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent), content=document.querySelector("#installInstructions");
  content.innerHTML=ios?"<p>In Safari tocca <b>Condividi</b>, poi <b>Aggiungi alla schermata Home</b> e conferma.</p>":"<p>Apri il menu del browser e scegli <b>Installa app</b> o <b>Aggiungi alla schermata Home</b>.</p>";
  document.querySelector("#installDialog").showModal();
});

const observer=new IntersectionObserver(entries=>{
  const current=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(current){state.last=current.target.id;saveState();}
},{threshold:[.15,.35]});
document.querySelectorAll(".chapter").forEach(x=>observer.observe(x));

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>showToast("Modalità offline non disponibile")));}
updateProgress();
