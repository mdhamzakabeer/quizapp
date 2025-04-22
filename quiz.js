// 🧠 Decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

let questions = [];
let currentIndex = 0;
let score = 0;

// 📥 Load Questions from API or Local Storage based on the URL parameters
async function loadQuestions() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');  // category parameter for API-based selection
  const quizId = urlParams.get('id');            // id parameter for direct access

  if (categoryId) {
    // If category is provided, fetch data from API
    await fetchQuestionsFromAPI(categoryId);
  } else if (quizId) {
    // If id is provided, fetch data from localStorage
    await loadQuestionsFromLocalStorage(quizId);
  } else {
    alert("No category or id provided. Redirecting to home page...");
    window.location.href = "index.html";
  }
}

// 📥 Fetch Questions from API using categoryId
async function fetchQuestionsFromAPI(categoryId) {
  const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

// 📥 Load Questions from LocalStorage using quizId
async function loadQuestionsFromLocalStorage(quizId) {
  let quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
  let savedQuiz = quizData.find(item => item.quizId === quizId);

  if (savedQuiz) {
    questions = savedQuiz.questions;
    currentIndex = savedQuiz.currentIndex || 0;
    score = savedQuiz.score || 0;
    showQuestion();
  } else {
    alert("Quiz not found in localStorage. Redirecting to home page...");
    window.location.href = "index.html";
  }
}

// 📄 Display the current question
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

  // Initially disable next button
  document.getElementById('next-btn').disabled = true;

  const form = document.getElementById('options-form');
  form.addEventListener('change', () => {
    document.getElementById('next-btn').disabled = false;
  });

  // Show/hide back button
  const backBtn = document.getElementById('back-btn');
  backBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
}

// ✅ Handle Next button click
document.getElementById('next-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected && selected.value === questions[currentIndex].correct_answer) {
    score++;
  }
  currentIndex++;

  // Save the current progress in localStorage
  saveProgress();

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// 🔙 Handle Back button click
document.getElementById('back-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// 🏁 Show Final Result
function showResult() {
  const container = document.getElementById('question-container');
  saveProgress();

  container.innerHTML = `
    <h2 class="text-2xl font-bold text-green-600">Quiz Completed!</h2>
    <p class="mt-4 text-lg">Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <a href="results.html" class="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">📜 View All Results</a><br>
    <a href="index.html" class="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔙 Back to Home</a>
  `;

  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('back-btn').style.display = 'none';
}

// Save current progress to localStorage
function saveProgress() {
  let quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
  let savedQuiz = quizData.find(item => item.quizId === quizId);

  if (savedQuiz) {
    savedQuiz.score = score;
    savedQuiz.currentIndex = currentIndex;
  } else {
    quizData.push({
      quizId: quizId,
      questions: questions,
      score: score,
      currentIndex: currentIndex,
      date: new Date().toLocaleString()
    });
  }

  localStorage.setItem("quizResults", JSON.stringify(quizData));
}

// 🚀 Initialize everything on window load
window.addEventListener('load', () => {
  loadQuestions();
});
