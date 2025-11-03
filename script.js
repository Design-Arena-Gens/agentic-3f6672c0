// Datenbasis: 10 Katzenrassen (deutsche Inhalte) + Wikipedia-Titel f?r Bildsuche
const BREEDS = [
  {
    name: "Maine Coon",
    wikipediaTitle: "Maine Coon",
    origin: "USA",
    temperament: ["freundlich", "intelligent", "sozial"],
    lifespan: "12?15 Jahre",
    description:
      "Gro?e, sanftm?tige Rasse mit buschigem Schwanz und Halskragen; gilt als sehr menschenbezogen und verspielt.",
    fact: "Wird oft als 'sanfter Riese' bezeichnet.",
  },
  {
    name: "Siam",
    wikipediaTitle: "Siamese cat",
    origin: "Thailand",
    temperament: ["gespr?chig", "anh?nglich", "aktiv"],
    lifespan: "12?20 Jahre",
    description:
      "Schlanke, elegante Katze mit Point-Zeichnung und intensiven blauen Augen; ?u?erst kommunikativ.",
    fact: "War einst eine Tempelkatze in Siam (heute Thailand).",
  },
  {
    name: "Perser",
    wikipediaTitle: "Persian cat",
    origin: "Iran",
    temperament: ["ruhig", "sanft", "gelassen"],
    lifespan: "12?17 Jahre",
    description:
      "Langhaarkatze mit rundem Kopf und kurzer Nase; liebt ein ruhiges Umfeld und regelm??ige Fellpflege.",
    fact: "Zu den ?ltesten anerkannten Rassen der Welt.",
  },
  {
    name: "Bengal",
    wikipediaTitle: "Bengal cat",
    origin: "USA",
    temperament: ["aktiv", "neugierig", "verspielt"],
    lifespan: "12?16 Jahre",
    description:
      "Kurzes, leoparden?hnliches Fell mit Rosetten; sehr agil und kletterfreudig.",
    fact: "Entstand aus der Kreuzung Hauskatze ? Asiatische Bengalkatze.",
  },
  {
    name: "Sphynx",
    wikipediaTitle: "Sphynx cat",
    origin: "Kanada",
    temperament: ["anh?nglich", "menschenbezogen", "aktiv"],
    lifespan: "9?15 Jahre",
    description:
      "Nacktkatze mit samtiger Haut; braucht W?rmequellen und regelm??ige Hautpflege.",
    fact: "Trotz fehlenden Fells sehr verschmust und w?rmesuchend.",
  },
  {
    name: "Britisch Kurzhaar",
    wikipediaTitle: "British Shorthair",
    origin: "Vereinigtes K?nigreich",
    temperament: ["ausgeglichen", "ruhig", "freundlich"],
    lifespan: "12?20 Jahre",
    description:
      "Massige, teddyb?rartige Katze, oft in Blau; pflegeleichtes Fell und sanftes Wesen.",
    fact: "Ber?hmt f?r ihr rundes Gesicht und bernsteinfarbene Augen.",
  },
  {
    name: "Ragdoll",
    wikipediaTitle: "Ragdoll",
    origin: "USA",
    temperament: ["gelassen", "liebenswert", "sozial"],
    lifespan: "12?17 Jahre",
    description:
      "Gro?e, halblanghaarige Katze, entspannt beim Hochheben ? daher der Name 'Ragdoll'.",
    fact: "Neigt dazu, beim Tragen schlaff zu werden (entspannt).",
  },
  {
    name: "Abessinier",
    wikipediaTitle: "Abyssinian cat",
    origin: "?thiopien (historisch)",
    temperament: ["aktiv", "neugierig", "menschenbezogen"],
    lifespan: "12?15 Jahre",
    description:
      "Kurzhaar mit geticktem Fell (Agouti); lebhaft und intelligent, liebt Interaktion.",
    fact: "Das getickte Fell verleiht einen 'wildtier?hnlichen' Look.",
  },
  {
    name: "Scottish Fold",
    wikipediaTitle: "Scottish Fold",
    origin: "Schottland",
    temperament: ["sanft", "freundlich", "ruhig"],
    lifespan: "11?14 Jahre",
    description:
      "Bekannt f?r nach vorn gefaltete Ohren; ruhiges, anh?ngliches Wesen.",
    fact: "Die gefalteten Ohren sind auf eine Knorpelmutation zur?ckzuf?hren.",
  },
  {
    name: "Norwegische Waldkatze",
    wikipediaTitle: "Norwegian Forest cat",
    origin: "Norwegen",
    temperament: ["robust", "freundlich", "kletterfreudig"],
    lifespan: "12?16 Jahre",
    description:
      "Halblanghaarige, kr?ftige Waldkatze mit wasserabweisendem Fell; exzellente Kletterin.",
    fact: "In nordischer Mythologie wurde eine gro?e Waldkatze erw?hnt.",
  },
];

// Einfacher Cache f?r Wikipedia-Bilder
const imageCache = new Map();

async function fetchWikipediaImage(title) {
  if (imageCache.has(title)) return imageCache.get(title);
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url, { headers: { "accept": "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const src = data?.thumbnail?.source || data?.originalimage?.source || "";
    if (src) imageCache.set(title, src);
    return src;
  } catch (e) {
    console.warn("Bild konnte nicht geladen werden f?r", title, e);
    return "";
  }
}

// Pr?sentation
let currentIndex = 0;

const elImg = document.getElementById("breed-image");
const elTitle = document.getElementById("presentation-title");
const elDesc = document.getElementById("breed-description");
const elFacts = document.getElementById("breed-facts");
const elProgressBar = document.getElementById("progress-bar");
const elProgressText = document.getElementById("progress-text");

async function renderSlide(index) {
  const total = BREEDS.length;
  const i = ((index % total) + total) % total; // clamp ring
  currentIndex = i;
  const b = BREEDS[i];

  elTitle.textContent = b.name;
  elDesc.textContent = b.description;
  elFacts.innerHTML = "";
  const facts = [
    `Herkunft: ${b.origin}`,
    `Temperament: ${b.temperament.join(", ")}`,
    `Lebenserwartung: ${b.lifespan}`,
    `Fun Fact: ${b.fact}`,
  ];
  for (const f of facts) {
    const li = document.createElement("li");
    li.textContent = f;
    elFacts.appendChild(li);
  }

  elImg.src = "";
  elImg.alt = `Bild: ${b.name}`;
  const src = await fetchWikipediaImage(b.wikipediaTitle);
  if (src) {
    elImg.src = src;
  } else {
    elImg.alt = `Kein Bild gefunden ? ${b.name}`;
  }

  const pct = Math.round(((i + 1) / total) * 100);
  elProgressBar.style.width = pct + "%";
  elProgressText.textContent = `${i + 1} / ${total}`;
}

// Navigation
function nextSlide() { renderSlide(currentIndex + 1); }
function prevSlide() { renderSlide(currentIndex - 1); }

document.getElementById("next").addEventListener("click", nextSlide);
const prevBtn = document.getElementById("prev");
prevBtn.addEventListener("click", prevSlide);

window.addEventListener("keydown", (e) => {
  if (document.getElementById("presentation").hidden) return;
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

// Tabs
const tabPresentation = document.getElementById("tab-presentation");
const tabQuiz = document.getElementById("tab-quiz");
const sectionPresentation = document.getElementById("presentation");
const sectionQuiz = document.getElementById("quiz");

function activateTab(which) {
  const isPres = which === "presentation";
  tabPresentation.classList.toggle("active", isPres);
  tabQuiz.classList.toggle("active", !isPres);
  tabPresentation.setAttribute("aria-pressed", String(isPres));
  tabQuiz.setAttribute("aria-pressed", String(!isPres));
  sectionPresentation.hidden = !isPres;
  sectionQuiz.hidden = isPres;
}

tabPresentation.addEventListener("click", () => activateTab("presentation"));
tabQuiz.addEventListener("click", () => activateTab("quiz"));

// Quiz-Logik
let quizState = {
  questions: [],
  index: 0,
  score: 0,
};

function shuffle(arr) {
  return arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

function makeQuestions() {
  // Eine Frage pro Rasse: Beschreibung ? Welche Rasse ist es?
  const names = BREEDS.map((b) => b.name);
  const qs = BREEDS.map((b) => {
    const wrong = shuffle(names.filter((n) => n !== b.name)).slice(0, 3);
    const options = shuffle([b.name, ...wrong]);
    return {
      prompt: `Welche Rasse passt zur Beschreibung: "${b.description}"`,
      options,
      answer: b.name,
    };
  });
  return shuffle(qs);
}

const elIntro = document.getElementById("quiz-intro");
const elCard = document.getElementById("quiz-card");
const elResult = document.getElementById("quiz-result");
const elQ = document.getElementById("quiz-question");
const elOpts = document.getElementById("quiz-options");
const elNext = document.getElementById("quiz-next");
const elCounter = document.getElementById("quiz-counter");
const elScore = document.getElementById("quiz-score");
const elResultText = document.getElementById("result-text");

function startQuiz() {
  quizState = { questions: makeQuestions(), index: 0, score: 0 };
  elIntro.hidden = true;
  elCard.hidden = false;
  elResult.hidden = true;
  renderQuestion();
}

document.getElementById("start-quiz").addEventListener("click", startQuiz);
document.getElementById("retry-quiz").addEventListener("click", startQuiz);

function renderQuestion() {
  const { questions, index, score } = quizState;
  const total = questions.length;
  const q = questions[index];
  elCounter.textContent = `Frage ${index + 1} / ${total}`;
  elScore.textContent = `Punkte: ${score}`;
  elQ.textContent = q.prompt;
  elOpts.innerHTML = "";
  elNext.disabled = true;

  q.options.forEach((opt, idx) => {
    const label = document.createElement("label");
    label.className = "option";
    label.setAttribute("role", "listitem");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "quiz-option";
    input.value = String(idx);

    const span = document.createElement("span");
    span.textContent = opt;

    label.appendChild(input);
    label.appendChild(span);
    elOpts.appendChild(label);

    input.addEventListener("change", () => {
      // auswerten
      const chosen = q.options[idx];
      const correct = q.answer;
      const labels = Array.from(elOpts.querySelectorAll(".option"));
      labels.forEach((lab, i) => {
        const isCorrect = q.options[i] === correct;
        lab.classList.toggle("correct", isCorrect);
        lab.classList.toggle("wrong", !isCorrect && i === idx);
      });
      if (chosen === correct) quizState.score += 1;
      elScore.textContent = `Punkte: ${quizState.score}`;
      elNext.disabled = false;
      // Optionen sperren
      labels.forEach((lab) => lab.querySelector("input").disabled = true);
    });
  });
}

elNext.addEventListener("click", () => {
  quizState.index += 1;
  if (quizState.index >= quizState.questions.length) {
    // Ergebnis
    const total = quizState.questions.length;
    const pct = Math.round((quizState.score / total) * 100);
    elResultText.textContent = `Du hast ${quizState.score} von ${total} richtig (${pct}%).`;
    elCard.hidden = true;
    elResult.hidden = false;
  } else {
    renderQuestion();
  }
});

// Initial laden
activateTab("presentation");
renderSlide(0);
