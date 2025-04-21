const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category');
let questions = [];
let currentIndex = 0;
let score = 0;

async function loadQuestions() {
  const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  const questionData = questions[currentIndex];
  const container = document.getElementById('question-container');
  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
  allAnswers.sort(() => Math.random() - 0.5); // Shuffle options

  container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Q${currentIndex + 1}: ${decodeHtml(questionData.question)}</h2>
    <form id="options-form" class="space-y-3">
      ${allAnswers.map(ans => `
        <label class="block cursor-pointer">
          <input type="radio" name="answer" value="${ans}" class="mr-2">
          ${decodeHtml(ans)}
        </label>
      `).join('')}
    </form>
  `;

  const form = document.getElementById('options-form');
  form.addEventListener('change', () => {
    document.getElementById('next-btn').disabled = false;
  });
}

document.getElementById('next-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected && selected.value === questions[currentIndex].correct_answer) {
    score++;
  }
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
    document.getElementById('next-btn').disabled = true;
  } else {
    showResult();
  }
});

function showResult() {
  const container = document.getElementById('question-container');
  container.innerHTML = `
    <h2 class="text-2xl font-bold text-green-600">🎉 Quiz Completed!</h2>
    <p class="mt-4 text-lg">Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <a href="index.html" class="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔙 Back to Home</a>
  `;
  document.getElementById('next-btn').style.display = 'none';
}

loadQuestions();