const video = document.getElementById("swing");
const feedback = document.getElementById("feedback");

const clips = [
  { file: "Poston_swing_web_ready.mp4", answer: "J.T. Poston" },
  { file: "Bryson_swing_web_ready.mp4", answer: "Bryson DeChambeau" },
  // Add more here
];

let current = 0;
video.src = "../Silhouettes/silhouettes/" + clips[current].file;

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
    video.src = "../Silhouettes/silhouettes/" + clips[current].file;
    feedback.textContent = "";
    document.getElementById("guess").value = "";
  }, 3000);
}