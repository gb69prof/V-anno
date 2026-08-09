# Leonardo Sciascia · La verità sotto interrogatorio

PWA didattica standalone, mobile-first e pensata per Safari su iPad. Il percorso segue sei movimenti:

1. Il mondo precedente
2. Le fratture della vita
3. L’immagine del mondo
4. La poetica
5. Le opere più significative
6. Conclusione

Ogni sezione comprende lezione estesa, sintesi, saperi irrinunciabili, vocabolario, mappa SVG, test con feedback immediato, voto in decimi, recupero per i soli errori e retest selettivo. Progressi, note e tentativi vengono salvati in `localStorage`.

## Avvio locale

Servire la cartella con un server HTTP, per esempio:

```bash
python3 -m http.server 8080
```

Aprire `http://localhost:8080/Letteratura/Sciascia/`.

## Installazione iPad

Aprire la pagina pubblicata in Safari, usare **Condividi → Aggiungi alla schermata Home**. Dopo il primo caricamento il service worker conserva contenuti, mappe e icone per l’uso offline.

## Fonti

La ricerca usa soltanto fonti ospitate da università italiane. La matrice `fonte → affermazione → sezione` è in `docs/dossier-fonti.md`.
