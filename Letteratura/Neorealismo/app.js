(() => {
  "use strict";
  const COURSE = window.NEOREALISMO_DATA;
  const STORAGE_KEY = "gbprof-neorealismo-v1";
  const TABS = [["lesson","Lezione"],["summary","Sintesi"],["essentials","Saperi"],["vocabulary","Vocabolario"],["map","Mappa"],["quiz","Test"]];
  const DEFAULT = {lastSection:0,visited:[],notes:{},quizzes:{}};
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const els = {
    cover:$("#coverView"),lesson:$("#lessonView"),final:$("#finalView"),drawer:$("#drawer"),scrim:$("#scrim"),
    nav:$("#drawerNav"),route:$("#coverRoute"),tabs:$("#sectionTabs"),panel:$("#panelContent"),notes:$("#sectionNotes"),
    save:$("#saveStatus"),line:$("#readingLine"),bar:$("#courseBar"),courseText:$("#courseText")
  };
  let state = loadState();
  let activeSection = Math.min(state.lastSection || 0, COURSE.sections.length - 1);
  let activeTab = "lesson";
  let saveTimer;

  function loadState(){try{return {...DEFAULT,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")};}catch{return {...DEFAULT};}}
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateProgress();}
  function show(view){[els.cover,els.lesson,els.final].forEach(v=>v.classList.toggle("active",v===view));window.scrollTo({top:0,behavior:"smooth"});closeDrawer();}
  function openDrawer(){els.drawer.classList.add("open");els.drawer.setAttribute("aria-hidden","false");els.scrim.hidden=false;$("#menuButton").setAttribute("aria-expanded","true");$("#closeMenu").focus();}
  function closeDrawer(){els.drawer.classList.remove("open");els.drawer.setAttribute("aria-hidden","true");els.scrim.hidden=true;$("#menuButton").setAttribute("aria-expanded","false");}
  function renderNavigation(){
    els.route.innerHTML=COURSE.sections.map((s,i)=>`<li><button type="button" data-section="${i}"><b>${String(i+1).padStart(2,"0")}</b><span>${s.short}</span></button></li>`).join("");
    els.nav.innerHTML=COURSE.sections.map((s,i)=>`<button type="button" data-section="${i}"><span class="nav-number">${String(i+1).padStart(2,"0")}</span><span>${s.title}</span><span class="nav-check">${state.visited.includes(i)?"✓":""}</span></button>`).join("");
    $$('[data-section]',els.route).forEach(b=>b.addEventListener("click",()=>renderSection(Number(b.dataset.section),"lesson")));
    $$('[data-section]',els.nav).forEach(b=>b.addEventListener("click",()=>renderSection(Number(b.dataset.section),"lesson")));
    updateNavigation();
  }
  function updateNavigation(){
    $$('[data-section]',els.nav).forEach((b,i)=>{b.classList.toggle("active",i===activeSection&&els.lesson.classList.contains("active"));$(".nav-check",b).textContent=state.visited.includes(i)?"✓":"";});
  }
  function updateProgress(){
    const count=new Set(state.visited).size, pct=count/COURSE.sections.length*100;
    els.bar.style.width=`${pct}%`;els.courseText.textContent=`${count} di ${COURSE.sections.length} movimenti visitati`;
  }
  function renderTabs(){
    els.tabs.innerHTML=TABS.map(([id,label])=>`<button type="button" role="tab" data-tab="${id}" aria-selected="${id===activeTab}">${label}</button>`).join("");
    $$('[data-tab]',els.tabs).forEach(b=>b.addEventListener("click",()=>{activeTab=b.dataset.tab;renderTabs();renderPanel();}));
  }
  function renderSection(index,tab="lesson"){
    activeSection=index;activeTab=tab;state.lastSection=index;if(!state.visited.includes(index))state.visited.push(index);saveState();
    const s=COURSE.sections[index];$("#lessonHero").style.setProperty("--section-color",s.color);els.lesson.style.setProperty("--section-color",s.color);
    $("#sectionNumber").textContent=`Movimento ${String(index+1).padStart(2,"0")} · ${s.kicker}`;$("#sectionTitle").textContent=s.title;
    $("#sectionSubtitle").textContent=s.subtitle;$("#generativeQuestion").textContent=s.question;$("#sectionCounter").textContent=`${index+1} / ${COURSE.sections.length}`;
    $("#prevSection").disabled=index===0;$("#nextSection").textContent=index===COURSE.sections.length-1?"Verifica finale →":"Successiva →";
    els.notes.value=state.notes[s.id]||"";els.save.textContent="";renderTabs();renderPanel();show(els.lesson);updateNavigation();
  }
  function renderPanel(){
    const s=COURSE.sections[activeSection];
    if(activeTab==="lesson")els.panel.innerHTML=`<h2>${s.title}</h2>${s.lesson}<p class="bridge"><strong>Ponte:</strong> ${s.bridge}</p>`;
    if(activeTab==="summary")els.panel.innerHTML=`<h2>Sintesi</h2><div class="summary-panel">${s.summary}</div>`;
    if(activeTab==="essentials")els.panel.innerHTML=`<h2>Saperi irrinunciabili</h2><p>Al termine devi saper spiegare, non soltanto riconoscere, questi nuclei:</p><ol class="essentials-list">${s.essentials.map(x=>`<li>${x}</li>`).join("")}</ol>`;
    if(activeTab==="vocabulary")els.panel.innerHTML=`<h2>Vocabolario essenziale</h2><dl class="vocabulary">${s.vocabulary.map(x=>`<div class="term"><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl>`;
    if(activeTab==="map")els.panel.innerHTML=`<h2>Mappa concettuale</h2><figure class="map-figure"><img src="${s.map.src}" alt="${s.map.alt}" width="1200" height="760"><figcaption>${s.map.caption}</figcaption></figure>`;
    if(activeTab==="quiz"){els.panel.innerHTML="";renderQuiz(els.panel,`section-${activeSection}`,s.questions,s.questions.map((_,i)=>i),false);}
    bindAnchorLinks();window.scrollTo({top:0,behavior:"smooth"});
  }
  function quizState(id,total){
    if(!state.quizzes[id])state.quizzes[id]={correctStatus:Array(total).fill(null),attempts:[]};
    if(state.quizzes[id].correctStatus.length!==total)state.quizzes[id].correctStatus=Array(total).fill(null);
    return state.quizzes[id];
  }
  function renderQuiz(root,id,questions,indexes,isRecovery){
    root.innerHTML=`<div class="quiz"><div class="quiz-intro"><div><p class="eyebrow">${isRecovery?"Recupero mirato":"Autoverifica"}</p><h2>${isRecovery?"Riprova soltanto gli errori":"Controlla i nessi"}</h2></div><p>Tre alternative, una sola corretta.</p></div><div class="quiz-questions">${indexes.map((qi,pos)=>questionMarkup(questions[qi],qi,pos)).join("")}</div><div class="quiz-actions"><button class="primary-button submit-quiz" type="button">Consegna</button><p class="quiz-warning" role="alert"></p></div><section class="quiz-results" aria-live="polite" hidden></section></div>`;
    $(".submit-quiz",root).addEventListener("click",()=>submitQuiz(root,id,questions,indexes,isRecovery));
  }
  function questionMarkup(q,qi,pos){return `<article class="question-card"><fieldset><legend><span class="question-index">${pos+1}</span>${q.prompt}</legend><div class="options">${q.options.map((o,i)=>`<label class="option"><input type="radio" name="q-${qi}" value="${i}"><span class="option-letter">${String.fromCharCode(65+i)}.</span><span>${o}</span></label>`).join("")}</div><p class="answer-feedback" data-feedback="${qi}"></p></fieldset></article>`;}
  function submitQuiz(root,id,questions,indexes,isRecovery){
    const answers=indexes.map(qi=>{const chosen=$(`input[name="q-${qi}"]:checked`,root);return chosen?Number(chosen.value):null;});
    const warning=$(".quiz-warning",root);if(answers.some(a=>a===null)){warning.textContent="Rispondi a tutte le domande prima di consegnare.";return;}warning.textContent="";
    const qs=quizState(id,questions.length);
    indexes.forEach((qi,pos)=>{const ok=answers[pos]===questions[qi].correct;qs.correctStatus[qi]=ok;const f=$(`[data-feedback="${qi}"]`,root);f.className=`answer-feedback ${ok?"correct":"wrong"}`;f.textContent=`${ok?"Corretta.":"Non corretta."} ${questions[qi].explanation}`;});
    const score=qs.correctStatus.filter(Boolean).length,total=questions.length,percentage=Math.round(score/total*100),vote=Math.max(1,Math.round(score/total*10));
    const wrong=qs.correctStatus.map((ok,i)=>ok? -1:i).filter(i=>i>=0);qs.attempts.push({at:new Date().toISOString(),mode:isRecovery?"recupero":"completo",score,total,percentage,vote});saveState();
    const results=$(".quiz-results",root);results.hidden=false;results.innerHTML=`<p class="eyebrow">Risultato aggiornato</p><h3>${wrong.length?"Ci sono nessi da riparare":"Tutti i nessi sono saldi"}</h3><div class="score-grid"><div class="score-box"><strong>${score}/${total}</strong><span>risposte</span></div><div class="score-box"><strong>${percentage}%</strong><span>percentuale</span></div><div class="score-box"><strong>${vote}/10</strong><span>voto</span></div></div><p><small>Formula: voto = max(1, arrotonda(risposte corrette ÷ totale × 10)).</small></p>${wrong.length?`<h3>Errori e mini-lezioni di recupero</h3>${wrong.map(i=>recoveryMarkup(questions[i],i)).join("")}<button class="primary-button retry-button" type="button">Rifai solo ${wrong.length===1?"la domanda sbagliata":`le ${wrong.length} domande sbagliate`}</button>`:`<p><strong>Nessun errore da recuperare.</strong> Il tentativo resta nello storico.</p>`}<details class="attempt-history"><summary>Storico dei tentativi (${qs.attempts.length})</summary><ol>${qs.attempts.map(a=>`<li>${new Date(a.at).toLocaleString("it-IT")} · ${a.mode} · ${a.score}/${a.total} · ${a.vote}/10</li>`).join("")}</ol></details>`;
    if(wrong.length)$(".retry-button",results).addEventListener("click",()=>renderQuiz(root,id,questions,wrong,true));bindAnchorLinks();results.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function recoveryMarkup(q,i){return `<article class="recovery-card"><h4>${i+1}. ${q.recovery.concept}</h4><p><strong>Chiarimento:</strong> ${q.recovery.clarification}</p><p><strong>Esempio:</strong> ${q.recovery.example}</p><p><strong>Controllo:</strong> ${q.recovery.check}</p><p><a href="#${q.anchor}">Torna al punto esatto della lezione</a></p></article>`;}
  function bindAnchorLinks(){$$('a[href^="#"]',document).forEach(a=>{if(a.dataset.boundAnchor)return;a.dataset.boundAnchor="true";a.addEventListener("click",e=>{e.preventDefault();const id=a.getAttribute("href").slice(1);const si=COURSE.sections.findIndex(s=>s.lesson.includes(`id="${id}"`));if(si<0)return;renderSection(si,"lesson");requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}));});});}
  function renderFinal(){show(els.final);els.final.style.setProperty("--section-color",COURSE.final.color);$("#finalQuiz").style.setProperty("--section-color",COURSE.final.color);renderQuiz($("#finalQuiz"),"final",COURSE.final.questions,COURSE.final.questions.map((_,i)=>i),false);updateNavigation();}
  function exportNotes(){
    const body=COURSE.sections.map((s,i)=>`${i+1}. ${s.title}\n${state.notes[s.id]||"(nessun appunto)"}`).join("\n\n");
    const attempts=Object.entries(state.quizzes).map(([id,q])=>`${id}: ${q.attempts.length} tentativi`).join("\n");
    const blob=new Blob([`NEOREALISMO — APPUNTI E PROGRESSI\n\n${body}\n\nRISULTATI\n${attempts||"Nessun test svolto"}`],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="neorealismo-appunti.txt";a.click();URL.revokeObjectURL(url);
  }
  function updateReading(){const h=document.documentElement,den=h.scrollHeight-h.clientHeight,pct=den>0?h.scrollTop/den*100:0;els.line.style.width=`${pct}%`;}
  function bindEvents(){
    $("#menuButton").addEventListener("click",openDrawer);$("#closeMenu").addEventListener("click",closeDrawer);els.scrim.addEventListener("click",closeDrawer);
    [$("#brandButton"),$("#backToCover")].forEach(b=>b.addEventListener("click",()=>{show(els.cover);updateNavigation();}));
    $("#startButton").addEventListener("click",()=>renderSection(0));[$("#resumeButton"),$("#coverResume")].forEach(b=>b.addEventListener("click",()=>renderSection(state.lastSection||0)));
    $("#prevSection").addEventListener("click",()=>activeSection>0&&renderSection(activeSection-1));$("#nextSection").addEventListener("click",()=>activeSection<COURSE.sections.length-1?renderSection(activeSection+1):renderFinal());
    $("#finalQuizButton").addEventListener("click",renderFinal);$("#finalBack").addEventListener("click",()=>renderSection(activeSection));
    $("#installButton").addEventListener("click",()=>$("#installDialog").showModal());$("#resetButton").addEventListener("click",()=>$("#resetDialog").showModal());
    $("#confirmReset").addEventListener("click",()=>{localStorage.removeItem(STORAGE_KEY);state={...DEFAULT,visited:[],notes:{},quizzes:{}};activeSection=0;renderNavigation();updateProgress();show(els.cover);});
    $("#exportButton").addEventListener("click",exportNotes);
    els.notes.addEventListener("input",()=>{state.notes[COURSE.sections[activeSection].id]=els.notes.value;clearTimeout(saveTimer);els.save.textContent="Salvataggio…";saveTimer=setTimeout(()=>{saveState();els.save.textContent="Salvato sul dispositivo";},350);});
    window.addEventListener("scroll",updateReading,{passive:true});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer();});
  }
  renderNavigation();updateProgress();bindEvents();updateReading();
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();
