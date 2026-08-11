(() => {
  'use strict';
  const DATA = window.UNGARETTI_DATA;
  const KEY = 'gbprof-ungaretti-v1';
  const defaultState = { completed: [], lastSection: 0, notes: '', attempts: {}, tab: 'lesson' };
  let state;
  try { state = {...defaultState, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; }
  catch { state = {...defaultState}; }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const views = $$('.view');
  const nav = $('#sectionNav');
  const lessonView = $('#lessonView');
  const finalView = $('#finalView');
  const sidebar = $('#sidebar');

  function save() { localStorage.setItem(KEY, JSON.stringify(state)); updateProgress(); }
  function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value); return div.innerHTML; }
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2600); }
  function showView(id) { views.forEach(v => v.classList.toggle('active', v.id === id)); sidebar.classList.remove('open'); $('#menuButton').setAttribute('aria-expanded', 'false'); window.scrollTo({top:0,behavior:'smooth'}); }

  function updateProgress() {
    const total = DATA.sections.length;
    const done = new Set(state.completed).size;
    $('#progressBar').value = done;
    $('#progressBar').textContent = `${done} su ${total}`;
    $('#progressText').textContent = `${Math.round(done / total * 100)}%`;
    $$('.nav-link').forEach((el, i) => el.classList.toggle('done', state.completed.includes(i)));
    $$('.journey-card').forEach((el, i) => el.classList.toggle('done', state.completed.includes(i)));
  }

  function renderHome() {
    $('#journeyCards').innerHTML = DATA.sections.map((s, i) => `
      <button class="journey-card" type="button" data-open-section="${i}">
        <span class="card-num">0${i + 1}</span><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.card)}</p>
      </button>`).join('');
    $('#sourceList').innerHTML = `<p>${escapeHtml(DATA.methodNote)}</p><ol>${DATA.sources.map(src => `<li><a href="${src.url}" target="_blank" rel="noopener">${escapeHtml(src.label)}</a> — ${escapeHtml(src.use)}</li>`).join('')}</ol>`;
  }

  function renderNav() {
    nav.innerHTML = `<button class="nav-link" type="button" data-go-home><span class="num">⌂</span><span>Copertina<small>Domanda generatrice</small></span></button>` +
      DATA.sections.map((s, i) => `<button class="nav-link" type="button" data-open-section="${i}"><span class="num">${i + 1}</span><span>${escapeHtml(s.short)}<small>${escapeHtml(s.navHint)}</small></span></button>`).join('') +
      `<button class="nav-link" type="button" data-final><span class="num">★</span><span>Verifica finale<small>I sei nessi</small></span></button>`;
  }

  function lessonHtml(section, index) {
    const panels = [
      ['lesson','Lezione'],['summary','Sintesi'],['knowledge','Saperi'],['glossary','Vocabolario'],['map','Mappa'],['test','Test']
    ];
    return `
      <header class="lesson-head"><span class="number">Movimento 0${index + 1}</span><h1>${escapeHtml(section.title)}</h1><p class="question"><strong>Domanda:</strong> ${escapeHtml(section.question)}</p></header>
      <div class="tabs" role="tablist" aria-label="Materiali della sezione">${panels.map((p,i) => `<button class="tab" id="tab-${p[0]}" role="tab" type="button" data-tab="${p[0]}" aria-selected="${i===0}" aria-controls="panel-${p[0]}">${p[1]}</button>`).join('')}</div>
      <section class="panel active" id="panel-lesson" role="tabpanel" aria-labelledby="tab-lesson"><div class="reading-card">${section.lesson}<div class="bridge"><strong>Ponte al movimento successivo</strong><br>${escapeHtml(section.bridge)}</div></div></section>
      <section class="panel" id="panel-summary" role="tabpanel" aria-labelledby="tab-summary"><div class="summary-card"><h2>La traiettoria in breve</h2><p>${escapeHtml(section.summary)}</p></div></section>
      <section class="panel" id="panel-knowledge" role="tabpanel" aria-labelledby="tab-knowledge"><div class="knowledge-card"><h2>Saperi irrinunciabili</h2><ul>${section.essentials.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div></section>
      <section class="panel" id="panel-glossary" role="tabpanel" aria-labelledby="tab-glossary"><div class="glossary-card"><h2>Vocabolario essenziale</h2><dl class="glossary">${section.glossary.map(x => `<div class="term"><dt>${escapeHtml(x.term)}</dt><dd>${escapeHtml(x.definition)}</dd></div>`).join('')}</dl></div></section>
      <section class="panel" id="panel-map" role="tabpanel" aria-labelledby="tab-map"><div class="map-card"><h2>Mappa concettuale</h2><img src="${section.map}" alt="${escapeHtml(section.mapAlt)}" width="1200" height="760"><p class="map-alt"><strong>Versione testuale:</strong> ${escapeHtml(section.mapAlt)}</p></div></section>
      <section class="panel" id="panel-test" role="tabpanel" aria-labelledby="tab-test">${renderTest(section.questions, `section-${index}`, index)}</section>
      <div class="lesson-actions"><button class="button" type="button" data-prev="${index-1}" ${index===0?'disabled':''}>← Movimento precedente</button><button class="button primary" type="button" data-complete="${index}">${state.completed.includes(index)?'Sezione completata ✓':'Segna come completata'}</button><button class="button" type="button" data-next="${index+1}">${index===DATA.sections.length-1?'Verifica finale →':'Movimento successivo →'}</button></div>`;
  }

  function renderTest(questions, testId, sectionIndex = null) {
    const history = state.attempts[testId] || [];
    return `<div class="test-card" data-test="${testId}"><h2>${sectionIndex === null ? 'Verifica finale' : 'Mettiti alla prova'}</h2><p class="formula">Formula: percentuale = risposte corrette / domande × 100; voto = max(1, arrotonda(percentuale × 10 / 100)).</p>
      <form>${questions.map((item, qi) => questionHtml(item, qi)).join('')}<div class="test-actions"><button class="button primary" type="submit">Correggi il test</button><button class="button retry" type="button" hidden>Riprova solo gli errori</button></div></form>
      <div class="result" aria-live="polite"></div>${history.length ? `<p class="history">Tentativi conservati: ${history.map((h,i)=>`${i+1}) ${h.score}/${h.total}, voto ${h.grade}/10`).join(' · ')}</p>` : ''}</div>`;
  }

  function questionHtml(item, qi) {
    return `<div class="question-card" data-question="${qi}"><fieldset><legend>${qi + 1}. ${escapeHtml(item.q)}</legend>${item.options.map((op,oi) => `<label class="option"><input type="radio" name="q${qi}" value="${oi}"><span><strong>${String.fromCharCode(65+oi)}.</strong> ${escapeHtml(op)}</span></label>`).join('')}</fieldset><div class="feedback" role="status"></div></div>`;
  }

  function openSection(index, tab = 'lesson') {
    const safe = Math.max(0, Math.min(DATA.sections.length - 1, Number(index) || 0));
    state.lastSection = safe; save();
    lessonView.innerHTML = lessonHtml(DATA.sections[safe], safe);
    showView('lessonView');
    $$('.nav-link').forEach((el,i) => el.classList.toggle('active', i === safe + 1));
    bindLesson(safe);
    selectTab(tab);
    location.hash = `section-${safe + 1}`;
    $('#main').focus({preventScroll:true});
  }

  function selectTab(tab) {
    const chosen = $(`[data-tab="${tab}"]`, lessonView) || $('[data-tab="lesson"]', lessonView);
    if (!chosen) return;
    $$('.tab', lessonView).forEach(t => t.setAttribute('aria-selected', String(t === chosen)));
    $$('.panel', lessonView).forEach(p => p.classList.toggle('active', p.id === `panel-${chosen.dataset.tab}`));
    state.tab = chosen.dataset.tab; save();
  }

  function bindLesson(index) {
    $$('.tab', lessonView).forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));
    $('[data-complete]', lessonView).addEventListener('click', e => {
      if (!state.completed.includes(index)) state.completed.push(index);
      save(); e.currentTarget.textContent = 'Sezione completata ✓'; toast('Progresso salvato sul dispositivo.');
    });
    $('[data-prev]', lessonView)?.addEventListener('click', e => openSection(e.currentTarget.dataset.prev));
    $('[data-next]', lessonView)?.addEventListener('click', e => Number(e.currentTarget.dataset.next) >= DATA.sections.length ? openFinal() : openSection(e.currentTarget.dataset.next));
    bindTest($('[data-test]', lessonView), DATA.sections[index].questions, `section-${index}`);
  }

  function bindTest(container, questions, testId) {
    if (!container) return;
    const form = $('form', container); const retry = $('.retry', container); let wrong = [];
    form.addEventListener('submit', event => {
      event.preventDefault(); wrong = []; let correct = 0; let total = 0; let unanswered = false;
      questions.forEach((item, qi) => {
        const card = $(`[data-question="${qi}"]`, container); if (!card || card.hidden) return;
        total++;
        const picked = $(`input[name="q${qi}"]:checked`, card); const feedback = $('.feedback', card);
        if (!picked) { unanswered = true; feedback.className = 'feedback show bad'; feedback.textContent = 'Scegli una risposta prima della correzione.'; return; }
        const ok = Number(picked.value) === item.answer;
        feedback.className = `feedback show ${ok ? 'good' : 'bad'}`;
        feedback.innerHTML = `<strong>${ok ? 'Corretto.' : 'Da rivedere.'}</strong> ${escapeHtml(item.explanation)}`;
        $$('input', card).forEach(input => input.disabled = true);
        if (ok) correct++; else wrong.push(qi);
      });
      if (unanswered) return;
      const percent = Math.round(correct / total * 100); const grade = Math.max(1, Math.round(percent / 10));
      state.attempts[testId] ||= []; state.attempts[testId].push({date:new Date().toISOString(),score:correct,total,percent,grade,wrong:[...wrong]}); save();
      $('.result', container).innerHTML = `<div class="scorebox"><strong>${correct}/${total} · ${percent}% · voto ${grade}/10</strong><p>${wrong.length ? `Errori da recuperare: ${wrong.length}. Qui sotto compaiono soltanto i nessi non ancora solidi.` : 'Tutti i nessi sono solidi. Puoi proseguire.'}</p></div>${wrong.map(qi => recoveryHtml(questions[qi], qi)).join('')}`;
      retry.hidden = wrong.length === 0;
    });
    retry.addEventListener('click', () => {
      $$('.question-card', container).forEach((card, qi) => { card.hidden = !wrong.includes(qi); if (wrong.includes(qi)) { $$('input',card).forEach(i=>{i.disabled=false;i.checked=false}); $('.feedback',card).className='feedback'; }});
      $('.result',container).innerHTML='<div class="scorebox"><strong>Recupero attivo</strong><p>Rispondi soltanto alle domande sbagliate. Il tentativo precedente resta nello storico.</p></div>';
      retry.hidden = true; container.scrollIntoView({behavior:'smooth'});
    });
  }

  function recoveryHtml(item, qi) {
    const r = item.recovery;
    return `<section class="recovery"><h4>${escapeHtml(r.concept)}</h4><p>${escapeHtml(r.clarification)}</p><p><strong>Esempio:</strong> ${escapeHtml(r.example)}</p><p><strong>Domanda-lampo:</strong> ${escapeHtml(r.check)}</p><p><strong>Risposta:</strong> ${escapeHtml(r.checkAnswer)}</p></section>`;
  }

  function openFinal() {
    finalView.innerHTML = `<header class="lesson-head"><span class="number">Verifica conclusiva</span><h1 id="finalTitle">I sei nessi</h1><p class="question">Non un quiz di memoria: controlla se sai ricostruire l’intera traiettoria.</p></header>${renderTest(DATA.finalTest,'final',null)}<div class="lesson-actions"><button class="button" type="button" data-open-section="5">← Torna alla conclusione</button><button class="button primary" type="button" data-go-home>Torna alla copertina</button></div>`;
    showView('finalView'); location.hash='verifica-finale'; bindTest($('[data-test]',finalView),DATA.finalTest,'final'); $('#main').focus({preventScroll:true});
  }

  function continueCourse() { openSection(state.lastSection || 0, state.tab || 'lesson'); }
  function goHome() { showView('home'); $$('.nav-link').forEach(el=>el.classList.remove('active')); location.hash='home'; }

  document.addEventListener('click', event => {
    const sectionButton = event.target.closest('[data-open-section]'); if (sectionButton) openSection(sectionButton.dataset.openSection);
    if (event.target.closest('[data-go-home]')) goHome(); if (event.target.closest('[data-final]')) openFinal();
  });
  $('#menuButton').addEventListener('click', e => { const open = sidebar.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded',String(open)); });
  $('#continueButton').addEventListener('click', continueCourse); $('#homeContinue').addEventListener('click', continueCourse);
  $('#openNotesButton').addEventListener('click', () => { $('#notesArea').value=state.notes||''; $('#notesDialog').showModal(); });
  $('#saveNotes').addEventListener('click', () => { state.notes=$('#notesArea').value; save(); $('#notesStatus').textContent='Note salvate su questo dispositivo.'; });
  $('#downloadNotes').addEventListener('click', () => { const blob=new Blob([$('#notesArea').value],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='appunti-ungaretti.txt'; a.click(); URL.revokeObjectURL(a.href); });
  $('#resetButton').addEventListener('click', () => { if (!confirm('Vuoi cancellare progresso, note e risultati dei test su questo dispositivo?')) return; state={...defaultState}; localStorage.removeItem(KEY); renderHome(); renderNav(); updateProgress(); goHome(); toast('Dati locali azzerati.'); });
  window.addEventListener('hashchange', () => { if (location.hash==='#home') goHome(); });

  renderHome(); renderNav(); updateProgress();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => toast('Modalità offline non ancora attiva. Ricarica la pagina.'));
  const match = location.hash.match(/^#section-(\d)$/); if (match) openSection(Number(match[1])-1); else if (location.hash==='#verifica-finale') openFinal(); else goHome();
})();
