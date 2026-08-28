# Gabriele D’Annunzio — Libro vivo

PWA didattica installabile, progettata prima per iPad e organizzata in sei movimenti:

1. Il mondo precedente
2. Le fratture
3. L’immagine del mondo — estetismo e superomismo
4. La poetica
5. Le opere
6. Conclusione

Il percorso conserva integralmente le 15 lezioni fornite, con soli interventi formali o storico-critici documentati in `REGISTRO_CORREZIONI.md`. La copertina interattiva apre sei ambienti di studio, ciascuno organizzato secondo la sequenza **leggere → osservare → elaborare → sedimentare**.

Su desktop e LIM l’ambiente usa una griglia 2/3 + 1/3: testo a scorrimento autonomo a sinistra, apparato visivo sincronizzato e taccuino persistente a destra. Su smartphone le tre aree diventano pannelli richiamabili. La selezione di un passo attiva l’inserimento diretto nel taccuino; note personali e citazioni restano distinte e possono essere esportate in TXT. Saperi irrinunciabili, vocabolario e test con feedback e recupero sono sempre raggiungibili dalla barra inferiore.

La PWA comprende inoltre 16 schemi originali, mappe di sezione, quiz finale, timeline, ingrandimento delle immagini e lettura offline.

## Avvio locale

Servire la cartella tramite un server HTTP, per esempio:

```bash
python3 -m http.server 8000
```

Aprire quindi `http://localhost:8000/`. Il service worker non funziona aprendo direttamente `index.html` dal filesystem.

## Dati sul dispositivo

Tema, dimensione del testo, ultima sezione, esiti dei quiz e taccuini sono salvati soltanto nel `localStorage` del browser. Ogni lezione ha appunti e citazioni proprie. L’esportazione produce un file TXT con titolo, data, appunti personali e passi selezionati.
