// result.js

// Decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

window.addEventListener("load", () => {
  const resultBox = document.getElementById("results-container");
  const results = JSON.parse(localStorage.getItem("quizResults")) || [];

  if (results.length === 0) {
    resultBox.innerHTML = `<p class="text-lg">No quiz results found. Please attempt a quiz first.</p>`;
    return;
  }

  // Show latest result on top
  const latest = results[results.length - 1];
  resultBox.innerHTML = `
    <p class="text-lg font-semibold mb-2 text-green-600">✅ Score: ${latest.score} / ${latest.questions.length}</p>
    <p class="text-sm text-gray-500 mb-4">🕒 Attempted on: ${latest.date}</p>
    <div class="space-y-4">
      ${latest.questions.map((q, index) => {
        const correct = (q.correct || q.correct_answer || "").toLowerCase().trim();
        const userAnswer = (q.userAnswer || "").toLowerCase().trim();
        const isCorrect = correct === userAnswer;

        return `
          <div class="p-4 border rounded ${isCorrect ? 'bg-green-50' : 'bg-red-50'}">
            <p class="font-medium">Q${index + 1}: ${decodeHtml(q.question)}</p>
            <p class="mt-1">✅ Correct: <strong>${decodeHtml(correct)}</strong></p>
            <p class="mt-1">🧑 Your Answer: <strong class="${isCorrect ? 'text-green-600' : 'text-red-600'}">${decodeHtml(userAnswer || "Not Answered")}</strong></p>
          </div>
        `;
      }).join("")}
    </div>
  `;
});
