(() => {
  'use strict';
  const data = window.ERMETISMO_CONTENT;
  const KEY = 'ermetismo-study-v1';
  const defaultState = { current: 0, completed: [], notes: '', theme: 'light', attempts: {} };
  let state;
  try { state = { ...defaultState, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { state = { ...defaultState }; }

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const content = $('#sectionContent');
  const studyArea = $('#studyArea');
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  const notesPanel = $('#notesPanel');
  let currentTab = 'lesson';
  let retestOnly = null;

  function persist() { localStorage.setItem(KEY, JSON.stringify(state)); updateProgress(); }
  function esc(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }

  function makeRoute() {
    $('#routeGrid').innerHTML = data.sections.map((s,i)=>`
      <button class="route-card" data-open-section="${i}">
        <span class="number">${s.number}</span>
        <span><h3>${s.shortTitle}</h3><p>${s.thesis}</p></span>
        <span class="arrow" aria-hidden="true">↗</span>
      </button>`).join('');
    $('#sectionNav').innerHTML = data.sections.map((s,i)=>`
      <button class="nav-item ${i===state.current?'current':''}" data-open-section="${i}">
        <span class="nav-num">${s.number}</span><span>${s.shortTitle}</span>
        <span class="nav-check" aria-label="${state.completed.includes(i)?'completata':'non completata'}">${state.completed.includes(i)?'●':'○'}</span>
      </button>`).join('');
  }

  function lessonPanel(s) {
    const headings = [...s.lesson.matchAll(/<h3 id="([^"]+)">([^<]+)<\/h3>/g)];
    return `<div class="lesson-layout"><article class="lesson-copy">${s.lesson}<div class="bridge"><strong>Ponte:</strong> ${s.bridge}</div></article>
      <nav class="side-index" aria-label="Snodi della lezione"><strong>Dentro la lezione</strong>${headings.map(h=>`<a href="#${h[1]}">${h[2]}</a>`).join('')}</nav></div>`;
  }

  function summaryPanel(s) { return `<article class="summary-card"><p class="eyebrow">In circa due minuti</p><h3>Sintesi</h3><p>${s.summary}</p></article>`; }
  function knowledgePanel(s) { return `<section class="knowledge-card"><p class="eyebrow">Ciò che deve restare</p><h3>Saperi irrinunciabili</h3><div class="knowledge-grid">${s.knowledge.map((x,i)=>`<div class="knowledge-item"><span>${String(i+1).padStart(2,'0')}</span><p>${x}</p></div>`).join('')}</div></section>`; }
  function vocabPanel(s) { return `<section class="vocab-card"><p class="eyebrow">Parole per pensare</p><h3>Vocabolario essenziale</h3><dl class="vocab-list">${s.vocab.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl></section>`; }
  function mapPanel(s) { return `<figure class="map-card"><p class="eyebrow">Relazioni visive</p><h3>Mappa concettuale</h3><img src="${s.map}" alt="${esc(s.mapAlt)}"><figcaption class="map-caption">La mappa non sostituisce la lezione: rende visibile il nesso che la sostiene.</figcaption></figure>`; }

  function quizPanel(s, indexes = null) {
    const chosen = indexes || s.quiz.map((_,i)=>i);
    return `<section class="quiz-card" data-section="${s.id}">
      <p class="eyebrow">Verifica formativa</p><h3>${indexes?'Recupera soltanto gli errori':'Test della sezione'}</h3>
      <p>Una sola risposta corretta per domanda. Il risultato e i tentativi restano salvati sul dispositivo.</p>
      <form id="quizForm">${chosen.map((qi,pos)=>{const q=s.quiz[qi];return `<fieldset class="question" data-q="${qi}"><legend>${pos+1}. ${q.q}</legend>${q.o.map((o,oi)=>`<label class="option"><input type="radio" name="q${qi}" value="${oi}"><span><strong>${String.fromCharCode(65+oi)}.</strong> ${o}</span></label>`).join('')}</fieldset>`}).join('')}
        <button class="button primary" type="submit">Correggi il test</button>
      </form><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div></section>`;
  }

  function renderSection(index, tab = currentTab) {
    state.current = Math.max(0, Math.min(index, data.sections.length-1));
    currentTab = tab;
    retestOnly = null;
    persist(); makeRoute();
    const s=data.sections[state.current];
    const tabs=[['lesson','Lezione'],['summary','Sintesi'],['knowledge','Saperi'],['vocab','Vocabolario'],['map','Mappa'],['quiz','Test']];
    content.innerHTML=`
      <header class="lesson-head" data-num="${s.number}"><p class="eyebrow">${s.kicker}</p><h2>${s.title}</h2><p class="generative"><strong>Domanda generatrice:</strong> ${s.question}</p></header>
      <div class="tabbar" role="tablist" aria-label="Materiali della sezione">${tabs.map(t=>`<button role="tab" aria-selected="${t[0]===tab}" class="${t[0]===tab?'active':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}</div>
      <div class="panel ${tab==='lesson'?'active':''}" data-panel="lesson">${lessonPanel(s)}</div>
      <div class="panel ${tab==='summary'?'active':''}" data-panel="summary">${summaryPanel(s)}</div>
      <div class="panel ${tab==='knowledge'?'active':''}" data-panel="knowledge">${knowledgePanel(s)}</div>
      <div class="panel ${tab==='vocab'?'active':''}" data-panel="vocab">${vocabPanel(s)}</div>
      <div class="panel ${tab==='map'?'active':''}" data-panel="map">${mapPanel(s)}</div>
      <div class="panel ${tab==='quiz'?'active':''}" data-panel="quiz">${quizPanel(s)}</div>
      <div class="section-actions"><button class="button secondary" data-prev ${state.current===0?'disabled':''}>← Precedente</button><button class="button secondary" data-next>${state.current===data.sections.length-1?'Torna all’inizio':'Successiva →'}</button></div>`;
    studyArea.hidden=false;
    bindSection();
  }

  function setTab(name) {
    currentTab=name;
    $$('.tabbar button',content).forEach(b=>{const active=b.dataset.tab===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',active)});
    $$('.panel',content).forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
  }

  function bindSection() {
    $$('.tabbar button',content).forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
    $('[data-prev]',content).addEventListener('click',()=>{renderSection(state.current-1);scrollToStudy()});
    $('[data-next]',content).addEventListener('click',()=>{if(state.current===data.sections.length-1){window.scrollTo({top:0,behavior:'smooth'})}else{renderSection(state.current+1);scrollToStudy()}});
    bindQuiz();
  }

  function bindQuiz() {
    const form=$('#quizForm',content); if(!form)return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const s=data.sections[state.current];
      const fields=$$('.question',form);
      const missing=fields.filter(f=>!$(`input:checked`,f));
      if(missing.length){missing[0].scrollIntoView({behavior:'smooth',block:'center'});toast(`Completa ancora ${missing.length} ${missing.length===1?'risposta':'risposte'}`);return;}
      const wrong=[]; const answers=[];
      fields.forEach(f=>{const qi=Number(f.dataset.q);const selected=Number($('input:checked',f).value);answers.push({qi,selected});if(selected!==s.quiz[qi].a)wrong.push(qi)});
      const correct=fields.length-wrong.length; const percentage=Math.round(correct/fields.length*100); const grade=Math.max(1,Math.round(percentage/10));
      const attempt={date:new Date().toISOString(),mode:retestOnly?'recupero':'completo',correct,total:fields.length,percentage,grade,answers};
      state.attempts[s.id]=[...(state.attempts[s.id]||[]),attempt];
      if(!retestOnly && wrong.length===0 && !state.completed.includes(state.current))state.completed.push(state.current);
      if(retestOnly && wrong.length===0 && !state.completed.includes(state.current))state.completed.push(state.current);
      persist(); makeRoute();
      showFeedback(s,wrong,correct,fields.length,percentage,grade);
    });
  }

  function showFeedback(s,wrong,correct,total,percentage,grade){
    const fb=$('#quizFeedback',content);
    let html=`<div class="result-box"><div class="result-score">${correct}/${total} · ${percentage}% · voto ${grade}/10</div><p class="formula">Formula: percentuale = risposte corrette ÷ domande × 100; voto = max(1, arrotonda(percentuale ÷ 10)).</p></div>`;
    if(!wrong.length){html+=`<div class="mistake correct-note"><h4>Nesso ricostruito</h4><p>Tutte le risposte sono corrette. La sezione è segnata come completata.</p></div>`;}
    else {
      html+=`<h3>Recupero mirato</h3><p>Qui compaiono soltanto gli errori. Ogni scheda ripara un nesso preciso.</p>`;
      wrong.forEach(qi=>{const q=s.quiz[qi],r=q.r;html+=`<article class="mistake"><h4>${r[0]}</h4><p><strong>Chiarimento.</strong> ${r[1]}</p><p><strong>Esempio.</strong> ${r[2]}</p><p><strong>Per controllarti.</strong> ${r[3]}</p><p><strong>Perché la risposta corretta è corretta.</strong> ${q.e}</p></article>`});
      html+=`<div class="quiz-actions"><button class="button primary" id="retryWrong">Rifai solo le ${wrong.length} ${wrong.length===1?'domanda sbagliata':'domande sbagliate'}</button><button class="button secondary" id="retryAll">Rifai tutto il test</button></div>`;
    }
    fb.innerHTML=html; fb.scrollIntoView({behavior:'smooth',block:'start'});
    const rw=$('#retryWrong',fb); if(rw)rw.addEventListener('click',()=>{retestOnly=[...wrong];const panel=$('[data-panel="quiz"]',content);panel.innerHTML=quizPanel(s,retestOnly);bindQuiz();panel.scrollIntoView({behavior:'smooth',block:'start'})});
    const ra=$('#retryAll',fb); if(ra)ra.addEventListener('click',()=>renderSection(state.current,'quiz'));
  }

  function scrollToStudy(){studyArea.scrollIntoView({behavior:'smooth',block:'start'});}
  function openSection(index){renderSection(Number(index),'lesson');closeDrawer();setTimeout(scrollToStudy,30)}
  function updateProgress(){const pct=Math.round(state.completed.length/data.sections.length*100);$('#progressBar').style.width=`${pct}%`;$('#progressBar').parentElement.setAttribute('aria-label',`Progresso di studio: ${pct}%`)}
  function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');$('#menuButton').setAttribute('aria-expanded','true');scrim.hidden=false;}
  function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');$('#menuButton').setAttribute('aria-expanded','false');scrim.hidden=true;}
  function openNotes(){notesPanel.classList.add('open');notesPanel.setAttribute('aria-hidden','false');scrim.hidden=false;$('#notesArea').value=state.notes;setTimeout(()=>$('#notesArea').focus(),250)}
  function closeNotes(){notesPanel.classList.remove('open');notesPanel.setAttribute('aria-hidden','true');scrim.hidden=true;}

  document.addEventListener('click',e=>{const b=e.target.closest('[data-open-section]');if(b)openSection(b.dataset.openSection)});
  $('#menuButton').addEventListener('click',openDrawer); $('#closeMenu').addEventListener('click',closeDrawer);
  $('#notesButton').addEventListener('click',openNotes); $('#closeNotes').addEventListener('click',closeNotes);
  scrim.addEventListener('click',()=>{closeDrawer();closeNotes()});
  $('#resumeButton').addEventListener('click',()=>openSection(state.current));
  $('#themeButton').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';document.body.classList.toggle('dark',state.theme==='dark');persist()});
  $('#saveNotes').addEventListener('click',()=>{state.notes=$('#notesArea').value;persist();$('#saveStatus').textContent='Appunti salvati.';toast('Appunti salvati')});
  $('#exportNotes').addEventListener('click',()=>{const blob=new Blob([`APPUNTI · ERMETISMO\n\n${$('#notesArea').value}`],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='appunti-ermetismo.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
  $('#resetButton').addEventListener('click',()=>{if(confirm('Vuoi cancellare progressi, risultati e appunti salvati su questo dispositivo?')){state={...defaultState};localStorage.removeItem(KEY);document.body.classList.remove('dark');makeRoute();updateProgress();studyArea.hidden=true;closeDrawer();toast('Dati azzerati')}});
  $('#openOverview').addEventListener('click',()=>$('#overviewDialog').showModal());
  $('.dialog-close').addEventListener('click',()=>$('#overviewDialog').close());
  $('#overviewDialog').addEventListener('click',e=>{if(e.target===$('#overviewDialog'))e.target.close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeNotes()}});

  document.body.classList.toggle('dark',state.theme==='dark');
  makeRoute(); updateProgress();
  if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
