# Giovanni Pascoli — Libro vivo

PWA didattica standalone per il quinto anno, costruita come volume della stessa collana della PWA su Pirandello.

## Architettura didattica

Il percorso comprende otto tappe: mondo precedente, fratture, immagine del mondo, poetica del fanciullino, forma, simbolismo, opere e conclusione. La settima tappa contiene tre laboratori autonomi con testo integrale e close reading: **X agosto**, **Il gelsomino notturno**, **Digitale purpurea**.

Ogni tappa include domanda generatrice, lezione, dispositivo didattico, sintesi, saperi irrinunciabili, vocabolario, mappa, verifica a cinque quesiti, spiegazioni e recupero mirato. Il quiz finale contiene sedici domande.

## Fonti e criterio editoriale

Contenuti e dodici mappe provengono dalla cartella Drive fornita da gbprof:

- documenti 01–08 e i tre documenti della cartella 07 – Le opere;
- 09 – Registro delle correzioni storiche, cronologiche e interpretative;
- immagini da 01_mappa_generale_percorso a 12_conclusione_grandezza_e_limite;
- copertina originale copertina-Pascoli.png.

Sono state mantenute le correzioni vincolanti: assassinio di Ruggero nel 1867; acquisto di Castelvecchio nel 1902; cronologie editoriali del *Fanciullino* e delle tre poesie; distinzione fra dato, interpretazione e inferenza; tensione fra fraternità e nazionalismo; rifiuto di allegorie psicologiche rigide.

Fonti esterne di controllo dichiarate nei materiali: Treccani, Dizionario Biografico degli Italiani, Viv-it e testi originali in edizioni affidabili.

## Funzioni

- copertina-indice con hotspot percentuali e alternativa semantica mobile;
- navigazione laterale, sezione attiva, progresso e ripresa della lettura;
- tema chiaro/scuro e tre dimensioni del testo;
- appunti persistenti, esportazione TXT e svuotamento confermato;
- lightbox accessibile con zoom;
- mappa HTML interattiva dei simboli e timeline controllata;
- 8 verifiche formative, quiz finale, tentativi persistenti e retest dei soli errori;
- navigazione fra tappe con frecce sinistra/destra;
- stampa pulita, layout mobile-first, prefers-reduced-motion;
- manifest, icone e service worker con cache locale.

Le chiavi localStorage iniziano tutte con pascoli-; la cache è pascoli-libro-vivo-v2.

## Verifica locale

Avviare dalla radice del repository:

    python3 -m http.server 8000 --directory .

Aprire http://localhost:8000/Pascoli/. Per verificare l’offline: attendere l’attivazione del service worker, ricaricare una volta, disattivare la rete e riaprire. Viewport di riferimento: 1680×943, 1366×768, 1024×768, 768×1024 e 390×844.
