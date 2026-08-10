(() => {
  "use strict";
  const sections = window.BUZZATI_SECTIONS || [];
  const sources = window.BUZZATI_SOURCES || [];
  const finalQuiz = window.BUZZATI_FINAL_QUIZ || [];
  const KEY = "buzzati-gbprof-v1";
  const emptyState = {completed:[],last:"home",notes:{},attempts:{},font:"normal",focus:false};
  let state;
  try { state = {...emptyState, ...JSON.parse(localStorage.getItem(KEY) || "{}")}; } catch { state = {...emptyState}; }
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const toast = message => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2200); };

  function renderShell() {
    const route = $("#routeCards"), nav = $("#sectionNav"), host = $("#lessonViews"), template = $("#lessonTemplate");
    sections.forEach((section, index) => {
      const card = document.createElement("button"); card.type="button"; card.className="route-card"; card.dataset.go=section.id;
      card.innerHTML=`<span>0${index+1}</span><strong>${escapeHtml(section.title)}</strong><small>${escapeHtml(section.short)}</small>`; route.append(card);
      const navButton = document.createElement("button"); navButton.type="button"; navButton.dataset.go=section.id;
      navButton.innerHTML=`<span>0${index+1}</span><strong>${escapeHtml(section.title)}</strong>`; nav.append(navButton);
      const node = template.content.firstElementChild.cloneNode(true); node.id=section.id; node.dataset.view=section.id;
      $(".section-number",node).textContent=`Movimento ${index+1} di 6 · ${section.subtitle}`;
      $(".section-title",node).textContent=section.title; $(".generative-question",node).textContent=section.question;
      const panels = Object.fromEntries($$("[data-panel]",node).filter(el=>el.tagName==="SECTION").map(el=>[el.dataset.panel,el]));
      panels.lesson.innerHTML=section.lesson; panels.summary.innerHTML=`<div class="summary-card"><p class="eyebrow">In breve</p>${section.summary}</div>`;
      panels.essentials.innerHTML=`<h2>Saperi irrinunciabili</h2><ul class="essentials-list">${section.essentials.map(x=>`<li>${x}</li>`).join("")}</ul>`;
      panels.glossary.innerHTML=`<h2>Vocabolario essenziale</h2><dl class="glossary-grid">${section.glossary.map(x=>`<div><dt>${escapeHtml(x.term)}</dt><dd>${x.definition}</dd></div>`).join("")}</dl>`;
      panels.map.innerHTML=`<figure><img src="${section.map.src}" alt="${escapeHtml(section.map.alt)}" width="1200" height="760"><figcaption>${section.map.caption}</figcaption></figure>`;
      renderQuiz(panels.quiz, section.quiz, section.id);
      panels.notes.innerHTML=`<h2>Il mio taccuino</h2><p>Le note vengono salvate automaticamente sul dispositivo.</p><label for="notes-${section.id}">Appunti su “${escapeHtml(section.title)}”</label><textarea id="notes-${section.id}" rows="12" placeholder="Scrivi un dubbio, un nesso, una domanda…">${escapeHtml(state.notes[section.id]||"")}</textarea><p class="save-status" role="status"></p><button class="ghost-button export-note" type="button">Esporta nota .txt</button>`;
      const textArea=$("textarea",panels.notes), status=$(".save-status",panels.notes);
      textArea.addEventListener("input",()=>{state.notes[section.id]=textArea.value;save();status.textContent="Salvato";clearTimeout(textArea.timer);textArea.timer=setTimeout(()=>status.textContent="",1300);});
      $(".export-note",panels.notes).addEventListener("click",()=>downloadText(`buzzati-${section.id}-note.txt`,textArea.value));
      setupTabs(node); setupPager(node,index); host.append(node);
    });
    renderQuiz($("#finalQuiz"), finalQuiz, "finale");
    $("#sourceCards").innerHTML=sources.map(s=>`<article class="source-card"><p class="eyebrow">${escapeHtml(s.kind)}</p><h2>${escapeHtml(s.title)}</h2><p>${s.note}</p><a href="${s.url}" target="_blank" rel="noopener">Consulta la fonte ↗</a></article>`).join("");
    $("#sourceMatrix").innerHTML=sources.map(s=>`<tr><td>${escapeHtml(s.short)}</td><td>${s.use}</td><td>${escapeHtml(s.sections)}</td></tr>`).join("");
  }

  function setupTabs(node) {
    const tabs=$$(".tabs [role=tab]",node), panels=$$("section[data-panel]",node);
    tabs.forEach((tab,i)=>{ const panel=panels.find(p=>p.dataset.panel===tab.dataset.panel); const id=`${node.id}-tab-${tab.dataset.panel}`, panelId=`${node.id}-panel-${tab.dataset.panel}`; tab.id=id;tab.setAttribute("aria-controls",panelId);panel.id=panelId;panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",id);tab.tabIndex=i? -1:0;
      tab.addEventListener("click",()=>activateTab(tab));
      tab.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();let next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(tabs.indexOf(tab)+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;tabs[next].focus();activateTab(tabs[next]);});
    });
    function activateTab(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute("aria-selected",active);t.tabIndex=active?0:-1});panels.forEach(p=>p.hidden=p.dataset.panel!==tab.dataset.panel);}
  }

  function setupPager(node,index){
    const prev=$(".prev-button",node),next=$(".next-button",node),complete=$(".complete-button",node);
    prev.textContent=index===0?"← Copertina":"← Precedente";next.textContent=index===sections.length-1?"Verifica finale →":"Successiva →";
    prev.addEventListener("click",()=>go(index===0?"home":sections[index-1].id));next.addEventListener("click",()=>go(index===sections.length-1?"finale":sections[index+1].id));
    complete.addEventListener("click",()=>{const done=state.completed.includes(node.id);state.completed=done?state.completed.filter(x=>x!==node.id):[...state.completed,node.id];save();updateProgress();complete.textContent=done?"Segna come completata":"Completata ✓";toast(done?"Sezione riaperta":"Sezione completata");});
  }

  function renderQuiz(host, questions, quizId) {
    host.innerHTML=`<div class="quiz-intro"><p class="eyebrow">Autoverifica</p><h2>Controlla i nessi</h2><p>Tre alternative, una sola corretta. Dopo la consegna vedrai spiegazioni, voto e recupero mirato.</p></div><form class="quiz-form" novalidate></form><div class="quiz-actions"><button class="primary-button submit-quiz" type="button">Consegna</button><p class="quiz-warning" role="alert"></p></div><section class="quiz-results" aria-live="polite" hidden></section>`;
    const form=$(".quiz-form",host), submit=$(".submit-quiz",host), warning=$(".quiz-warning",host), results=$(".quiz-results",host);
    const draw = indices => {form.innerHTML=indices.map(i=>questionHtml(questions[i],i,quizId)).join("");form.dataset.indices=indices.join(",");results.hidden=true;warning.textContent="";submit.textContent=indices.length===questions.length?"Consegna":"Consegna il recupero";};
    draw(questions.map((_,i)=>i));
    submit.addEventListener("click",()=>{
      const indices=form.dataset.indices.split(",").filter(Boolean).map(Number); const answers={}; let missing=[];
      indices.forEach(i=>{const checked=form.querySelector(`input[name="${quizId}-q${i}"]:checked`);if(checked)answers[i]=Number(checked.value);else missing.push(i+1)});
      if(missing.length){warning.textContent=`Rispondi prima ${missing.length===1?"alla domanda":"alle domande"} ${missing.join(", ")}.`;return;}
      const wrong=indices.filter(i=>answers[i]!==questions[i].answer),correct=indices.length-wrong.length,percent=Math.round(correct/indices.length*100),vote=Math.max(1,Math.round(percent/10));
      indices.forEach(i=>{const card=form.querySelector(`[data-question="${i}"]`);card.classList.add(answers[i]===questions[i].answer?"correct":"wrong");card.querySelectorAll("input").forEach(x=>x.disabled=true);card.insertAdjacentHTML("beforeend",`<p class="feedback"><strong>${answers[i]===questions[i].answer?"Corretto.":"Non ancora."}</strong> ${questions[i].explanation}</p>`);});
      const prior=state.attempts[quizId]||[];prior.push({date:new Date().toISOString(),scope:indices,wrong,percent,vote});state.attempts[quizId]=prior;save();
      results.hidden=false;results.innerHTML=resultHtml(questions,indices,wrong,percent,vote);
      const retry=$(".retry-wrong",results);if(retry)retry.addEventListener("click",()=>{draw(wrong);host.scrollIntoView({behavior:"smooth",block:"start"});});
      submit.disabled=true; const observer=new MutationObserver(()=>{submit.disabled=false;observer.disconnect()});observer.observe(form,{childList:true});
      results.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }

  function questionHtml(question,index,quizId){return `<fieldset class="question-card" data-question="${index}"><legend>${index+1}. ${question.q}</legend>${question.options.map((o,j)=>`<label class="option"><input type="radio" name="${quizId}-q${index}" value="${j}"><span><strong>${String.fromCharCode(65+j)}.</strong> ${o}</span></label>`).join("")}</fieldset>`;}
  function resultHtml(questions,indices,wrong,percent,vote){
    if(!wrong.length)return `<p class="eyebrow">Esito</p><p class="score">${percent}% · ${vote}/10</p><p class="formula">Formula: voto = max(1, arrotonda(percentuale ÷ 10)).</p><h3>Tutti i nessi sono corretti</h3><p>Nessun errore da recuperare. Il tentativo è stato conservato nello storico locale.</p>`;
    return `<p class="eyebrow">Esito</p><p class="score">${percent}% · ${vote}/10</p><p class="formula">Formula: voto = max(1, arrotonda(percentuale ÷ 10)).</p><h3>Errori da riparare: ${wrong.length}</h3><ol class="error-list">${wrong.map(i=>`<li>Domanda ${i+1}: ${questions[i].q}</li>`).join("")}</ol><div class="recovery-grid">${wrong.map(i=>recoveryHtml(questions[i],i)).join("")}</div><button class="primary-button retry-wrong" type="button">Riprova soltanto ${wrong.length===1?"la domanda sbagliata":"le domande sbagliate"}</button>`;
  }
  function recoveryHtml(q,i){const r=q.recovery;return `<article class="recovery-card"><p class="eyebrow">Recupero · domanda ${i+1}</p><h3>${r.concept}</h3><p>${r.clarification}</p><p><strong>Esempio dalla lezione:</strong> ${r.example}</p><div class="micro-question"><strong>Controllo rapido:</strong> ${r.question}<br><span>${r.answer}</span></div></article>`;}

  function go(id,updateHash=true){
    if(!document.querySelector(`[data-view="${CSS.escape(id)}"]`))id="home";
    $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===id));state.last=id;save();closeDrawers();if(updateHash)history.replaceState(null,"",`#${id}`);window.scrollTo({top:0,behavior:"smooth"});$("#main").focus({preventScroll:true});
  }
  function closeDrawers(){[$("#sideNav"),$("#toolsPanel")].forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});$("#menuButton").setAttribute("aria-expanded","false");$("#backdrop").hidden=true;}
  function openDrawer(which){closeDrawers();which.classList.add("open");which.setAttribute("aria-hidden","false");$("#backdrop").hidden=false;if(which===$("#sideNav"))$("#menuButton").setAttribute("aria-expanded","true");$("button",which)?.focus();}
  function updateProgress(){const pct=Math.round(state.completed.length/sections.length*100);$("#progressBar").style.width=`${pct}%`;$("#progressText").textContent=`${pct}%`;$$('#sectionNav button[data-go]').forEach(b=>b.classList.toggle("done",state.completed.includes(b.dataset.go)));sections.forEach(s=>{const button=$(`#${CSS.escape(s.id)} .complete-button`);if(button)button.textContent=state.completed.includes(s.id)?"Completata ✓":"Segna come completata";});}
  function downloadText(name,text){const blob=new Blob([text||""],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function applySettings(){document.body.classList.remove("font-small","font-large");if(state.font!=="normal")document.body.classList.add(`font-${state.font}`);document.body.classList.toggle("focus-mode",!!state.focus);$("#focusMode").checked=!!state.focus;$$('[data-font]').forEach(b=>b.classList.toggle("active",b.dataset.font===state.font));}

  renderShell();
  document.addEventListener("click",event=>{const goButton=event.target.closest("[data-go]");if(goButton)go(goButton.dataset.go);});
  $("#startButton").addEventListener("click",()=>go(sections[0].id));$("#resumeButton").addEventListener("click",()=>go(state.last==="home"?sections[0].id:state.last));
  $("#menuButton").addEventListener("click",()=>openDrawer($("#sideNav")));$("#toolsButton").addEventListener("click",()=>openDrawer($("#toolsPanel")));$("#closeMenu").addEventListener("click",closeDrawers);$("#closeTools").addEventListener("click",closeDrawers);$("#backdrop").addEventListener("click",closeDrawers);
  $("#installButton").addEventListener("click",()=>$("#installDialog").showModal());$("#resetButton").addEventListener("click",()=>$("#resetDialog").showModal());$("#confirmReset").addEventListener("click",()=>{localStorage.removeItem(KEY);state={...emptyState};location.hash="home";location.reload();});
  $$('[data-font]').forEach(button=>button.addEventListener("click",()=>{state.font=button.dataset.font;save();applySettings()}));$("#focusMode").addEventListener("change",event=>{state.focus=event.target.checked;save();applySettings();});
  window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home",false));document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDrawers();});
  updateProgress();applySettings();go(location.hash.slice(1)||"home",false);
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(error=>console.warn("Service worker non registrato",error)));
})();
