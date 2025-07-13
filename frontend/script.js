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

  current = (current + 1) % clips.length;
  setTimeout(() => {
    video.src = "silhouettes/" + clips[current].file;
    feedback.textContent = "";
    document.getElementById("guess").value = "";
  }, 3000);
}