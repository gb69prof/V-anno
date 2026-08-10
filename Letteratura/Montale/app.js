(() => {
  'use strict';
  const DATA = window.MONTALE_DATA;
  const KEY = 'montale-pwa-v1';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const safeState = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  };
  let state = Object.assign({current:0,completed:[],notes:{},attempts:{},fontSize:100,focus:false}, safeState());
  let current = Math.min(state.current || 0, DATA.sections.length - 1);
  let toastTimer;

  const els = {
    drawer:$('#drawer'),scrim:$('#scrim'),nav:$('#sectionNav'),route:$('#routeList'),workspace:$('#workspace'),hero:$('#sectionHero'),
    progressText:$('#progressText'),progressBar:$('#progressBar'),sources:$('#sources'),sourceCards:$('#sourceCards'),settings:$('#settingsDialog')
  };
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const esc = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toast = text => { const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2200); };

  function buildNavigation(){
    els.nav.innerHTML = DATA.sections.map((s,i)=>`<button type="button" data-section="${i}"><span>${s.number}</span><span>${esc(s.title)}</span><span aria-hidden="true">${state.completed.includes(s.id)?'✓':'→'}</span></button>`).join('');
    els.route.innerHTML = DATA.sections.map((s,i)=>`<li><span class="num">${s.number}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.subtitle)}</p></div><button type="button" data-section="${i}" aria-label="Apri ${esc(s.title)}">→</button></li>`).join('');
    $$('[data-section]').forEach(b=>b.addEventListener('click',()=>openSection(Number(b.dataset.section))));
    updateProgress();
  }
  function buildSources(){
    els.sourceCards.innerHTML = DATA.sources.map(s=>`<article class="source-card"><span class="tag">${esc(s.kind)}</span><h3>${esc(s.title)}</h3><p>${esc(s.note)}</p><a href="${s.url}" target="_blank" rel="noopener">Apri la fonte <span aria-hidden="true">↗</span></a></article>`).join('');
  }
  function updateProgress(){
    const n=state.completed.length,p=Math.round(n/DATA.sections.length*100);
    els.progressText.textContent=`${n} di ${DATA.sections.length} completate`;
    els.progressBar.style.width=`${p}%`;
    els.progressBar.parentElement.setAttribute('aria-label',`Progresso ${p}%`);
  }
  function setDrawer(open){
    els.drawer.classList.toggle('open',open);els.drawer.setAttribute('aria-hidden',String(!open));$('#menuButton').setAttribute('aria-expanded',String(open));els.scrim.hidden=!open;
  }
  function openSection(index){
    current=Math.max(0,Math.min(index,DATA.sections.length-1)); state.current=current; save(); setDrawer(false); els.sources.hidden=true; els.workspace.hidden=false; renderSection(); els.workspace.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderSection(){
    const s=DATA.sections[current];
    els.hero.innerHTML=`<span class="kicker">Movimento ${s.number} · ${current+1} di ${DATA.sections.length}</span><h1>${esc(s.title)}</h1><p>${esc(s.question)}</p><span class="bridge">Ponte → ${esc(s.bridge)}</span>`;
    $('#panel-lesson').innerHTML=s.lesson.map(block=>`<section class="anchor" id="${block.id}"><h2>${esc(block.title)}</h2>${block.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')+`<aside class="callout"><strong>Passaggio alla sezione successiva</strong><br>${esc(s.bridge)}</aside>`;
    $('#panel-summary').innerHTML=`<div class="summary-box"><h2>La sezione in sintesi</h2><p>${esc(s.summary)}</p></div>`;
    $('#panel-essentials').innerHTML=`<div class="two-col"><article class="card"><h2>Saperi irrinunciabili</h2><ul class="clean-list">${s.essentials.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="card"><h2>Vocabolario essenziale</h2><dl class="glossary">${s.glossary.map(([t,d])=>`<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl></article></div>`;
    $('#panel-map').innerHTML=`<h2>Mappa concettuale</h2><div class="map-frame"><img src="${s.map}" alt="${esc(s.mapAlt)}"></div><p class="map-alt"><strong>Descrizione equivalente:</strong> ${esc(s.mapAlt)}</p>`;
    renderQuiz(s);
    renderNotes(s);
    $('#prevButton').disabled=current===0; $('#nextButton').disabled=current===DATA.sections.length-1;
    $('#completeButton').textContent=state.completed.includes(s.id)?'Completata ✓':'Segna come completata';
    $$('#sectionNav button').forEach((b,i)=>{if(i===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    selectTab('lesson');
  }
  function renderNotes(s){
    $('#panel-notes').innerHTML=`<h2>Il tuo taccuino</h2><p>Le note restano su questo dispositivo.</p><textarea class="notes-area" id="notesArea" aria-label="Note su ${esc(s.title)}" placeholder="Scrivi collegamenti, dubbi, parole da riprendere…">${esc(state.notes[s.id]||'')}</textarea><p class="note-status" id="noteStatus">Salvataggio automatico locale</p>`;
    let timer; $('#notesArea').addEventListener('input',e=>{clearTimeout(timer);$('#noteStatus').textContent='Salvataggio…';timer=setTimeout(()=>{state.notes[s.id]=e.target.value;save();$('#noteStatus').textContent='Salvato su questo dispositivo';},350);});
  }

  function renderQuiz(section, subset=null){
    const questions=subset ? subset.map(i=>section.quiz[i]) : section.quiz;
    const indexes=subset || questions.map((_,i)=>i);
    const panel=$('#panel-test');
    panel.innerHTML=`<div class="quiz-intro"><h2>Test della sezione</h2><p>Ogni domanda ha tre alternative e una sola risposta corretta. Il feedback compare subito. Formula del voto: <code>voto = max(1, arrotonda(percentuale × 10))</code>.</p></div><form id="quizForm">${questions.map((q,j)=>questionMarkup(q,indexes[j],j)).join('')}<button class="primary" type="submit">Calcola risultato</button></form><div id="quizResult" aria-live="polite"></div>${section.id==='conclusione'&&!subset?'<div id="finalQuiz"></div>':''}`;
    const form=$('#quizForm');
    $$('input[type="radio"]',form).forEach(input=>input.addEventListener('change',()=>showImmediate(section,Number(input.dataset.q),input)));
    form.addEventListener('submit',e=>{e.preventDefault();gradeQuiz(section,indexes,form);});
    if(section.id==='conclusione'&&!subset) renderFinalQuiz();
  }
  function questionMarkup(q,originalIndex,displayIndex){
    return `<fieldset class="question" data-question="${originalIndex}"><legend>${displayIndex+1}. ${esc(q.q)}</legend>${q.o.map((o,i)=>`<label class="option"><input type="radio" name="q-${originalIndex}" value="${i}" data-q="${originalIndex}"> ${String.fromCharCode(65+i)}. ${esc(o)}</label>`).join('')}<div class="instant" aria-live="polite"></div></fieldset>`;
  }
  function showImmediate(section,index,input){
    const q=section.quiz[index], box=input.closest('fieldset').querySelector('.instant'), ok=Number(input.value)===q.a;
    box.innerHTML=`<p class="feedback ${ok?'ok':'bad'}"><strong>${ok?'Corretto':'Da rivedere'}.</strong> ${esc(q.e)}</p>`;
  }
  function gradeQuiz(section,indexes,form){
    const missing=indexes.filter(i=>!form.querySelector(`input[name="q-${i}"]:checked`));
    if(missing.length){toast(`Rispondi ancora a ${missing.length} ${missing.length===1?'domanda':'domande'}.`);form.querySelector(`fieldset[data-question="${missing[0]}"]`).scrollIntoView({behavior:'smooth',block:'center'});return;}
    const wrong=[],answers={}; let correct=0;
    indexes.forEach(i=>{const value=Number(form.querySelector(`input[name="q-${i}"]:checked`).value);answers[i]=value;if(value===section.quiz[i].a)correct++;else wrong.push(i);});
    const percent=Math.round(correct/indexes.length*100),vote=Math.max(1,Math.round(percent/10));
    const attempt={date:new Date().toISOString(),scope:indexes,answers,correct,total:indexes.length,percent,vote};
    state.attempts[section.id]=state.attempts[section.id]||[];state.attempts[section.id].push(attempt);save();
    const history=state.attempts[section.id].map((a,i)=>`Tentativo ${i+1}: ${a.correct}/${a.total}, ${a.percent}%, voto ${a.vote}/10`).join('<br>');
    $('#quizResult').innerHTML=`<section class="score"><h3>Risultato: ${correct}/${indexes.length}</h3><p><strong>${percent}% · voto ${vote}/10</strong></p><p>${wrong.length?'Qui sotto trovi soltanto i concetti da riparare.':'Tutti i nessi della prova sono corretti.'}</p><p class="attempts">${history}</p></section>${wrong.map(i=>recoveryMarkup(section.quiz[i],i)).join('')}${wrong.length?'<button type="button" class="secondary" id="retryWrong">Rifai soltanto le domande sbagliate</button>':''}`;
    if(wrong.length){$('#retryWrong').addEventListener('click',()=>{renderQuiz(section,wrong);$('#panel-test').scrollIntoView({behavior:'smooth'});});}
    else if(!state.completed.includes(section.id)){state.completed.push(section.id);save();buildNavigation();$('#completeButton').textContent='Completata ✓';toast('Sezione completata.');}
  }
  function recoveryMarkup(q,index){
    return `<article class="recovery"><h3>Recupero · ${esc(q.r.c)}</h3><p>${esc(q.r.x)}</p><p><strong>Esempio:</strong> ${esc(q.r.ex)}</p><p><a href="#${q.r.anchor}" data-recovery-link>Riapri il passaggio della lezione</a></p><p><strong>Nuova domanda breve:</strong> ${esc(q.r.retry)}</p></article>`;
  }

  const finalQuestions=[
    {q:"Quale tensione apre l'intero percorso?",o:["Forma ereditata e realtà senza centro","Poesia e teatro","Liguria e Toscana"],a:0},
    {q:"Quale cautela governa il rapporto biografia-opera?",o:["Ignorare la biografia","Evitare causalità automatiche","Spiegare tutto con la guerra"],a:1},
    {q:"Che cosa unisce limite e varco?",o:["Sono sinonimi","Il limite rende pensabile un oltre","Entrambi garantiscono salvezza"],a:1},
    {q:"Perché gli oggetti sono decisivi?",o:["Sostituiscono la metrica","Concentrano rapporti emotivi e conoscitivi","Rendono la poesia realistica in senso fotografico"],a:1},
    {q:"Quale svolta caratterizza Satura?",o:["Epica politica","Prosa ironica e diaristica controllata","Ritorno alla poesia-vate"],a:1},
    {q:"Quale eredità civile lascia Montale?",o:["Una dottrina positiva","Il rifiuto della tradizione","La responsabilità nel misurare l'autorità delle parole"],a:2}
  ];
  function renderFinalQuiz(){
    const host=$('#finalQuiz'); host.innerHTML=`<hr><h2>Verifica finale facoltativa</h2><p>Sei domande per controllare la catena completa del percorso.</p><form id="finalForm">${finalQuestions.map((q,i)=>`<fieldset class="question"><legend>${i+1}. ${esc(q.q)}</legend>${q.o.map((o,j)=>`<label class="option"><input type="radio" name="f-${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join('')}</fieldset>`).join('')}<button class="primary" type="submit">Valuta la verifica finale</button></form><div id="finalResult" aria-live="polite"></div>`;
    $('#finalForm').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,missing=finalQuestions.filter((_,i)=>!form.querySelector(`[name="f-${i}"]:checked`)).length;if(missing){toast('Completa tutte le domande finali.');return;}let correct=0;finalQuestions.forEach((q,i)=>{if(Number(form.querySelector(`[name="f-${i}"]:checked`).value)===q.a)correct++;});const percent=Math.round(correct/6*100),vote=Math.max(1,Math.round(percent/10));$('#finalResult').innerHTML=`<section class="score"><h3>${correct}/6 · ${percent}% · voto ${vote}/10</h3><p>${correct===6?'La catena interpretativa è completa.':'Riprendi le sezioni corrispondenti ai nessi non ancora sicuri.'}</p></section>`;});
  }

  function selectTab(name){
    $$('.tabs [role="tab"]').forEach(btn=>{const active=btn.dataset.tab===name;btn.setAttribute('aria-selected',String(active));$(`#panel-${btn.dataset.tab}`).hidden=!active;});
    if(name==='lesson') $('#panel-lesson').classList.add('reading');
  }
  function applyPreferences(){document.documentElement.style.setProperty('--reading-scale',state.fontSize/100);$('#fontSize').value=state.fontSize;$('#focusMode').checked=state.focus;document.body.classList.toggle('focus',state.focus);}
  function showSources(){els.workspace.hidden=true;els.sources.hidden=false;els.sources.scrollIntoView({behavior:'smooth'});}

  $('#menuButton').addEventListener('click',()=>setDrawer(true));$('#closeMenu').addEventListener('click',()=>setDrawer(false));els.scrim.addEventListener('click',()=>setDrawer(false));
  $('#startButton').addEventListener('click',()=>openSection(state.current||0));$('#resumeButton').addEventListener('click',()=>openSection(state.current||0));
  $('#sourceButton').addEventListener('click',showSources);$('#closeSources').addEventListener('click',()=>openSection(state.current||0));
  $('#settingsButton').addEventListener('click',()=>els.settings.showModal());
  $('#fontSize').addEventListener('input',e=>{state.fontSize=Number(e.target.value);applyPreferences();save();});
  $('#focusMode').addEventListener('change',e=>{state.focus=e.target.checked;applyPreferences();save();});
  $('#resetData').addEventListener('click',()=>{if(confirm('Vuoi cancellare progressi, risultati e note salvati su questo dispositivo?')){localStorage.removeItem(KEY);state={current:0,completed:[],notes:{},attempts:{},fontSize:100,focus:false};current=0;applyPreferences();buildNavigation();els.settings.close();toast('Dati locali azzerati.');}});
  $$('.tabs [role="tab"]').forEach(btn=>btn.addEventListener('click',()=>selectTab(btn.dataset.tab)));
  $('#prevButton').addEventListener('click',()=>openSection(current-1));$('#nextButton').addEventListener('click',()=>openSection(current+1));
  $('#completeButton').addEventListener('click',()=>{const id=DATA.sections[current].id;if(!state.completed.includes(id)){state.completed.push(id);save();buildNavigation();$('#completeButton').textContent='Completata ✓';toast('Sezione segnata come completata.');}else toast('Questa sezione è già completata.');});
  document.addEventListener('click',e=>{const link=e.target.closest('[data-recovery-link]');if(link){e.preventDefault();selectTab('lesson');const target=$(link.getAttribute('href'));target?.scrollIntoView({behavior:'smooth',block:'start'});}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setDrawer(false);});
  window.addEventListener('beforeunload',save);

  buildNavigation();buildSources();applyPreferences();
  if('serviceWorker' in navigator) window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./service-worker.js')
      .then(()=>navigator.serviceWorker.ready)
      .then(async()=>{
        const cached=await caches.open('montale-v1.0.1').then(cache=>cache.keys());
        document.documentElement.dataset.pwaReady='true';
        document.documentElement.dataset.cachedAssets=String(cached.length);
      })
      .catch(()=>{document.documentElement.dataset.pwaReady='false';});
  });
})();
