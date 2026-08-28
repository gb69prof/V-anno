document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-analisi');
  toggles.forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const box = document.getElementById(button.dataset.target);
      if (!box) return;
      const isOpen = box.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.textContent = isOpen ? 'Nascondi analisi' : 'Mostra analisi';
    });
  });

  const reveal = fig => {
    fig.classList.remove('reality-locked');
    fig.setAttribute('aria-label', 'Quadro della realtà rivelato');
    fig.setAttribute('aria-pressed', 'true');
  };

  document.querySelectorAll('.stanza-images figure.reality').forEach(fig => {
    fig.setAttribute('aria-pressed', 'false');
    fig.addEventListener('click', () => reveal(fig));
    fig.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        reveal(fig);
      }
    });
  });

  document.querySelectorAll('.top-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const cover = document.getElementById('pascoli-cover');
  const videoBox = document.getElementById('video-container');
  const backBtn = document.getElementById('btn-back');
  const iframe = videoBox ? videoBox.querySelector('iframe') : null;
  const openVideo = () => {
    if (!cover || !videoBox || !backBtn) return;
    cover.style.display = 'none';
    videoBox.style.display = 'block';
    backBtn.style.display = 'block';
    backBtn.focus();
  };
  if (cover && videoBox && backBtn && iframe) {
    cover.addEventListener('click', openVideo);
    cover.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openVideo();
      }
    });
    backBtn.addEventListener('click', () => {
      iframe.src = iframe.src;
      videoBox.style.display = 'none';
      backBtn.style.display = 'none';
      cover.style.display = 'block';
      cover.focus();
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../service-worker.js').catch(() => {}));
  }
});
