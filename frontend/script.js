const video = document.getElementById("swing");
const feedback = document.getElementById("feedback");
const datalist = document.getElementById("golfers");

const clips = [
  { file: "Poston_swing_web_ready.mp4", answer: "J.T. Poston" },
  { file: "Bryson_swing_web_ready.mp4", answer: "Bryson DeChambeau" },
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
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  const actual = clips[current].answer.toLowerCase();

  if (guess === actual) {
    feedback.textContent = "✅ Correct!";
  } else {
    feedback.textContent = "❌ Nope! It's " + clips[current].answer;
  }

  if (mode === "daily") {
    // ✅ Wait for feedback, then offer switch prompt
    setTimeout(() => {
      const switchPrompt = confirm("Would you like to enter Practice Mode?");
      if (switchPrompt) {
        setMode("practice");
      }
    }, 2000);
  } else {
    // 🔄 Practice Mode — loop to next clip
    setTimeout(() => {
      loadClip();
      feedback.textContent = "";
      document.getElementById("guess").value = "";
    }, 3000);
  }

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
  if (mode === "daily") {
    current = getDailyIndex();
  } else {
    current = Math.floor(Math.random() * clips.length);
  }
  video.src = "silhouettes/" + clips[current].file;
}

function setMode(selected) {
  mode = selected;
  loadClip();
  feedback.textContent = "";
  document.getElementById("guess").value = "";
}
