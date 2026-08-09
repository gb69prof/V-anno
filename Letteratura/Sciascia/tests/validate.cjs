const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };

const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8") + "\n;globalThis.__data={sections:SCIASCIA_SECTIONS,finalTest:SCIASCIA_FINAL_TEST,sources:SCIASCIA_SOURCES};";
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(dataSource, sandbox);
const { sections, finalTest, sources } = sandbox.__data;

ok(sections.length === 6, "Il percorso deve avere esattamente sei sezioni");
sections.forEach((section, sectionIndex) => {
  const words = section.lesson.map(part => part.text).join(" ").trim().split(/\s+/).length;
  ok(words >= 700 && words <= 1100, `${section.id}: lezione di ${words} parole, attese 700–1100`);
  ok(section.lesson.length >= 4, `${section.id}: lezione non articolata`);
  ok(section.summary.split(/\s+/).length >= 100, `${section.id}: sintesi troppo breve`);
  ok(section.essentials.length >= 5 && section.essentials.length <= 8, `${section.id}: saperi fuori soglia`);
  ok(section.vocab.length >= 5 && section.vocab.length <= 10, `${section.id}: vocabolario fuori soglia`);
  ok(section.questions.length >= 5, `${section.id}: servono almeno cinque domande`);
  const keys = new Set();
  section.questions.forEach((question, questionIndex) => {
    ok(question.options.length === 3, `${section.id} domanda ${questionIndex+1}: opzioni diverse da tre`);
    ok(question.correct >= 0 && question.correct <= 2, `${section.id} domanda ${questionIndex+1}: chiave non valida`);
    ok(Boolean(question.feedback), `${section.id} domanda ${questionIndex+1}: feedback mancante`);
    ok(question.recovery.length === 4, `${section.id} domanda ${questionIndex+1}: recupero incompleto`);
    keys.add(question.correct);
  });
  ok(keys.size === 3, `${section.id}: le risposte corrette non sono distribuite fra A, B e C`);
  const mapPath = path.join(root, section.map);
  ok(fs.existsSync(mapPath), `${section.id}: mappa mancante`);
  if (fs.existsSync(mapPath)) {
    const svg = fs.readFileSync(mapPath, "utf8");
    ok(/<title/.test(svg) && /<desc/.test(svg), `${section.id}: mappa senza title/desc`);
    ok(/produce|mette in crisi|si traduce in|confluisce in|esige|rende visibile|interroga|lascia|costruisce|separa|limita|ipotizza|contesta|difende/.test(svg), `${section.id}: relazioni non nominate`);
  }
  ok(sectionIndex === Number(section.number) - 1, `${section.id}: numero di movimento incoerente`);
});

ok(finalTest.length === 6, "La verifica finale deve riprendere sei nessi");
ok(sources.length >= 5, "Bibliografia universitaria insufficiente");
sources.forEach(source => ok(/^https:\/\/(site\.|amsdottorato\.|iris\.)?(unibo|unipa)/.test(source.url), `Fonte non universitaria: ${source.url}`));

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
manifest.icons.forEach(icon => ok(fs.existsSync(path.join(root, icon.src)), `Icona manifest mancante: ${icon.src}`));
ok(manifest.display === "standalone", "Manifest non standalone");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
sections.forEach(section => ok(sw.includes(`./${section.map}`), `Service worker non include ${section.map}`));
["index.html","styles.css","data.js","app.js","manifest.webmanifest"].forEach(file => ok(sw.includes(`./${file}`), `Service worker non include ${file}`));

// Simulazioni della formula e del recupero selettivo.
const grade = (correct, total) => Math.max(1, Math.round(Math.round(correct / total * 100) / 10));
ok(grade(5,5) === 10, "Formula voto errata sul test perfetto");
ok(grade(0,5) === 1, "Formula voto errata sul test nullo");
const sampleWrong = sections[0].questions.map((q,i) => q.correct === 0 ? null : i).filter(Number.isInteger);
ok(sampleWrong.length > 0 && sampleWrong.length < 5, "La simulazione non produce un recupero selettivo");

if (failures.length) {
  console.error(failures.map(item => `✗ ${item}`).join("\n"));
  process.exit(1);
}
console.log(`✓ 6 sezioni valide · ${sections.reduce((n,s)=>n+s.questions.length,0)} quesiti · 6 mappe · manifest e cache coerenti`);
