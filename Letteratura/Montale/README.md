# Montale · Il varco e il limite

PWA didattica standalone, progettata prima per iPad, che organizza lo studio di Eugenio Montale in sei movimenti:

1. Il mondo precedente
2. Le fratture della vita
3. L'immagine del mondo
4. La poetica
5. Le opere decisive
6. Conclusione

## Funzioni

- lezione estesa, sintesi, saperi irrinunciabili e vocabolario per ogni sezione;
- sei mappe concettuali SVG locali con relazioni nominate;
- cinque domande a scelta multipla per sezione, feedback immediato, voto in decimi e cronologia dei tentativi;
- mini-lezioni di recupero legate al passaggio pertinente e ripetizione delle sole risposte sbagliate;
- verifica finale facoltativa sui sei nessi del percorso;
- note, progresso, risultati e preferenze salvati localmente;
- modalità concentrazione e dimensione del testo regolabile;
- manifest, service worker, icone e contenuti disponibili offline dopo il primo caricamento.

## Avvio

Servire la cartella tramite HTTPS oppure con un server locale. Per esempio:

```bash
python3 -m http.server 4173 --directory .
```

Aprire `http://localhost:4173/Letteratura/Montale/` se la cartella è nel repository completo, oppure `http://localhost:4173/Montale/` in questa copia di lavoro.

Su iPad: aprire in Safari, usare **Condividi → Aggiungi alla schermata Home**, quindi avviare dall'icona.

## Criterio editoriale

Il documento fornito dall'utente è stato trattato come repertorio iniziale, non come bibliografia autosufficiente. Cronologia e interpretazioni sono state ricontrollate su fonti universitarie e istituzionali. In particolare, la data di nascita è stata corretta al **12 ottobre 1896**.

La matrice di controllo è in [FONTI.md](FONTI.md).

## Verifica

Lo script `tests/test-pwa.mjs` controlla struttura, manifest, cache locale, navigazione, test corretto, test con errori, recupero selettivo, note, viewport iPad e riapertura offline.

