(() => {
  'use strict';
  const course = window.PASOLINI_COURSE;
  const KEY = 'gbprof-pasolini-v1';
  const defaultState = {completed:[], lastSection:'mondo', notes:{}, attempts:{}};
  let state = loadState();
  let deferredInstall = null;

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const esc = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const nowLabel = () => new Intl.DateTimeFormat('it-IT',{dateStyle:'short',timeStyle:'short'}).format(new Date());

  function loadState(){
    try { return {...defaultState, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; }
    catch { return {...defaultState}; }
  }
  function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); updateProgress(); }
  function getSection(id){ return course.find(s => s.id === id) || course[0]; }

  function init(){
    buildNavigation();
    buildRouteCards();
    bindShell();
    updateProgress();
    route();
    window.addEventListener('hashchange', route);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  function buildNavigation(){
    $('#sectionNav').innerHTML = course.map(s => `<li><button type="button" data-go="${s.id}"><span>${esc(s.title)}</span></button></li>`).join('');
    $$('#sectionNav button').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.go)));
  }
  function buildRouteCards(){
    $('#routeCards').innerHTML = course.map(s => `<li><span class="route-num">${s.number}</span><h3>${esc(s.title)}</h3><p>${esc(s.hook)}</p><button type="button" data-go="${s.id}" aria-label="Apri ${esc(s.title)}">Esplora</button></li>`).join('');
    $$('#routeCards button').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.go)));
  }
  function bindShell(){
    $('#startBtn').addEventListener('click', () => go('mondo'));
    [$('#resumeBtn'), $('#homeResumeBtn')].forEach(btn => btn.addEventListener('click', () => go(state.lastSection || 'mondo')));
    $('#menuBtn').addEventListener('click', toggleMenu);
    $('#exportBtn').addEventListener('click', exportData);
    $('#resetBtn').addEventListener('click', () => $('#confirmDialog').showModal());
    $('#confirmReset').addEventListener('click', () => { localStorage.removeItem(KEY); state = {...defaultState}; location.hash = '#home'; setTimeout(() => location.reload(), 30); });
    $('#installBtn').addEventListener('click', async () => {
      if (deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; }
      else $('#installDialog').showModal();
    });
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
    document.addEventListener('click', e => {
      if (innerWidth <= 900 && !e.target.closest('#courseNav') && !e.target.closest('#menuBtn')) closeMenu();
    });
  }
  function toggleMenu(){
    const open = $('#courseNav').classList.toggle('open');
    $('#menuBtn').setAttribute('aria-expanded', String(open));
  }
  function closeMenu(){ $('#courseNav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded','false'); }
  function go(id){ location.hash = `#${id}`; }

  function route(){
    const id = location.hash.replace('#','') || 'home';
    if (id === 'home') showHome(); else renderSection(getSection(id));
    closeMenu();
    scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function showHome(){
    $('#homeView').hidden = false; $('#lessonView').hidden = true;
    $$('#sectionNav button').forEach(b => b.removeAttribute('aria-current'));
    document.title = 'Pasolini · Lo scandalo di restare umani';
  }

  function renderSection(section){
    state.lastSection = section.id; saveState();
    $('#homeView').hidden = true; $('#lessonView').hidden = false;
    document.title = `${section.title} · Pasolini`;
    $$('#sectionNav button').forEach(b => b.setAttribute('aria-current', b.dataset.go === section.id ? 'page' : 'false'));
    const idx = course.indexOf(section);
    const panels = [
      ['lezione','Lezione',lessonPanel(section)],
      ['sintesi','Sintesi',summaryPanel(section)],
      ['saperi','Saperi',essentialsPanel(section)],
      ['vocabolario','Vocabolario',vocabPanel(section)],
      ['mappa','Mappa',mapPanel(section)],
      ['test','Test',testPanel(section)],
      ['appunti','Appunti',notesPanel(section)]
    ];
    $('#lessonView').innerHTML = `
      <header class="lesson-header">
        <span class="section-kicker">Movimento ${section.number} · ${esc(section.short)}</span>
        <h1>${esc(section.title)}</h1>
        <p class="section-question">${esc(section.question)}</p>
      </header>
      <div class="lesson-tabs" role="tablist" aria-label="Materiali della sezione">
        ${panels.map((p,i)=>`<button id="tab-${p[0]}" type="button" role="tab" aria-selected="${i===0}" aria-controls="panel-${p[0]}" data-panel="${p[0]}">${p[1]}</button>`).join('')}
      </div>
      ${panels.map((p,i)=>`<section id="panel-${p[0]}" class="panel" role="tabpanel" aria-labelledby="tab-${p[0]}" ${i?'hidden':''}>${p[2]}</section>`).join('')}
      <div class="lesson-actions"><button class="complete-btn ${state.completed.includes(section.id)?'done':''}" type="button">${state.completed.includes(section.id)?'✓ Movimento completato':'Segna come completato'}</button></div>
      <nav class="lesson-next" aria-label="Navigazione tra movimenti">
        <button type="button" data-prev="${idx>0?course[idx-1].id:'home'}">← ${idx>0?esc(course[idx-1].title):'Indice'}</button>
        <span>${idx+1} / ${course.length}</span>
        <button type="button" data-next="${idx<course.length-1?course[idx+1].id:'home'}">${idx<course.length-1?esc(course[idx+1].title):'Torna all’indice'} →</button>
      </nav>`;
    bindSection(section);
    $('#main').focus({preventScroll:true});
  }

  function lessonPanel(s){ return `<div class="lesson-copy"><h2 class="panel-title">${esc(s.hook)}</h2>${s.lesson.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`; }
  function summaryPanel(s){ return `<h2 class="panel-title">Il percorso in breve</h2><div class="summary-card"><p>${esc(s.summary)}</p></div>`; }
  function essentialsPanel(s){ return `<h2 class="panel-title">Saperi irrinunciabili</h2><p>Al termine devi saper spiegare, non soltanto riconoscere, questi nuclei.</p><div class="essentials-grid">${s.essentials.map((x,i)=>`<div class="essential-card"><strong>${i+1}. ${esc(x[0])}</strong><span>${esc(x[1])}</span></div>`).join('')}</div>`; }
  function vocabPanel(s){ return `<h2 class="panel-title">Vocabolario essenziale</h2><dl class="vocab-list">${s.vocab.map(x=>`<div class="vocab-card"><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('')}</dl>`; }
  function mapPanel(s){ return `<h2 class="panel-title">Mappa concettuale</h2><figure><div class="map-frame"><img src="${s.map}" alt="${esc(s.mapAlt)}" width="1200" height="760" loading="lazy"></div><figcaption class="map-caption">${esc(s.mapAlt)}</figcaption></figure>`; }
  function notesPanel(s){ return `<h2 class="panel-title">Taccuino personale</h2><p>Le note restano su questo dispositivo e vengono incluse nell’esportazione.</p><label for="notes-${s.id}">Appunti su ${esc(s.title)}</label><textarea id="notes-${s.id}" class="notes-area" placeholder="Scrivi qui collegamenti, dubbi, esempi…">${esc(state.notes[s.id]||'')}</textarea><p class="save-state" role="status">Salvataggio automatico locale.</p>`; }
  function testPanel(s){
    return `<h2 class="panel-title">Verifica del movimento</h2><p>Ogni risposta riceve subito una spiegazione. Il voto usa la formula: <strong>voto = max(1, arrotonda(percentuale × 10))</strong>. Il recupero riguarda soltanto gli errori.</p>
      <form class="test-form" data-section="${s.id}">${s.questions.map((q,i)=>questionMarkup(q,i,'main')).join('')}
      <div class="test-actions"><button class="primary-btn submit-test" type="submit">Concludi e calcola il voto</button></div><p class="test-alert" role="alert"></p></form><div class="test-result" aria-live="polite"></div>`;
  }
  function questionMarkup(q,i,prefix){
    return `<div class="question-card" data-q="${i}"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${prefix}-q${i}" value="${j}"><span><strong>${String.fromCharCode(65+j)}.</strong> ${esc(o)}</span></label>`).join('')}<div class="feedback" hidden></div></fieldset></div>`;
  }

  function bindSection(section){
    $$('.lesson-tabs button').forEach(btn => btn.addEventListener('click', () => selectPanel(btn.dataset.panel)));
    $('.complete-btn').addEventListener('click', e => {
      const i = state.completed.indexOf(section.id);
      if (i >= 0) state.completed.splice(i,1); else state.completed.push(section.id);
      saveState(); e.currentTarget.classList.toggle('done', state.completed.includes(section.id));
      e.currentTarget.textContent = state.completed.includes(section.id) ? '✓ Movimento completato' : 'Segna come completato';
    });
    $('[data-prev]').addEventListener('click', e => go(e.currentTarget.dataset.prev));
    $('[data-next]').addEventListener('click', e => go(e.currentTarget.dataset.next));
    const notes = $(`#notes-${section.id}`);
    notes.addEventListener('input', () => { state.notes[section.id] = notes.value; saveState(); $('.save-state').textContent='Salvato ora su questo dispositivo.'; });
    bindTest(section);
  }
  function selectPanel(id){
    $$('.lesson-tabs button').forEach(b => b.setAttribute('aria-selected',String(b.dataset.panel===id)));
    $$('.panel').forEach(p => p.hidden = p.id !== `panel-${id}`);
    $(`#panel-${id}`).focus?.({preventScroll:true});
  }

  function bindTest(section){
    const form = $('.test-form');
    form.addEventListener('change', e => {
      if (!e.target.matches('input[type=radio]')) return;
      const card = e.target.closest('.question-card'); const i = Number(card.dataset.q); const q = section.questions[i]; const val = Number(e.target.value);
      const feedback = $('.feedback',card); feedback.hidden=false; feedback.classList.toggle('wrong',val!==q.answer);
      feedback.innerHTML = `<strong>${val===q.answer?'Corretto.':'Da rivedere.'}</strong> ${esc(q.explanation)}`;
    });
    form.addEventListener('submit', e => {
      e.preventDefault(); const answers = section.questions.map((q,i)=>form.elements[`main-q${i}`].value);
      if (answers.some(v=>v==='')) { $('.test-alert').textContent='Rispondi a tutte le domande prima di calcolare il voto.'; return; }
      $('.test-alert').textContent='';
      const wrong = answers.map((v,i)=>Number(v)===section.questions[i].answer?null:i).filter(v=>v!==null);
      const score = section.questions.length-wrong.length; const percent=Math.round(score/section.questions.length*100); const vote=Math.max(1,Math.round(percent/10));
      recordAttempt(section.id,{date:nowLabel(),type:'Test',score,total:section.questions.length,percent,vote,wrong});
      renderResult(section,{score,percent,vote,wrong});
    });
  }
  function recordAttempt(id, attempt){ state.attempts[id] = state.attempts[id] || []; state.attempts[id].push(attempt); saveState(); }
  function renderResult(section,result){
    const host=$('.test-result'); const perfect=result.wrong.length===0;
    host.innerHTML=`<div class="result-card"><div class="score-big">${result.vote}/10</div><p>${result.score}/${section.questions.length} risposte corrette · ${result.percent}%</p>
      ${perfect?'<h3>Connessioni consolidate</h3><p>Non risultano errori in questo tentativo.</p>':`<h3>Errori da riparare: ${result.wrong.length}</h3><div class="recovery-list">${result.wrong.map(i=>recoveryMarkup(section.questions[i],i)).join('')}</div><button class="primary-btn start-retest" type="button">Rifai soltanto le domande sbagliate</button><div class="retest-area"></div>`}
      ${attemptHistory(section.id)}</div>`;
    if (!perfect) $('.start-retest',host).addEventListener('click',()=>renderRetest(section,result.wrong));
    host.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function recoveryMarkup(q,i){ const r=q.recovery; return `<article class="recovery-card"><h4>${esc(r.concept)}</h4><p><strong>Chiarimento.</strong> ${esc(r.clarification)}</p><p><strong>Esempio dalla lezione.</strong> ${esc(r.example)}</p><p><strong>Nesso da recuperare.</strong> Domanda ${i+1}: ${esc(q.explanation)}</p></article>`; }
  function renderRetest(section,wrong){
    const host=$('.retest-area');
    host.innerHTML=`<form class="retest-form"><h3>Verifica di recupero</h3>${wrong.map((qi,k)=>{const c=section.questions[qi].recovery.check;return `<div class="question-card"><fieldset><legend>${k+1}. ${esc(c[0])}</legend>${c.slice(1,3).map((o,j)=>`<label class="option"><input type="radio" name="re-q${qi}" value="${j}"><span>${esc(o)}</span></label>`).join('')}</fieldset></div>`}).join('')}<button class="primary-btn" type="submit">Verifica i nessi recuperati</button><p class="test-alert" role="alert"></p></form>`;
    $('.retest-form',host).addEventListener('submit',e=>{
      e.preventDefault(); const form=e.currentTarget; const vals=wrong.map(qi=>form.elements[`re-q${qi}`].value);
      if(vals.some(v=>v==='')){ $('.test-alert',form).textContent='Completa tutte le domande di recupero.'; return; }
      const recovered=wrong.filter((qi,k)=>Number(vals[k])===section.questions[qi].recovery.check[3]).length;
      const percent=Math.round(recovered/wrong.length*100); const vote=Math.max(1,Math.round(percent/10));
      recordAttempt(section.id,{date:nowLabel(),type:'Recupero',score:recovered,total:wrong.length,percent,vote,wrong:wrong.filter((qi,k)=>Number(vals[k])!==section.questions[qi].recovery.check[3])});
      host.innerHTML=`<div class="recovery-card"><h4>Risultato aggiornato</h4><p>Hai recuperato <strong>${recovered} nessi su ${wrong.length}</strong>. Il tentativo iniziale resta nello storico; questo recupero è stato aggiunto senza cancellarlo.</p>${recovered<wrong.length?'<p>Rileggi le mini-lezioni relative ai nessi ancora incerti e riprova il test completo quando vuoi.</p>':'<p>Tutti gli errori del tentativo sono stati riparati.</p>'}</div>`;
      const old=$('.attempts'); if(old) old.outerHTML=attemptHistory(section.id);
    });
    host.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function attemptHistory(id){
    const items=state.attempts[id]||[];
    if(!items.length) return '';
    return `<div class="attempts"><h3>Storico dei tentativi</h3><ol>${items.slice().reverse().map(a=>`<li><strong>${esc(a.type)}</strong> · ${esc(a.date)} · ${a.score}/${a.total} (${a.percent}%, voto ${a.vote}/10)</li>`).join('')}</ol></div>`;
  }

  function updateProgress(){
    const n=state.completed.length, pct=Math.round(n/course.length*100);
    $('#progressBar').style.width=`${pct}%`; $('#progressBar').setAttribute('aria-valuenow',String(pct));
    $('#progressText').textContent=`${n} di ${course.length} movimenti completati`;
    $$('#sectionNav button').forEach(b=>b.classList.toggle('done',state.completed.includes(b.dataset.go)));
  }
  function exportData(){
    const lines=['PASOLINI · Appunti e progressi','',`Movimenti completati: ${state.completed.length}/${course.length}`,''];
    course.forEach(s=>{ lines.push(`${s.number} · ${s.title}`,state.notes[s.id]||'(nessun appunto)',''); const a=state.attempts[s.id]||[]; if(a.length){lines.push('Tentativi:'); a.forEach(x=>lines.push(`- ${x.date}, ${x.type}: ${x.score}/${x.total}, voto ${x.vote}/10`)); lines.push('');}});
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='pasolini-appunti-progressi.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  init();
})();
