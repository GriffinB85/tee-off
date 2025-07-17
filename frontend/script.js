const video = document.getElementById("swing");
const feedback = document.getElementById("feedback");
const datalist = document.getElementById("golfers");

const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");
const resultActions = document.getElementById("result-actions");

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

console.log("Script.js is running");

let guessCount = 0;
const maxGuesses = 5;
showBioGrid();

function showBioGrid() {
  const grid = document.getElementById("bio-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 35; i++) {
    const tile = document.createElement("div");
    tile.className = "tile grid-tile";
    tile.textContent = "";
    grid.appendChild(tile);
  }
}

function populateGridRow(bio) {
  const grid = document.getElementById("bio-grid");
  const rowIndex = guessCount - 1; // zero-based row index

  if (rowIndex >= 5) return; // safeguard: max 5 rows

  for (let i = 0; i < 7; i++) {
    const field = BIO_FIELDS[i];
    const value = bio?.[field] || "";
    const tileIndex = rowIndex * 7 + i;

    grid.children[tileIndex].textContent = value;
  }
}

// 🧠 Populate datalist options
golferNames.forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  datalist.appendChild(option);
});

let mode = "daily"; // or "practice"

let current = 0;
video.src = "silhouettes/" + clips[current].file;

function submitGuess() {
  guessCount++;

  const guess = document.getElementById("guess").value.trim().toLowerCase();
  const actual = clips[current].answer.toLowerCase();

	document.getElementById("guess").value = "";

	if (guess === actual) {
    resultMessage.textContent = "✅ Correct!";
    resultBox.classList.remove("hidden");
    endRound(); // ends the round early
  } else if (guessCount >= maxGuesses) {
    resultMessage.textContent = `❌ Out of guesses! It was ${clips[current].answer}`;
    resultBox.classList.remove("hidden");
    endRound(); // max guesses reached
  } else {
    //resultMessage.textContent = `❌ Nope! Try again (${guessCount}/${maxGuesses})`;
    //resultBox.classList.remove("hidden");
  }
  //console.log("Bio count:", bios.length);

  const bio = bios.find(p => p.displayName.toLowerCase() === guess);
  //console.log("Looking for bio of:", guess_name);
  //console.log("Matched bio:", bio);

  if (bio) populateGridRow(bio);

	resultActions.innerHTML = "";

  if (mode === "daily") {
    const switchBtn = document.createElement("button");
    switchBtn.textContent = "Go to Practice Mode";
    switchBtn.onclick = () => {
      setMode("practice");
      resultBox.classList.add("hidden");
    };
    resultActions.appendChild(switchBtn);
  } else {
    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Play Again";
    replayBtn.onclick = () => {
      resultBox.classList.add("hidden");
      loadClip();
    };
    resultActions.appendChild(replayBtn);
  }

  const tileContainer = document.getElementById("bio-tiles");
  tileContainer.innerHTML = ""; // reset on each guess

  for (let i = 0; i < 6; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = ""; // will fill later with bio info
    tileContainer.appendChild(tile);
  }

  tileContainer.classList.remove("hidden");
  
}

function endRound() {
  resultActions.innerHTML = "";
  if (mode === "daily") {
    const switchBtn = document.createElement("button");
    switchBtn.textContent = "Go to Practice Mode";
    switchBtn.onclick = () => {
      setMode("practice");
      resultBox.classList.add("hidden");
    };
    resultActions.appendChild(switchBtn);
  } else {
    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Play Again";
    replayBtn.onclick = () => {
      resultBox.classList.add("hidden");
      loadClip();
    };
    resultActions.appendChild(replayBtn);
  }

  resultBox.classList.remove("hidden");
}

function getDailyIndex() {
  const today = new Date().toISOString().slice(0, 10); // e.g., "2025-07-13"
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash += today.charCodeAt(i);
  }
  return hash % clips.length;
}

function loadClip() {
  guessCount = 0; // reset guess count

  if (mode === "daily") {
    current = getDailyIndex();
  } else {
    current = Math.floor(Math.random() * clips.length);
  }
  video.src = "silhouettes/" + clips[current].file;
}

function setMode(selected) {
  guessCount = 0; // reset guess count

  mode = selected;
  loadClip();
  feedback.textContent = "";
  document.getElementById("guess").value = "";
}

function playAgain() {
  resultBox.classList.add("hidden");
  loadClip();
}

