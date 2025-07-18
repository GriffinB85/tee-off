const video = document.getElementById("swing");
const feedback = document.getElementById("feedback");
const datalist = document.getElementById("golfers");

const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");
const resultActions = document.getElementById("result-actions");

// ─── Data & Constants ────────────────────────────────────────────────────────
let bios = [];
fetch("data/player_bios.json")
  .then((res) => res.json())
  .then((data) => {
    bios = data;
  });

const BIO_FIELDS = [
  "displayName",
  "countryCode",
  "age",
  "turnedPro",
  "education",
  "careerWins",
  "partners"
];

const clips = [
  { file: "Poston_swing_web_ready.mp4", answer: "J.T. Poston" },
  { file: "DeChambeau_swing_web_ready.mp4", answer: "Bryson DeChambeau" },
  { file: "Scheffler_swing_web_ready.mp4", answer: "Scottie Scheffler" },
  { file: "Morikawa_swing_web_ready.mp4", answer: "Collin Morikawa" },
  { file: "McIlroy_swing_web_ready.mp4", answer: "Rory McIlroy" },
	{ file: "Thomas_swing_web_ready.mp4", answer: "Justin Thomas" },
	{ file: "Schauffele_swing_web_ready.mp4", answer: "Xander Schauffele" }
  // Add more here
];			

const golferNames = [
  "Scottie Scheffler",
  "Rory McIlroy",
  "Xander Schauffele",
  "Justin Thomas",
  "Collin Morikawa",
  "Russell Henley",
  "Keegan Bradley",
  "J.J. Spaun",
  "Ludvig Åberg",
  "Sepp Straka",
  "Hideki Matsuyama",
  "Viktor Hovland",
  "Tommy Fleetwood",
  "Robert MacIntyre",
  "Bryson DeChambeau",
  "Maverick McNealy",
  "Ben Griffin",
  "Shane Lowry",
  "Harris English",
  "Patrick Cantlay",
  "Sam Burns",
  "Tyrrell Hatton",
  "Justin Rose",
  "Corey Conners",
  "Sungjae Im",
  "Brian Harman",
  "Billy Horschel",
  "Jason Day",
  "Ryan Fox",
  "Nick Taylor",
  "Daniel Berger",
  "Wyndham Clark",
  "Aaron Rai",
  "Akshay Bhatia",
  "Min Woo Lee",
  "Thomas Detry",
  "Taylor Pendrith",
  "Cameron Young",
  "Denny McCarthy",
  "Adam Scott",
  "Lucas Glover",
  "J.T. Poston",
  "Tony Finau",
  "Sahith Theegala",
  "Byeong Hun An",
  "Jordan Spieth",
  "Tom Hoge",
  "Will Zalatoris",
  "Gary Woodland",
  "Max Homa",
  "Davis Riley",
  "Mito Pereira",
  "Chris Kirk",
  "Matt Fitzpatrick"
];

let guessCount = 0;
const maxGuesses = 5;
let mode = "daily"; // or "practice"
let current = 0;

populateDatalist();
showBioGrid();
setMode(mode); // Initialize with default mode

// Mode selector
document.getElementById("mode-select")
  .addEventListener("change", e => {
    setMode(e.target.value);
  });


function submitGuess() {
  guessCount++;
  resultActions.innerHTML = ""; // Clear early to avoid wiping buttons later

  const guessInput = document.getElementById("guess");
  const guess = guessInput.value.trim().toLowerCase();
  guessInput.value = "";

  const actual = clips[current].answer.toLowerCase();
  const bio = bios.find(p => p.displayName.toLowerCase() === guess);
  if (bio) populateGridRow(bio);

  if (guess === actual) {
    resultMessage.textContent = "✅ Correct!";
    endRound();
    return;
  }

  if (guessCount >= maxGuesses) {
    resultMessage.textContent = `❌ Out of guesses! It was ${clips[current].answer}`;
    endRound();
    return;
  }

  // Optional: show feedback for incorrect guess
  //resultMessage.textContent = `❌ Nope! Try again (${guessCount}/${maxGuesses})`;
  //resultBox.classList.remove("hidden");
}

function endRound() {
  resultActions.innerHTML = ""; // Ensure clean slate

  const exitBtn = document.createElement("button");
  exitBtn.textContent = "❌ Close";
  exitBtn.onclick = hideResultBox;
  resultActions.appendChild(exitBtn);

  const switchBtn = document.createElement("button");
  switchBtn.textContent = "Go to Practice Mode";
  switchBtn.onclick = () => {
    setMode("practice");
  };
  resultActions.appendChild(switchBtn);

  if (mode === "practice") {
    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Play Again";
    replayBtn.onclick = () => {
      hideResultBox();
      loadClip();
    };
    resultActions.appendChild(replayBtn);
  }

  showResultBox();
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function populateDatalist() {
  golferNames.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    datalist.appendChild(opt);
  });
}

function showBioGrid() {
  const grid = document.getElementById("bio-grid");
  grid.innerHTML = "";
  for (let i = 0; i < 35; i++) {
    const tile = document.createElement("div");
    tile.className = "tile grid-tile";
    grid.appendChild(tile);
  }
}

function populateGridRow(bio) {
  const grid = document.getElementById("bio-grid");
  const rowIndex = guessCount - 1;
  if (rowIndex < 0 || rowIndex >= 5) return;
  for (let i = 0; i < BIO_FIELDS.length; i++) {
    grid.children[rowIndex * 7 + i].textContent =
      bio[BIO_FIELDS[i]] || "";
  }
}

function getDailyIndex() {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let ch of today) hash += ch.charCodeAt(0);
  return hash % clips.length;
}

function loadClip() {
  guessCount = 0;
  hideResultBox();
  showBioGrid();
  
  if (mode === "daily") {
    current = getDailyIndex();
  } else {
    current = Math.floor(Math.random() * clips.length);
  }
  video.src = `silhouettes/${clips[current].file}`;
}

function setMode(selected) {
  mode = selected;
  loadClip();
  feedback.textContent = "";
  document.getElementById("guess").value = "";
}

function showResultBox() {
  resultBox.classList.add("visible");
}

function hideResultBox() {
  resultBox.classList.remove("visible");
}

function playAgain() {
  resultBox.style.display = "none";
  loadClip();
}

