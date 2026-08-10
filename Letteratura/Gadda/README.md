# Carlo Emilio Gadda — L’ingegnere del groviglio

PWA didattica standalone, mobile-first e installabile, progettata per una classe quinta della scuola secondaria di secondo grado.

## Prompt realistico d’esempio

> Crea una PWA didattica installabile su Carlo Emilio Gadda per una classe quinta della scuola secondaria superiore. Usa esclusivamente fonti universitarie o di istituti di ricerca. Organizza il percorso secondo il Metodo gbprof: mondo precedente, fratture biografiche, immagine del mondo, poetica, opere, conclusione. Il filo conduttore deve essere questo: perché per Gadda la realtà non può essere spiegata da una sola causa e ha bisogno di molte lingue? Evita sia la biografia aneddotica sia una lettura puramente psicologica dei traumi. Inserisci lezioni estese, sintesi, saperi irrinunciabili, glossari, verifiche con recupero e mappe concettuali.

## Asse interpretativo

**La lingua di Gadda non complica una realtà semplice: rende percepibile una realtà che è già complessa.**

Il percorso muove dalla promessa borghese di ordine, attraversa famiglia, guerra e fascismo, elabora il reale come rete di concause e mostra perché plurilinguismo, pastiche e forme aperte siano strumenti di conoscenza.

## Funzioni

- sei sezioni nell’ordine didattico richiesto;
- sei pannelli per sezione: lezione, sintesi, saperi, vocabolario, mappa, test;
- 30 domande di sezione e 6 domande finali;
- feedback immediato, voto in decimi, recupero ancorato e retest dei soli errori;
- storico dei tentativi conservato;
- taccuino, avanzamento e ultima sezione salvati in `localStorage`;
- sei mappe SVG locali con relazioni nominate e testo alternativo;
- manifest, icone locali e service worker con cache isolata dalle altre PWA;
- interfaccia tattile iPad-first, focus visibile e HTML semantico;
- nessuna dipendenza di rete necessaria dopo il primo caricamento.

## Avvio locale

Servire la cartella con un server HTTP, per esempio `python3 -m http.server 8080`, e aprire `http://localhost:8080`. Il service worker non viene registrato dal protocollo `file:`.

## Struttura

- `index.html` — struttura accessibile;
- `content.js` — lezioni, apparati e verifiche;
- `app.js` — navigazione, persistenza, valutazione e recupero;
- `styles.css` — design responsive;
- `assets/maps/` — mappe concettuali SVG;
- `assets/icons/` — icone PWA 180, 192 e 512 px;
- `SOURCE_NOTES.md` — fonti e precauzioni critiche;
- `tests/validate-content.mjs` — controllo automatico del contratto didattico.
