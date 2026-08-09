# Elsa Morante — Il reale e l’incanto

PWA didattica installabile, progettata prima di tutto per iPad e per una classe quinta della scuola secondaria di secondo grado. Il percorso segue il Metodo gbprof in sei movimenti e legge Morante attraverso il conflitto fra la violenza della Storia e la verità irriducibile delle singole vite.

## Prompt realistico di esempio

> Costruisci una PWA didattica installabile su Elsa Morante per una classe quinta superiore. Usa come fonte principale questo paper: `https://docs.google.com/document/d/13SzfEaL2a4HFcj6bJGNG2kpwOKf_swSyEcNoFTRZnxo/edit?usp=drivesdk`, verificando cronologia e concetti con fonti autorevoli. Organizza il percorso in: 1) mondo precedente; 2) fratture biografiche; 3) immagine del mondo; 4) poetica; 5) opere significative; 6) conclusione. Per ogni sezione inserisci lezione estesa, riassunto, saperi irrinunciabili, vocabolario, vera mappa concettuale SVG e test a tre risposte con feedback, voto e recupero mirato sugli errori. La grafica deve essere originale, sobria, adatta a Morante — avorio, rosso lacca e nero — e leggibile su iPad. Salva progresso, note e risultati in locale; aggiungi verifica finale, funzionamento offline e installabilità. Distingui sempre i dati dalle interpretazioni e non trasformare la biografia in una causa automatica delle opere. Deposita il progetto in `V-anno/Letteratura/Morante`.

## Struttura didattica

1. **Il mondo precedente** — fascismo, guerra, disuguaglianze, Neorealismo e tradizioni narrative ricevute.
2. **Le fratture** — identità familiare, guerra, autonomia artistica, separazioni, lutti e scontro critico.
3. **L’immagine del mondo** — Realtà contro Irrealtà; vita concreta contro Potere e Storia astratta.
4. **La poetica** — realismo simbolico, mito, fiaba, psiche, memoria e lingua plurale.
5. **Le opere** — *Menzogna e sortilegio*, *L’isola di Arturo*, *Il mondo salvato dai ragazzini*, *La Storia*, *Aracoeli*.
6. **Conclusione** — una traiettoria unica e una domanda sull’efficacia, insieme necessaria e limitata, dell’arte.

Ogni movimento contiene pannelli collegati per lezione, sintesi, saperi irrinunciabili, vocabolario, mappa SVG e autoverifica. Le mappe sono file locali 1400×900 con relazioni nominate e descrizione alternativa equivalente.

## Funzioni

- navigazione in sei sezioni con indice sempre raggiungibile;
- indicatore di avanzamento e comando **Riprendi**;
- note personali per sezione, salvate soltanto nel dispositivo;
- test con tre opzioni e una sola risposta corretta;
- feedback immediato, percentuale e voto in decimi;
- recupero mirato sugli errori e possibilità di ritentare le sole domande sbagliate;
- verifica finale facoltativa sui sei nessi essenziali;
- persistenza locale di progresso, note, test e tentativi;
- comando esplicito per azzerare i dati;
- service worker e cache delle risorse locali per l’uso offline dopo il primo accesso;
- interfaccia mobile-first, aree tattili ampie, focus visibile e supporto a orientamento verticale e orizzontale.

## File principali

```text
Morante/
├── index.html
├── styles.css
├── content.js
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── offline.html
├── SOURCE_NOTES.md
└── assets/
    ├── icons/
    └── maps/
        ├── 01-mondo.svg
        ├── 02-fratture.svg
        ├── 03-immagine.svg
        ├── 04-poetica.svg
        ├── 05-opere.svg
        └── 06-conclusione.svg
```

## Avvio locale

Il service worker richiede un’origine HTTP: aprire direttamente `index.html` come file non basta per verificare cache e installabilità.

```bash
cd Letteratura/Morante
python3 -m http.server 8080
```

Aprire quindi `http://localhost:8080`. Per verificare davvero l’offline: caricare una prima volta con rete attiva, attendere la registrazione del service worker, ricaricare e solo dopo simulare l’assenza di rete.

## Installazione su iPad

Aprire la versione pubblicata in Safari, usare **Condividi → Aggiungi alla schermata Home**, confermare il nome e avviare l’icona creata. Il primo caricamento deve avvenire con connessione attiva; in seguito il fascicolo resta disponibile dalla cache locale.

## Fonti e metodo

Il paper dell’utente resta la fonte principale. I controlli e le cautele interpretative sono documentati in [SOURCE_NOTES.md](SOURCE_NOTES.md). Il criterio generale è semplice: la biografia offre contesto e rende leggibili alcune tensioni, ma le opere mantengono autonomia formale e non vengono ridotte a sintomi della vita dell’autrice.

