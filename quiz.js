// 🧠 Decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

let questions = [];
let currentIndex = 0;
let score = 0;

// 📥 Load Questions from API
async function loadQuestions(categoryId) {
  const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
  const data = await res.json();
  questions = data.results;
  showQuestion();
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

  // Prepare result data
  const quizResult = {
    categoryId: categoryId,
    score: score,
    total: questions.length,
    date: new Date().toLocaleString()
  };

  // Save result to localStorage
  let savedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
  savedResults.push(quizResult);
  localStorage.setItem("quizResults", JSON.stringify(savedResults));

  // Show result message + link to view all results
  container.innerHTML = `
    <h2 class="text-2xl font-bold text-green-600">Quiz Completed!</h2>
    <p class="mt-4 text-lg">Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <a href="results.html" class="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">📜 View All Results</a><br>
    <a href="index.html" class="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔙 Back to Home</a>
  `;

  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('back-btn').style.display = 'none';
}

// ❌ Quit confirmation handler
function quitMcqs() {
  const quitClick = document.getElementById("quit-click");
  if (quitClick) {
    quitClick.addEventListener("click", function (e) {
      const confirmed = confirm("Are you sure you want to quit the MCQs?");
      if (!confirmed) {
        e.preventDefault();
      }
    });
  }
}

// 🚀 Initialize everything on window load
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');

  if (!categoryId) {
    alert("No category selected. Redirecting to home page...");
    window.location.href = "index.html";
    return;
  }

  quitMcqs();
  loadQuestions(categoryId);
});
