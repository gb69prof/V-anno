(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const key = n => `pascoli-${n}`;
  const steps = ["mondo","fratture","immagine","fanciullino","forma","simbolismo","opere","conclusione"];
  const safeGet = (n, fallback = null) => { try { const v = localStorage.getItem(key(n)); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } };
  const safeSet = (n, v) => { try { localStorage.setItem(key(n), JSON.stringify(v)); } catch {} };

  const bank = {
    mondo: [
      q("Come va presentato il positivismo nel percorso?",["Come un errore già superato","Come l’orizzonte dominante ma non uniforme","Come la poetica personale di Carducci"],1,"È l’orizzonte di osservazione, legge e progresso, non un blocco uniforme.","positivismo","Positivismo","Pascoli riceve precisione e fiducia nel dato, ma ne avverte il limite sul senso.","Il dato resta vero, ma non esaurisce il significato."),
      q("Che cosa apprende soprattutto da Carducci?",["Rigore metrico e cultura classica","Rifiuto dei metri tradizionali","Uso esclusivo delle cose umili"],0,"Carducci è il maestro della disciplina formale e del dialogo con gli antichi.","positivismo","Carducci","La novità pascoliana nasce dentro una solida eredità classica.","Pascoli conserva i metri mentre incrina il ritmo."),
      q("In che senso Pascoli rinnova la tradizione?",["La abbandona per il verso libero","Ne conserva soltanto i temi civili","Sposta il centro e incrina la voce dall’interno"],2,"Conserva cultura e metri, ma passa dagli eventi al minimo e dall’oratoria alla percezione.","positivismo","Rinnovamento","Il nuovo nasce nella tensione fra struttura ricevuta e percezione moderna.","Un metro stabile può contenere una voce spezzata."),
      q("Quale elemento NON viene cancellato dalla poesia pascoliana?",["Il dato concreto e il nome preciso","Ogni forma metrica","La gerarchia dei temi alti"],0,"La precisione rimane; è la pretesa di spiegare tutto a entrare in crisi.","positivismo","Precisione","La poesia comincia dove il dato non basta, non dove smette di valere.","Il nome botanico conserva la cosa e apre altre risonanze."),
      q("Che cosa indica la soglia della modernità?",["Il ritorno a certezze assolute","La crisi dell’universo interamente leggibile","La rinuncia alla cultura classica"],1,"La modernità emerge quando soggetto, società e storia mostrano zone opache.","positivismo","Modernità","La promessa di ordine incontra conflitti ed esperienze non riducibili a legge.","La precisione convive con l’opacità.")
    ],
    fratture: [
      q("Quando viene assassinato Ruggero Pascoli?",["10 agosto 1867","10 agosto 1871","9 agosto 1896"],0,"Il padre è ucciso il 10 agosto 1867; 1896 è l’anno di pubblicazione della poesia.","fratture","Cronologia","Separare l’evento dalla sua trasformazione letteraria evita errori.","Il fatto è del 1867; X agosto è del 1896."),
      q("Perché le perdite non devono spiegare meccanicamente ogni verso?",["Perché Pascoli non parla mai di famiglia","Per evitare il biografismo","Perché la biografia è incerta"],1,"La vita offre un contesto, ma la forma poetica trasforma l’esperienza.","fratture","Biografismo","Un testo non è il semplice travaso di un evento personale.","La rondine di X agosto universalizza il trauma."),
      q("Che valore ha il nido?",["Soltanto felicità domestica","Solo paura dell’esterno","Protezione e possibile chiusura"],2,"Il nido raccoglie ma può difendersi fino all’esclusione.","nido","Nido ambivalente","Il simbolo mantiene due spinte opposte.","La casa protegge chi è dentro e marca chi resta fuori."),
      q("Quale esperienza segna il rapporto con la politica?",["L’arresto del 1879","Il Nobel del 1906","La guerra del 1915"],0,"L’arresto e l’assoluzione raffreddano la militanza senza cancellare la fraternità.","fratture","Politica","L’evoluzione politica attraversa tensioni, non una linea pacificata.","Il socialismo umanitario resterà in attrito col nazionalismo."),
      q("Quando viene acquistata l’abitazione di Castelvecchio?",["1895","1902","1912"],1,"Lo stabilimento con Maria va distinto dall’acquisto della casa nel 1902.","fratture","Castelvecchio","Cronologie diverse non vanno fuse.","Vita nella casa e proprietà dell’abitazione non coincidono.")
    ],
    immagine: [
      q("Qual è il rapporto di Pascoli con la scienza?",["La rifiuta integralmente","La sostituisce con superstizione","Ne usa la precisione ma ne avverte il limite"],2,"Il problema non è l’esattezza, ma l’insufficienza sul piano del senso.","immagine","Scienza e senso","La poesia non nega il fenomeno: ascolta ciò che la spiegazione non risolve.","Un fiore è nominato esattamente e insieme diventa segnale."),
      q("Come appare la natura?",["Ambivalente: accoglie e minaccia","Sempre materna","Puro sfondo decorativo"],0,"Quiete agricola e predazione, calore e temporale convivono.","immagine","Natura","La natura non riceve un solo valore emotivo.","Il nido protegge, la notte espone."),
      q("Perché le cose umili sono decisive?",["Perché rendono il testo infantile","Perché restano concrete e aprono profondità","Perché sostituiscono ogni tema storico"],1,"La piccola cosa conserva consistenza e acquista risonanza.","immagine","Piccole cose","Umile non significa semplice.","Un assiuolo reale diventa anche voce inquietante."),
      q("Che cosa caratterizza la soglia?",["È un muro impermeabile","Elimina la distinzione dentro/fuori","È attraversata da suoni, odori e luci"],2,"Il confine pascoliano protegge ma resta permeabile.","immagine","Soglia","Il dentro sente continuamente il fuori.","Nel Gelsomino il lume rende visibile dall’esterno la casa."),
      q("Come va letto il rapporto fra fraternità e nazionalismo?",["Come tensione storica non risolta","Come perfetta continuità","Come totale abbandono della politica"],0,"Il socialismo umanitario e il colonialismo tardo non si fondono pacificamente.","immagine","Contraddizione politica","La lettura storica conserva la contraddizione.","La Grande Proletaria non cancella il precedente ideale fraterno.")
    ],
    fanciullino: [
      q("Che cos’è il fanciullino?",["Una fase biografica conclusa","Una facoltà infantile presente nell’adulto","Il rifiuto della cultura"],1,"Appartiene a tutti; il poeta sa continuare ad ascoltarlo.","fanciullino","Facoltà poetica","Non è infantilismo ma sospensione dell’abitudine.","L’adulto colto può vedere una cosa come nuova."),
      q("Quali sono le tappe editoriali decisive?",["1897 e 1903","1867 e 1871","1901 e 1912"],0,"Prima pubblicazione nel 1897 e forma in volume nel 1903.","fanciullino","Storia editoriale","Un saggio può essere pubblicato e poi rielaborato.","Il testo del 1897 non coincide semplicemente con la forma del 1903."),
      q("Che cosa significa nominare?",["Ripetere categorie consunte","Usare soltanto parole semplici","Restituire singolarità e forza alla cosa"],2,"Il nome preciso riattiva la prima scoperta.","fanciullino","Nominare","Lo stupore non cancella la precisione.","Dire il nome di una pianta la rende presenza, non etichetta generica."),
      q("Qual è la funzione sociale della poesia?",["Un progetto ideale di fraternità","Un programma politico esecutivo","Una dimostrazione scientifica"],0,"La poesia concilia idealmente, ma non elimina il male né governa la società.","fanciullino","Funzione della poesia","Distinguere ideale morale e soluzione politica.","Lo stupore può ridurre l’invidia senza abolire i conflitti."),
      q("Pascoli coincide semplicemente col Simbolismo europeo?",["Sì, ne copia tecniche e temi","No, vi partecipa con fisionomia classica e rurale propria","No, perché rifiuta ogni simbolo"],1,"Condivide relazioni nascoste e suono, ma combina classicismo, nomi precisi e storia personale.","fanciullino","Relazioni culturali","L’appartenenza a un clima non annulla l’originalità.","Il lessico botanico pascoliano resta specifico.")
    ],
    forma: [
      q("Come va definita la sintassi pascoliana?",["Deliberatamente frammentata","Involontariamente scorretta","Sempre ampia e oratoria"],0,"Pause e frasi nominali sono strumenti tecnicamente controllati.","sintassi","Sintassi franta","Il lettore ricostruisce nessi lasciati impliciti.","I lampi percettivi di Temporale non sono casuali."),
      q("Quali registri convivono nel lessico?",["Soltanto parole comuni","Comuni, tecnici, rurali e classici","Solo latinismi"],1,"La pluralità lessicale dà nomi precisi e incrina l’uniformità tradizionale.","sintassi","Lessico plurale","Registri differenti svolgono una funzione conoscitiva.","Il nome ornitologico convive con l’onomatopea."),
      q("Che ruolo svolge il suono?",["Decora un significato già completo","Sostituisce sempre le parole","Contribuisce a produrre significato"],2,"Onomatopea, allitterazione e fonosimbolismo costruiscono atmosfera e senso.","sintassi","Suono","La forma acustica orienta la percezione.","«chiù» è voce naturale e nucleo emotivo."),
      q("Che cos’è la sinestesia?",["L’unione di sensazioni diverse","La ripetizione di consonanti","La rottura fra sintassi e verso"],0,"La sinestesia incrocia, per esempio, olfatto e colore.","sintassi","Sinestesia","Non confonderla con allitterazione o enjambement.","«Odore di fragole rosse» unisce olfatto, gusto e vista."),
      q("Dove nasce la modernità del ritmo?",["Nel rifiuto totale dei metri","Nella tensione fra metro tradizionale e voce spezzata","Nell’uso esclusivo del verso libero"],1,"Cesure, enjambement e punteggiatura incrinano strutture metriche riconoscibili.","sintassi","Metro e ritmo","Metro e andamento percettivo non coincidono.","Una quartina regolare può contenere esitazioni.")
    ],
    simbolismo: [
      q("Che cosa accade alla cosa quando diventa simbolo?",["Scompare dietro un’idea","Resta concreta e si densifica","Riceve un significato fisso"],1,"Il simbolo pascoliano non cancella l’oggetto.","simbolismo","Concretezza simbolica","La digitale resta una pianta tossica e apre altre letture.","Il nido è casa concreta e figura familiare."),
      q("Da che cosa dipende il valore di un simbolo?",["Dal contesto e dalla rete dei richiami","Da un dizionario universale","Solo dalla biografia"],0,"Suoni, posizione e relazioni testuali orientano il significato.","simbolismo","Contesto","Lo stesso fiore può cambiare valore fra testi.","Il gelsomino e la digitale non significano la stessa cosa."),
      q("Quale serie raccoglie immagini ricorrenti?",["Fabbrica, treno, folla, città","Maschera, specchio, teatro, forma","Nido, uccelli, fiori, notte, suoni"],2,"Sono i nodi principali della rete pascoliana.","simbolismo","Rete di immagini","Ricorrenza non significa equivalenza automatica.","Gli uccelli possono essere cura, fragilità o presagio."),
      q("Che cosa impedisce una lettura univoca?",["L’ambivalenza","La metrica","La data di pubblicazione"],0,"L’ambivalenza conserva spinte opposte dentro la stessa immagine.","simbolismo","Ambivalenza","Non è vaghezza arbitraria, ma pluralità sostenuta dal testo.","Il fiore attrae e minaccia."),
      q("Che rapporto c’è col Simbolismo europeo?",["Nessuno","Condivisione di relazioni e suono, con fisionomia personale","Identità completa"],1,"La formazione classica e il paesaggio rurale rendono Pascoli autonomo.","simbolismo","Simbolismo europeo","Somiglianza storica non equivale a copia.","La precisione nomenclatoria distingue la sua lingua.")
    ],
    opere: [
      q("Qual è la struttura di X agosto?",["Sei quartine ABAB","Cinque terzine incatenate","Sei quartine di soli endecasillabi"],0,"Sei quartine alternate organizzano il parallelismo rondine/padre.","x-agosto","X agosto: forma","La simmetria metrica sostiene quella narrativa.","Insetto e bambole occupano posizioni corrispondenti."),
      q("Perché il cielo di X agosto non consola pienamente?",["Perché non è mai nominato","Perché è sereno ma ripetutamente lontano","Perché punisce il padre"],1,"L’apostrofe cerca il cielo, ma la distanza e l’atomo del Male restano.","x-agosto","X agosto: cielo","Il richiamo cristiano intensifica la domanda senza chiuderla.","«Come in croce» convive con «cielo lontano»."),
      q("Come vanno trattate le immagini erotiche del Gelsomino?",["Come fatti biografici certi","Come elementi irrilevanti","Come interpretazioni fondate su segnali testuali"],2,"Calici, odore, lume e petali suggeriscono eros senza determinismo.","gelsomino","Gelsomino: eros","Il testo autorizza inferenze, non diagnosi.","Il lume che sale e si spegne è una reticenza."),
      q("Qual è la struttura di Digitale purpurea?",["75 endecasillabi in 25 terzine e tre parti","24 novenari in sei quartine","Un sonetto"],0,"La terza rima sostiene dialogo, visione e confessione.","digitale","Digitale: forma","La costruzione narrativa è essenziale al senso.","Il ricordo avanza fino al «si muore»."),
      q("Come vanno lette Maria e Rachele?",["Come identiche","Come contrasto reale ma non allegoria rigida","Come purezza e sensualità senza eccezioni"],1,"Le opposizioni esistono, ma le due donne condividono memoria e brivido.","digitale","Digitale: personaggi","Il confine dell’esperienza attraversa entrambe.","Maria ascolta e reagisce, non è una statua allegorica.")
    ],
    conclusione: [
      q("Che cosa significa il passaggio dalla certezza al segnale?",["La poesia raccoglie indizi senza ricostruire un ordine assoluto","La scienza viene dichiarata falsa","Ogni interpretazione vale allo stesso modo"],0,"Suoni, odori e oggetti entrano in relazione senza soluzione definitiva.","conclusione","Dalla certezza al segnale","Apertura non significa arbitrarietà.","Il cielo di X agosto è interrogato ma non risponde."),
      q("Qual è una grandezza di Pascoli?",["Cancella la tradizione","Rinnova dall’interno e dà voce al minimo","Risolve il problema del male"],1,"Metri ricevuti, piccoli oggetti e sensi producono una lingua nuova.","conclusione","Grandezza","La modernità nasce dalla tensione, non dalla tabula rasa.","Il metro resta mentre il ritmo si incrina."),
      q("Qual è un limite storico?",["L’eccesso di verso libero","Il rifiuto di ogni patria","La tensione fra fraternità e nazionalismo coloniale"],2,"La contraddizione politica va conservata e discussa.","conclusione","Limite politico","Leggere storicamente significa non armonizzare tutto.","Il discorso del 1911 entra in attrito col socialismo umanitario."),
      q("Che cosa accomuna le tre opere?",["Ogni spazio protetto è attraversato dall’esterno","Il lieto fine","La stessa forma metrica"],0,"Nido, casa e orto sono soglie permeabili.","conclusione","Tre opere","La relazione comune non cancella le differenze.","Il nido attende, la casa bisbiglia, l’orto contiene il fiore proibito."),
      q("Perché Pascoli è moderno?",["Perché abbandona ogni metro","Per l’io intermittente, i registri misti e il dettaglio aperto","Perché offre una morale unica"],1,"Frattura della voce e pluralità formale aprono significati non univoci.","conclusione","Modernità","La modernità pascoliana non coincide col verso libero.","La forma tradizionale lascia emergere discontinuità.")
    ]
  };
  function q(text, options, answer, explain, anchor, concept, recovery, example){return {text,options,answer,explain,anchor,concept,recovery,example};}

  const attempts = safeGet("attempts", {});
  function renderQuiz(mount, id, questions, final = false, only = null) {
    const shown = only ? only.map(i => [i, questions[i]]) : questions.map((v,i) => [i,v]);
    const form = document.createElement("form"); form.className = "quiz-form";
    form.innerHTML = shown.map(([i,item],n) => `<fieldset><legend>${n+1}. ${item.text}</legend>${item.options.map((op,j)=>`<label><input type="radio" name="q${i}" value="${j}"> <span>${String.fromCharCode(65+j)}. ${op}</span></label>`).join("")}</fieldset>`).join("") + `<div class="quiz-actions"><button type="submit">Correggi</button></div><div class="quiz-result" role="status" aria-live="polite"></div>`;
    mount.replaceChildren(form);
    form.addEventListener("submit", e => {
      e.preventDefault();
      const wrong = []; let correct = 0;
      shown.forEach(([i,item]) => {
        const picked = form.elements[`q${i}`]?.value;
        if (Number(picked) === item.answer) correct++; else wrong.push(i);
      });
      const total = shown.length, percent = Math.round(correct/total*100), vote = Math.max(1, Math.round(percent/10));
      const record = {date:new Date().toISOString(),correct,total,percent,vote,wrong};
      attempts[id] = [...(attempts[id]||[]),record]; safeSet("attempts",attempts);
      const result = $(".quiz-result",form);
      result.innerHTML = `<h4>Risultato: ${correct}/${total} · ${percent}% · voto ${vote}/10</h4><p>Formula: voto = max(1, arrotonda(percentuale ÷ 10)).</p>` +
        (wrong.length ? `<h4>Errori da recuperare</h4>${wrong.map(i=>recoveryCard(questions[i],i)).join("")}<div class="quiz-actions"><button type="button" data-retry>Rifai soltanto gli errori</button></div>` : `<p class="right">Tutti i nessi verificati sono corretti.</p>`) +
        `<p class="history">Tentativo ${attempts[id].length}. I tentativi precedenti restano memorizzati.</p>`;
      result.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});
      $("[data-retry]",result)?.addEventListener("click",()=>renderQuiz(mount,id,questions,final,wrong));
    });
  }
  function recoveryCard(item,i){
    return `<article class="recovery-card wrong"><h5>${item.concept}</h5><p><b>Chiarimento.</b> ${item.recovery}</p><p><b>Esempio.</b> ${item.example}</p><p><b>Perché la risposta corretta è corretta.</b> ${item.explain}</p><a href="#${item.anchor}">Rileggi il punto mirato</a><p><b>Nuova domanda breve:</b> ${item.text}</p></article>`;
  }
  $$(".section-quiz").forEach(sec => { const id=sec.dataset.quiz; renderQuiz($(".quiz-mount",sec),id,bank[id]); });
  const finalQuestions = steps.flatMap(id=>bank[id].slice(0,2));
  renderQuiz($("[data-final-quiz]"),"finale",finalQuestions,true);

  const html = document.documentElement;
  html.dataset.theme = safeGet("theme","light"); html.dataset.font = safeGet("font","medium");
  $("#themeBtn").addEventListener("click",()=>{html.dataset.theme=html.dataset.theme==="dark"?"light":"dark";safeSet("theme",html.dataset.theme);});
  const fonts=["small","medium","large"]; $("#fontBtn").addEventListener("click",()=>{html.dataset.font=fonts[(fonts.indexOf(html.dataset.font)+1)%3];safeSet("font",html.dataset.font);});

  const dialogs = $$("dialog"); let opener = null;
  $$("[data-open]").forEach(btn=>btn.addEventListener("click",()=>{opener=btn;document.getElementById(btn.dataset.open)?.showModal();}));
  dialogs.forEach(d=>d.addEventListener("close",()=>opener?.focus()));
  dialogs.forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close();}));

  const notes=$("#notesArea"), status=$("#notesStatus"); notes.value=safeGet("notes","");
  $("#saveNotes").addEventListener("click",()=>{safeSet("notes",notes.value);status.textContent="Appunti salvati.";});
  $("#clearNotes").addEventListener("click",()=>{if(confirm("Svuotare definitivamente gli appunti?")){notes.value="";safeSet("notes","");status.textContent="Appunti svuotati."; }});
  $("#exportNotes").addEventListener("click",()=>{const blob=new Blob([`Appunti — Giovanni Pascoli\n\n${notes.value}`],{type:"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="appunti-pascoli.txt";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});

  const imageDialog=$("#imageDialog"), dialogImage=$("#dialogImage"), dialogCaption=$("#dialogCaption"); let zoom=1;
  $$(".image-open").forEach(btn=>btn.addEventListener("click",()=>{opener=btn;zoom=1;dialogImage.style.setProperty("--zoom",1);dialogImage.src=btn.dataset.image;dialogImage.alt=btn.dataset.alt||$("img",btn)?.alt||"";dialogCaption.textContent=dialogImage.alt;imageDialog.showModal();}));
  $$("[data-zoom]").forEach(btn=>btn.addEventListener("click",()=>{zoom=btn.dataset.zoom==="reset"?1:Math.min(3,Math.max(.6,zoom+(btn.dataset.zoom==="+" ? .2 : -.2)));dialogImage.style.setProperty("--zoom",zoom);}));

  const symbols={nido:"Protegge e raccoglie, ma può chiudere. In X agosto il nido, anziché salvare, attende.",uccelli:"Creature fragili e voci naturali. La rondine uccisa rende universale la storia del padre.",fiori:"Sensualità, fecondità, pericolo e morte. Gelsomino e digitale cambiano valore secondo il contesto.",notte:"Spazio del mistero e della distanza. Le stelle possono sembrare pianto senza offrire risposta.",suoni:"Campane, gridi e richiami attraversano soglie. Il paesaggio diventa ascolto e memoria."};
  $$("[data-symbol]").forEach(btn=>btn.addEventListener("click",()=>{$$("[data-symbol]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$("#symbolOutput").textContent=symbols[btn.dataset.symbol];}));
  const years={1855:"Nasce a San Mauro: formazione classica e futuro rapporto con il paesaggio rurale.",1867:"L’assassinio di Ruggero spezza l’ordine familiare e diventa il nucleo storico di X agosto.",1871:"La morte di Luigi appartiene alla sequenza di perdite, non va confusa con quella del padre.",1891:"Prima edizione di Myricae: la piccola cosa e il frammento entrano al centro della poesia.",1897:"Prima pubblicazione del Fanciullino; X agosto entra nella quarta edizione di Myricae.",1903:"Canti di Castelvecchio e forma in volume del Fanciullino consolidano poetica e rete simbolica.",1912:"Pascoli muore a Bologna: lascia una modernità fatta di tradizione incrinata e ascolto intermittente."};
  $$("[data-year]").forEach(btn=>btn.addEventListener("click",()=>{$$("[data-year]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$("#timelineOutput").textContent=years[btn.dataset.year];}));

  const lessons=$$(".lesson"), navLinks=$$(".path-index a[href^='#']");
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;navLinks.forEach(a=>{const active=a.hash===`#${id}`;a.classList.toggle("active",active);active?a.setAttribute("aria-current","step"):a.removeAttribute("aria-current");});safeSet("last",id);safeSet("progress",Math.max(safeGet("progress",0),steps.indexOf(id)+1));}});},{rootMargin:"-28% 0px -62% 0px"});
  lessons.forEach(s=>observer.observe(s));
  $("#resumeBtn").addEventListener("click",()=>document.getElementById(safeGet("last","mondo"))?.scrollIntoView());
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;$("#readingBar").style.width=`${max?scrollY/max*100:0}%`;document.body.classList.toggle("cover-visible",scrollY<$("#home").offsetHeight-120);};
  addEventListener("scroll",updateScroll,{passive:true});updateScroll();
  addEventListener("keydown",e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;const current=location.hash.slice(1),i=steps.indexOf(current);const next=e.key==="ArrowRight"?Math.min(steps.length-1,i<0?0:i+1):Math.max(0,i<0?0:i-1);location.hash=steps[next];});
  if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
})();
