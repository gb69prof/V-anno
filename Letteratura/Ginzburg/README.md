# Natalia Ginzburg — Le parole che restano

PWA didattica standalone, mobile-first e installabile, costruita per una classe quinta della scuola secondaria di secondo grado.

## Prompt realistico di collaudo

> Crea una PWA didattica installabile per iPad su Natalia Ginzburg, destinata a una classe quinta di un istituto superiore. Usa come fonte principale il documento che ti fornisco e organizza il percorso secondo il metodo gbprof: il mondo precedente; le fratture della vita; l’immagine del mondo; la poetica; le opere più significative; conclusione. Per ogni sezione prepara una lezione ampia, una sintesi, i saperi irrinunciabili, un vocabolario essenziale, una mappa concettuale in formato immagine e almeno cinque domande a scelta multipla. I test devono correggere subito, assegnare un voto in decimi, spiegare gli errori, offrire una mini-lezione di recupero e permettere di rifare soltanto le risposte sbagliate. Salva localmente progresso, note e tentativi. Non usare dipendenze esterne e cura accessibilità e uso con Apple Pencil o dito.

## Funzioni

- sei sezioni nell’ordine didattico richiesto;
- sei pannelli per sezione: lezione, sintesi, saperi, vocabolario, mappa, test;
- 30 domande di sezione e 6 domande finali;
- feedback immediato, voto esplicito, recupero mirato e retest dei soli errori;
- storico dei tentativi senza cancellazione del precedente;
- taccuino, avanzamento e ultima sezione salvati in `localStorage`;
- sei mappe SVG locali con relazioni nominate;
- manifest, icone locali e service worker per l’uso offline;
- interfaccia tattile, focus visibile, semantica HTML e testi alternativi.

## Avvio locale

Servire la cartella con un server HTTP, per esempio `python3 -m http.server 8080`, e aprire `http://localhost:8080`. Il service worker non viene registrato dal protocollo `file:`.

## Struttura

- `index.html` — struttura accessibile dell’app;
- `content.js` — lezioni e verifiche;
- `app.js` — navigazione, persistenza, valutazione e recupero;
- `styles.css` — design responsive;
- `assets/maps/` — mappe concettuali SVG;
- `assets/icons/` — icone PWA;
- `SOURCE_NOTES.md` — controllo della fonte e scelte interpretative.
