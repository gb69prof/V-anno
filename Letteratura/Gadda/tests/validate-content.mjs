import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = fs.readFileSync(path.join(root, "content.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const sections = context.window.LESSON_DATA;
const finalQuiz = context.window.FINAL_QUIZ;
const expectedIds = ["mondo", "fratture", "immagine", "poetica", "opere", "conclusione"];
const errors = [];
const words = text => text.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").trim().split(/\s+/).filter(Boolean).length;
const fail = message => errors.push(message);

if (!Array.isArray(sections) || sections.length !== 6) fail("Servono esattamente sei sezioni.");
if (sections.map(section => section.id).join(",") !== expectedIds.join(",")) fail("Ordine delle sei sezioni non corretto.");

for (const section of sections) {
  const lessonWords = words(section.lesson);
  const summaryWords = words(section.summary);
  if (lessonWords < 700 || lessonWords > 1100) fail(`${section.id}: lezione di ${lessonWords} parole (richieste 700–1100).`);
  if (summaryWords < 120 || summaryWords > 200) fail(`${section.id}: sintesi di ${summaryWords} parole (richieste 120–200).`);
  if (section.essentials.length < 5 || section.essentials.length > 8) fail(`${section.id}: saperi fuori intervallo 5–8.`);
  if (section.vocabulary.length < 5 || section.vocabulary.length > 10) fail(`${section.id}: vocabolario fuori intervallo 5–10.`);
  const mapPath = path.join(root, section.map);
  if (!fs.existsSync(mapPath)) fail(`${section.id}: mappa mancante ${section.map}.`);
  if (!section.mapAlt || section.mapAlt.length < 100) fail(`${section.id}: testo alternativo della mappa insufficiente.`);
  if (!Array.isArray(section.questions) || section.questions.length < 5) fail(`${section.id}: servono almeno cinque domande.`);
  const distribution = [0, 0, 0];
  section.questions.forEach((question, index) => {
    if (!Array.isArray(question.options) || question.options.length !== 3) fail(`${section.id} domanda ${index + 1}: non ha tre opzioni.`);
    if (![0, 1, 2].includes(question.correct)) fail(`${section.id} domanda ${index + 1}: indice corretto non valido.`);
    else distribution[question.correct]++;
    if (!question.explanation) fail(`${section.id} domanda ${index + 1}: feedback mancante.`);
    if (!Array.isArray(question.recovery) || question.recovery.length < 3) fail(`${section.id} domanda ${index + 1}: recupero incompleto.`);
    if (!question.anchor || !section.lesson.includes(`id="${question.anchor}"`)) fail(`${section.id} domanda ${index + 1}: anchor ${question.anchor} inesistente.`);
  });
  if (distribution.includes(0)) fail(`${section.id}: risposte corrette non distribuite fra A, B e C.`);
  console.log(`${section.id}: ${lessonWords} parole, sintesi ${summaryWords}, quiz ${distribution.join("/")}`);
}

if (!finalQuiz || finalQuiz.questions.length !== 6) fail("La verifica finale deve contenere sei domande.");

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
if (manifest.start_url !== "./" || manifest.scope !== "./" || manifest.display !== "standalone") fail("Manifest non configurato come PWA standalone relativa.");
for (const icon of manifest.icons || []) if (!fs.existsSync(path.join(root, icon.src))) fail(`Icona manifest mancante: ${icon.src}`);

const serviceWorker = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
for (const section of sections) if (!serviceWorker.includes(section.map)) fail(`Mappa non precached: ${section.map}`);
if (!serviceWorker.includes("key.startsWith(CACHE_PREFIX)")) fail("La pulizia cache non è isolata alla PWA Gadda.");
if (/\/(Users|home|workspace)\//.test(source + serviceWorker)) fail("Rilevato percorso assoluto locale.");

if (errors.length) {
  console.error(`\n${errors.length} errore/i:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("\nContratto didattico e PWA: validazione superata.");
