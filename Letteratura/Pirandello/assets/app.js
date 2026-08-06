(() => {
  'use strict';

  const root = document.documentElement;
  const stages = [...document.querySelectorAll('.stage')];
  const stageLinks = [...document.querySelectorAll('[data-stage-link]')];

  const storedTheme = localStorage.getItem('pirandello-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = storedTheme || (preferredDark ? 'dark' : 'light');

  const themeButton = document.querySelector('[data-theme-toggle]');
  const syncThemeButton = () => {
    if (!themeButton) return;
    const dark = root.dataset.theme === 'dark';
    themeButton.textContent = dark ? '☀' : '☾';
    themeButton.setAttribute('aria-label', dark ? 'Attiva modalità chiara' : 'Attiva modalità scura');
    themeButton.setAttribute('title', dark ? 'Modalità chiara' : 'Modalità scura');
  };
  syncThemeButton();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pirandello-theme', root.dataset.theme);
    syncThemeButton();
  });

  const fontButton = document.querySelector('[data-font-toggle]');
  const fontSizes = ['1rem', '1.08rem', '1.18rem'];
  let fontIndex = Number(localStorage.getItem('pirandello-font-index') || 1);
  const applyFont = () => {
    fontIndex = Math.min(2, Math.max(0, fontIndex));
    root.style.setProperty('--reading-size', fontSizes[fontIndex]);
    fontButton?.setAttribute('aria-label', `Dimensione del testo: livello ${fontIndex + 1} di 3`);
  };
  applyFont();
  fontButton?.addEventListener('click', () => {
    fontIndex = (fontIndex + 1) % fontSizes.length;
    localStorage.setItem('pirandello-font-index', String(fontIndex));
    applyFont();
  });

  const progress = document.querySelector('.reading-progress');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
    progress.style.width = `${percent}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      stageLinks.forEach((link) => link.setAttribute('aria-current', String(link.hash === `#${visible.target.id}`)));
      document.title = `${visible.target.querySelector('h2')?.textContent || 'Pirandello'} — Percorso Pirandello`;
    }, { rootMargin: '-25% 0px -62% 0px', threshold: [0, .15, .5] });
    stages.forEach((stage) => observer.observe(stage));
  }

  const notesPanel = document.querySelector('.notes-panel');
  const notesText = document.querySelector('#notes-text');
  const notesStatus = document.querySelector('.save-status');
  const notesKey = 'pirandello-appunti-v2';
  let saveTimer;

  if (notesText) notesText.value = localStorage.getItem(notesKey) || '';
  const setNotesOpen = (open) => {
    if (!notesPanel) return;
    notesPanel.dataset.open = String(open);
    document.querySelectorAll('[data-notes-toggle]').forEach((button) => button.setAttribute('aria-expanded', String(open)));
    if (open) notesText?.focus();
  };
  document.querySelectorAll('[data-notes-toggle]').forEach((button) => {
    button.addEventListener('click', () => setNotesOpen(notesPanel?.dataset.open !== 'true'));
  });
  document.querySelector('[data-notes-close]')?.addEventListener('click', () => setNotesOpen(false));

  notesText?.addEventListener('input', () => {
    if (notesStatus) notesStatus.textContent = 'Salvataggio…';
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      localStorage.setItem(notesKey, notesText.value);
      if (notesStatus) notesStatus.textContent = 'Salvato';
    }, 350);
  });

  document.querySelector('[data-notes-export]')?.addEventListener('click', () => {
    const blob = new Blob([notesText?.value || ''], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pirandello-appunti.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.querySelector('[data-notes-clear]')?.addEventListener('click', () => {
    if (!notesText || !window.confirm('Cancellare tutti gli appunti su Pirandello?')) return;
    notesText.value = '';
    localStorage.removeItem(notesKey);
    if (notesStatus) notesStatus.textContent = 'Cancellati';
  });

  const imageDialog = document.querySelector('#image-dialog');
  const dialogImage = imageDialog?.querySelector('img');
  const dialogCaption = imageDialog?.querySelector('[data-dialog-caption]');
  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!imageDialog || !dialogImage) return;
      const image = button.querySelector('img');
      dialogImage.src = image?.currentSrc || image?.src || '';
      dialogImage.alt = image?.alt || '';
      if (dialogCaption) dialogCaption.textContent = button.dataset.caption || image?.alt || 'Schema';
      imageDialog.showModal();
    });
  });
  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  const concepts = {
    positivismo: {
      title: 'Crisi del Positivismo',
      definition: 'La fiducia in fatti, scienza e osservazione non basta più a garantire una realtà unica e totalmente conoscibile.',
      example: 'In Così è (se vi pare) documenti e testimonianze non sciolgono l’enigma: la verità vive nelle interpretazioni.'
    },
    relativismo: {
      title: 'Relativismo conoscitivo',
      definition: 'Ogni coscienza vede il reale da una prospettiva propria. Le verità possono essere coerenti e tuttavia incompatibili.',
      example: 'Ponza e Frola abitano due verità opposte; nessun dato esterno riesce a stabilire quale sia definitiva.'
    },
    identita: {
      title: 'Identità',
      definition: 'L’io non è una sostanza stabile: cambia nel tempo ed esiste anche nelle immagini che gli altri costruiscono di noi.',
      example: 'Il naso di Moscarda apre la scoperta di essere uno per sé, centomila per gli altri e, dunque, nessuno.'
    },
    maschera: {
      title: 'Maschera sociale',
      definition: 'È il ruolo nel quale società, famiglia e lavoro fissano l’individuo. Lo limita, ma gli consente anche di essere riconosciuto.',
      example: 'Adriano Meis crede di essere libero perché non ha più una maschera; scopre invece di non poter agire, amare o difendersi.'
    },
    vita: {
      title: 'Vita',
      definition: 'È movimento, trasformazione, flusso che non coincide mai definitivamente con una sola immagine.',
      example: 'Nel finale di Uno, nessuno e centomila Moscarda tenta di rinascere ogni istante, rinunciando a nome e memoria.'
    },
    forma: {
      title: 'Forma',
      definition: 'È la configurazione stabile che arresta la vita: nome, ruolo, carattere, giudizio. Prigione necessaria, non semplice male eliminabile.',
      example: 'I Sei personaggi sono più stabili degli attori, ma proprio per questo condannati a rivivere eternamente il loro dramma.'
    },
    umorismo: {
      title: 'Umorismo',
      definition: 'La riflessione scompone l’apparenza e scopre le ragioni dolorose che impediscono al riso di restare semplice comicità.',
      example: 'La vecchia signora imbellettata prima fa sorridere; poi la sua possibile paura di perdere l’amore trasforma lo sguardo.'
    },
    follia: {
      title: 'Follia',
      definition: 'Può essere esclusione imposta, fuga dalle convenzioni o lucidità che smaschera la presunta normalità degli altri.',
      example: 'Enrico IV sceglie di restare nel personaggio: la maschera diventa rifugio e, dopo il delitto, necessità definitiva.'
    },
    incomunicabilita: {
      title: 'Incomunicabilità',
      definition: 'Le parole portano il significato del mondo di chi parla, ma sono accolte nel mondo diverso di chi ascolta.',
      example: 'La Figliastra e il Padre raccontano la stessa vicenda, ma ciascuno rifiuta la forma imposta dal racconto dell’altro.'
    },
    personaggio: {
      title: 'Persona e personaggio',
      definition: 'La persona muta; il personaggio artistico è fissato per sempre in una forma e possiede perciò una realtà immutabile.',
      example: 'Il Padre sostiene di essere più reale del Capocomico: la sua realtà non può cambiare dal giorno alla sera.'
    },
    teatro: {
      title: 'Metateatro',
      definition: 'Il teatro rappresenta se stesso e rende visibile la crisi dell’autore, dell’attore e della rappresentazione.',
      example: 'Nei Sei personaggi una prova teatrale viene invasa da creature che rifiutano la recitazione degli attori.'
    },
    verita: {
      title: 'Verità plurale',
      definition: 'Non è semplice arbitrio: ogni verità nasce da una prospettiva vissuta, ma nessuna prospettiva esaurisce il reale.',
      example: '«Io sono colei che mi si crede» non risolve l’enigma: denuncia il bisogno violento di assegnare una sola identità all’altro.'
    }
  };

  const conceptDialog = document.querySelector('#concept-dialog');
  const conceptTitle = conceptDialog?.querySelector('[data-concept-title]');
  const conceptDefinition = conceptDialog?.querySelector('[data-concept-definition]');
  const conceptExample = conceptDialog?.querySelector('[data-concept-example]');
  document.querySelectorAll('[data-concept]').forEach((button) => {
    button.addEventListener('click', () => {
      const concept = concepts[button.dataset.concept];
      if (!conceptDialog || !concept) return;
      if (conceptTitle) conceptTitle.textContent = concept.title;
      if (conceptDefinition) conceptDefinition.textContent = concept.definition;
      if (conceptExample) conceptExample.textContent = concept.example;
      conceptDialog.showModal();
    });
  });

  const quizData = [
    { q: 'Quale certezza ottocentesca entra in crisi nel percorso pirandelliano?', a: ['La realtà è conoscibile da un punto di vista oggettivo', 'La letteratura deve usare il verso', 'La storia non cambia mai'], c: 0 },
    { q: 'Che cosa indica la “forma”?', a: ['Il puro movimento della vita', 'La fissazione dell’individuo in un ruolo', 'Soltanto la forma metrica'], c: 1 },
    { q: 'Quando nasce il sentimento del contrario?', a: ['Quando la riflessione scopre il dolore dietro il comico', 'Quando si ride più forte', 'Quando scompare ogni contrasto'], c: 0 },
    { q: 'Perché Adriano Meis non è davvero libero?', a: ['Non possiede denaro', 'Non può lasciare Miragno', 'Senza identità legale non può agire socialmente'], c: 2 },
    { q: 'Che cosa provoca la crisi di Moscarda?', a: ['Un fallimento bancario', 'La scoperta del proprio naso visto diversamente', 'Una falsa notizia di morte'], c: 1 },
    { q: 'In Così è (se vi pare), perché la comunità esercita violenza?', a: ['Pretende di classificare definitivamente la vita altrui', 'Rifiuta ogni documento', 'Protegge il segreto dei Ponza'], c: 0 },
    { q: 'Perché i Sei personaggi si dicono più reali degli attori?', a: ['Sono persone storiche', 'La loro forma artistica è immutabile', 'Conoscono già il pubblico'], c: 1 },
    { q: 'Che cosa rende ambigua la scelta di Enrico IV?', a: ['La follia è insieme rifugio e prigione', 'Nessuno sa chi lo abbia ferito', 'Il protagonista cambia costume'], c: 0 },
    { q: '«Io sono colei che mi si crede» significa che…', a: ['la signora Ponza confessa di mentire', 'l’identità è inseparabile dagli sguardi che la costruiscono', 'ogni opinione è falsa'], c: 1 },
    { q: 'Qual è la sequenza del metodo della PWA?', a: ['Biografia → date → opere', 'Opere → poetica → storia', 'Mondo precedente → crisi → immagine del mondo → poetica → opere'], c: 2 }
  ];

  const quiz = document.querySelector('#final-quiz');
  if (quiz) {
    const questions = quiz.querySelector('[data-quiz-questions]');
    quizData.forEach((item, index) => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = `${index + 1}. ${item.q}`;
      fieldset.append(legend);
      item.a.forEach((answer, answerIndex) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q-${index}`;
        input.value = String(answerIndex);
        label.append(input, ` ${answer}`);
        fieldset.append(label);
      });
      questions?.append(fieldset);
    });
    quiz.addEventListener('submit', (event) => {
      event.preventDefault();
      let score = 0;
      quizData.forEach((item, index) => {
        const selected = quiz.querySelector(`input[name="q-${index}"]:checked`);
        if (Number(selected?.value) === item.c) score += 1;
      });
      const result = quiz.querySelector('[data-quiz-result]');
      const messages = score >= 9
        ? 'Padronanza molto solida: sai collegare concetti e opere.'
        : score >= 7
          ? 'Buona comprensione: ripassa i passaggi meno sicuri nelle mappe.'
          : 'Il percorso non è ancora ricomposto: torna alle cinque tappe e prova di nuovo.';
      if (result) {
        result.hidden = false;
        result.textContent = `${score}/10 — ${messages}`;
        result.focus();
      }
    });
  }

  const timelineDialog = document.querySelector('#timeline-dialog');
  document.querySelectorAll('[data-open-timeline]').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.tagName === 'A') event.preventDefault();
      timelineDialog?.showModal();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setNotesOpen(false);
    if (event.altKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      const current = stages.findIndex((stage) => stage.getBoundingClientRect().top > 0);
      const targetIndex = event.key === 'ArrowRight'
        ? Math.min(stages.length - 1, current < 0 ? 0 : current)
        : Math.max(0, current - 2);
      stages[targetIndex]?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js');
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state !== 'installed' || !navigator.serviceWorker.controller) return;
            const toast = document.createElement('div');
            toast.className = 'update-toast';
            toast.innerHTML = '<span>Aggiornamento disponibile</span><button type="button">Ricarica</button>';
            toast.querySelector('button')?.addEventListener('click', () => window.location.reload());
            document.body.append(toast);
          });
        });
      } catch (error) {
        console.warn('Service worker non disponibile:', error);
      }
    });
  }
})();
