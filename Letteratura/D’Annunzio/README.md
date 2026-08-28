# Gabriele D’Annunzio — Libro vivo

PWA didattica installabile, progettata prima per iPad e organizzata in sei movimenti:

1. Il mondo precedente
2. Le fratture
3. L’immagine del mondo — estetismo e superomismo
4. La poetica
5. Le opere
6. Conclusione

Il percorso conserva integralmente le 15 lezioni fornite, con soli interventi formali o storico-critici documentati in `REGISTRO_CORREZIONI.md`. Comprende 16 schemi originali, mappe di sezione, verifiche formative con recupero mirato, quiz finale, appunti locali, timeline e lettura offline.

## Avvio locale

Servire la cartella tramite un server HTTP, per esempio:

```bash
python3 -m http.server 8000
```

Aprire quindi `http://localhost:8000/`. Il service worker non funziona aprendo direttamente `index.html` dal filesystem.

## Dati sul dispositivo

Tema, dimensione del testo, ultima sezione, esiti dei quiz e appunti sono salvati soltanto nel `localStorage` del browser. L’esportazione degli appunti produce un file di testo locale.
