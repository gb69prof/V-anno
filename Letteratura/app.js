"use strict";

const lessons = [
  { name: "Decadentismo", path: "./Decadentismo/index.html", available: false, type: "current", stage: 1, box: [2.8, 62.8, 9.6, 7.2] },
  { name: "Avanguardie", path: "./Avanguardie/index.html", available: false, type: "current", stage: 2, box: [12.8, 62.8, 9.6, 7.2] },
  { name: "Futurismo", path: "./Futurismo/index.html", available: true, type: "current", stage: 2, box: [22.8, 62.8, 9.6, 7.2] },
  { name: "Ermetismo", path: "./Ermetismo/index.html", available: true, type: "current", stage: 3, box: [32.8, 62.8, 9.6, 7.2] },
  { name: "Neorealismo", path: "./Neorealismo/index.html", available: true, type: "current", stage: 4, box: [42.8, 62.8, 9.6, 7.2] },
  { name: "D’Annunzio", path: "./D’Annunzio/index.html", available: true, type: "author", stage: 1, box: [52.8, 62.8, 9.6, 7.2] },
  { name: "Pascoli", path: "./Pascoli/index.html", available: false, type: "author", stage: 1, box: [62.8, 62.8, 9.6, 7.2] },
  { name: "Svevo", path: "./Svevo/index.html", available: true, type: "author", stage: 3, box: [72.8, 62.8, 9.6, 7.2] },
  { name: "Pirandello", path: "./Pirandello/index.html", available: true, type: "author", stage: 3, box: [82.8, 62.8, 9.6, 7.2] },

  { name: "Ungaretti", path: "./Ungaretti/index.html", available: true, type: "author", stage: 3, box: [2.8, 70.1, 9.6, 7.2] },
  { name: "Saba", path: "./Saba/index.html", available: true, type: "author", stage: 3, box: [12.8, 70.1, 9.6, 7.2] },
  { name: "Quasimodo", path: "./Quasimodo/index.html", available: false, type: "author", stage: 3, box: [22.8, 70.1, 9.6, 7.2] },
  { name: "Montale", path: "./Montale/index.html", available: true, type: "author", stage: 3, box: [32.8, 70.1, 9.6, 7.2] },
  { name: "Gadda", path: "./Gadda/index.html", available: true, type: "author", stage: 4, box: [42.8, 70.1, 9.6, 7.2] },
  { name: "Vittorini", path: "./Vittorini/index.html", available: true, type: "author", stage: 4, box: [52.8, 70.1, 9.6, 7.2] },
  { name: "Pavese", path: "./Pavese/index.html", available: true, type: "author", stage: 4, box: [62.8, 70.1, 9.6, 7.2] },
  { name: "Primo Levi", path: "./Primo-Levi/index.html", available: false, type: "author", stage: 4, box: [72.8, 70.1, 9.6, 7.2] },
  { name: "Morante", path: "./Morante/index.html", available: true, type: "author", stage: 4, box: [82.8, 70.1, 9.6, 7.2] },

  { name: "Ginzburg", path: "./Ginzburg/index.html", available: true, type: "author", stage: 4, box: [15.6, 77.3, 10.2, 7.2] },
  { name: "Pasolini", path: "./Pasolini/index.html", available: true, type: "author", stage: 4, box: [30.3, 77.3, 10.2, 7.2] },
  { name: "Sciascia", path: "./Sciascia/index.html", available: true, type: "author", stage: 4, box: [45.0, 77.3, 10.2, 7.2] },
  { name: "Calvino", path: "./Calvino/index.html", available: true, type: "author", stage: 4, box: [59.7, 77.3, 10.2, 7.2] },
  { name: "Buzzati", path: "./Buzzati/index.html", available: true, type: "author", stage: 4, box: [69.0, 77.3, 10.2, 7.2] }
];

const stages = [
  {
    number: 1,
    title: "Il tramonto dell’Ottocento",
    description: "Decadentismo, D’Annunzio e Pascoli",
    box: [2.5, 36.4, 23.2, 24.0]
  },
  {
    number: 2,
    title: "La modernità in corsa",
    description: "Avanguardie e Futurismo",
    box: [27.0, 36.4, 22.0, 24.0]
  },
  {
    number: 3,
    title: "Crisi dell’io e poesia",
    description: "Svevo, Pirandello, Ungaretti, Saba, Quasimodo, Montale ed Ermetismo",
    box: [50.1, 36.4, 22.0, 24.0]
  },
  {
    number: 4,
    title: "Dopoguerra e secondo Novecento",
    description: "Neorealismo e gli autori del secondo Novecento",
    box: [73.3, 36.4, 23.6, 24.0]
  }
];

const primaryActions = [
  { label: "Home", box: [8.0, 1.7, 10.8, 3.2], action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  { label: "Percorso", box: [20.5, 1.7, 13.2, 3.2], action: () => openIndex("all") },
  { label: "Correnti", box: [34.7, 1.7, 13.0, 3.2], action: () => openIndex("current") },
  { label: "Autori", box: [49.2, 1.7, 11.0, 3.2], action: () => openIndex("author") },
  { label: "Mappe", box: [60.8, 1.7, 11.4, 3.2], action: () => openIndex("maps") },
  { label: "Entra nel Novecento", box: [75.0, 1.5, 21.5, 3.6], action: () => openIndex("all") }
];

const dialog = document.querySelector("#lesson-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogList = document.querySelector("#dialog-list");
const toast = document.querySelector("#toast");
let toastTimer;

function applyBox(element, box) {
  const [left, top, width, height] = box;
  element.style.left = `${left}%`;
  element.style.top = `${top}%`;
  element.style.width = `${width}%`;
  element.style.height = `${height}%`;
}

function makeButton(label, box, action, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `hotspot ${extraClass}`.trim();
  button.setAttribute("aria-label", label);
  applyBox(button, box);
  button.addEventListener("click", action);
  return button;
}

function makeLessonLink(lesson, className = "hotspot is-medallion") {
  const link = document.createElement("a");
  link.className = `${className}${lesson.available ? "" : " is-pending"}`;
  link.href = lesson.path;
  link.dataset.available = String(lesson.available);
  link.dataset.lesson = lesson.name;
  link.setAttribute(
    "aria-label",
    lesson.available ? `Apri la lezione: ${lesson.name}` : `${lesson.name}: lezione in preparazione`
  );

  if (lesson.box) {
    applyBox(link, lesson.box);
  }

  if (!lesson.available) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (link.closest("dialog")?.open) {
        dialog.close();
      }
      showToast(`${lesson.name}: lezione in preparazione.`);
    });
  }

  return link;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function getDialogContent(filter) {
  if (typeof filter === "number") {
    const stage = stages.find((item) => item.number === filter);
    return {
      title: `${stage.number} — ${stage.title}`,
      description: stage.description,
      items: lessons.filter((lesson) => lesson.stage === filter)
    };
  }

  const configurations = {
    current: {
      title: "Indice delle correnti",
      description: "Dal Decadentismo al Neorealismo.",
      items: lessons.filter((lesson) => lesson.type === "current")
    },
    author: {
      title: "Indice degli autori",
      description: "Da D’Annunzio a Buzzati.",
      items: lessons.filter((lesson) => lesson.type === "author")
    },
    maps: {
      title: "Mappe concettuali",
      description: "Le lezioni attive contengono mappe concettuali nelle rispettive sezioni.",
      items: lessons.filter((lesson) => lesson.available)
    },
    all: {
      title: "Indice completo",
      description: "Tutte le 23 diramazioni del percorso. Le lezioni non ancora disponibili sono già predisposte.",
      items: lessons
    }
  };

  return configurations[filter] || configurations.all;
}

function openIndex(filter) {
  const content = getDialogContent(filter);
  dialogTitle.textContent = content.title;
  dialogDescription.textContent = content.description;
  dialogList.replaceChildren();

  content.items.forEach((lesson) => {
    const link = makeLessonLink(lesson, "dialog-item");
    const name = document.createElement("span");
    const status = document.createElement("small");
    name.textContent = lesson.name;
    status.textContent = lesson.available ? "Apri →" : "In preparazione";
    link.append(name, status);
    dialogList.append(link);
  });

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

primaryActions.forEach((item) => {
  document.querySelector("#primary-hotspots").append(
    makeButton(item.label, item.box, item.action, "is-primary")
  );
});

stages.forEach((stage) => {
  document.querySelector("#stage-hotspots").append(
    makeButton(
      `Tappa ${stage.number}: ${stage.title}. ${stage.description}`,
      stage.box,
      () => openIndex(stage.number),
      "is-stage"
    )
  );
});

lessons.forEach((lesson) => {
  document.querySelector("#lesson-hotspots").append(makeLessonLink(lesson));
});

document.querySelector("#index-hotspots").append(
  makeButton("Apri l’indice delle correnti", [2.4, 83.5, 46.7, 7.0], () => openIndex("current"), "is-index"),
  makeButton("Apri l’indice degli autori", [50.6, 83.5, 46.7, 7.0], () => openIndex("author"), "is-index")
);

document.querySelector("#mobile-index").addEventListener("click", () => openIndex("all"));
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (outside) {
    dialog.close();
  }
});
