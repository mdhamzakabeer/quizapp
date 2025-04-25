let questions = [];
let currentIndex = 0;
let score = 0;
let quizId = null;

// Decode HTML entities (API questions are encoded)
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// quiz.js

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");
const resultContainer = document.getElementById("result-container");

let correctAnswers = 0;

fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`)
  .then(res => res.json())
  .then(data => {
    // ✅ Store all correct answers in a global variable
    window.correctAnswers = data.results.map(q => q.correct_answer);

    // ✅ Now start rendering the questions
    data.results.forEach((questionObj, index) => {
      const questionCard = document.createElement("div");
      questionCard.classList.add("question-card");

      const question = document.createElement("h3");
      question.innerHTML = `${index + 1}. ${questionObj.question}`;

      const answers = [...questionObj.incorrect_answers];
      const correct = questionObj.correct_answer;
      const randomIndex = Math.floor(Math.random() * 4);
      answers.splice(randomIndex, 0, correct); // insert correct at random

      const options = answers.map(answer => {
        return `
          <label>
            <input type="radio" name="q${index}" value="${answer}">
            ${answer}
          </label>
        `;
      }).join("<br>");

      questionCard.innerHTML = `${question.outerHTML}<div>${options}</div>`;
      quizContainer.appendChild(questionCard);
    });
  });

// Handle submission
submitBtn.addEventListener("click", () => {
  const questions = document.querySelectorAll(".question-card");

  correctAnswers = 0;
  questions.forEach((question, index) => {
    const selected = question.querySelector(`input[name="q${index}"]:checked`);
    const correctAnswer = question.querySelector(`input[value="${decodeURIComponent(window.correctAnswer)}"]`);
    const correct = decodeURIComponent(window.correctAnswers[index]);

    if (selected && selected.value === correct) {
      correctAnswers++;
    }
  });

  resultContainer.innerHTML = `
    <h2 class="text-xl font-bold mt-4 text-green-600">You got ${correctAnswers} out of ${questions.length} correct!</h2>
  `;
});


// 🔌 Fetch questions from OpenTDB API
async function fetchQuestionsFromAPI(categoryId) {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
    const data = await res.json();
    questions = data.results;
    currentIndex = 0;
    score = 0;
    showQuestion();
  } catch (error) {
    console.error("API fetch error:", error);
    alert("Failed to load questions from API.");
  }
}

// 📥 Load questions from locally stored quizzes
function loadQuestionsFromLocalQuizzes(quizId) {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const matchedQuiz = quizzes.find(quiz => quiz.id === quizId);

  if (matchedQuiz) {
    console.log(matchedQuiz)
    questions = matchedQuiz.questions;
    console.log(questions)
    currentIndex = 0;
    score = 0;
    showQuestion();
  } else {
    alert("Quiz not found locally. Redirecting to home.");
    window.location.href = "index.html";
  }
}

// 🧠 Show current question

function showQuestion() {
  const questionData = questions[currentIndex];
  const container = document.getElementById('question-container');

  // Determine the correct answer and options dynamically
  const correct = questionData.correct || questionData.correct_answer;
  const options = questionData.options || [...questionData.incorrect_answers];

  // Ensure no duplicates of the correct answer
  const allAnswers = [...options.filter(opt => opt.toLowerCase() !== correct.toLowerCase()), correct.toLowerCase()];

  console.log("Current question:", questionData.question);
  console.log("Answer options:", allAnswers);

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

  document.getElementById('next-btn').disabled = true;

  const form = document.getElementById('options-form');
  form.addEventListener('change', () => {
    document.getElementById('next-btn').disabled = false;
  });

  document.getElementById('back-btn').style.display = currentIndex === 0 ? 'none' : 'inline-block';
}


// 👉 Handle "Next" button

document.getElementById('next-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  const currentQuestion = questions[currentIndex];
  const correctAnswer = (currentQuestion.correct || currentQuestion.correct_answer || "").trim().toLowerCase();

  if (selected) {
    const selectedAnswer = selected.value.trim().toLowerCase();
    questions[currentIndex].userAnswer = selectedAnswer;
    if (selectedAnswer === correctAnswer) {
      score++;
    }
  } else {
    questions[currentIndex].userAnswer = ""; 
  }
  

  currentIndex++;

  if (quizId) saveProgress();

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// 🔙 Handle "Back" button
document.getElementById('back-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// 🏁 Show final result
function showResult() {
  const container = document.getElementById('question-container');
  if (quizId) saveProgress();

  container.innerHTML = `
    <h2 class="text-2xl font-bold text-green-600">Quiz Completed!</h2>
    <p class="mt-4 text-lg">Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <a href="result.html" class="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">📜 View All Results</a><br>
    <a href="index.html" class="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔙 Back to Home</a>
  `;

  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('back-btn').style.display = 'none';
}

// 💾 Save quiz progress (local quizzes only)
function saveProgress() {
  let quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
  let savedQuiz = quizData.find(item => item.quizId === quizId);


  if (savedQuiz) {
    savedQuiz.score = score;
    savedQuiz.currentIndex = currentIndex;
  } else {
    quizData.push({
      quizId: quizId,
      categoryId: quizId, // or categoryId if available separately
      questions: questions,
      score: score,
      total: questions.length,
      date: new Date().toLocaleString()
    });
  }    

  localStorage.setItem("quizResults", JSON.stringify(quizData));
}
document.getElementById('quit-btn').addEventListener('click', () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will leave the quiz and lose progress!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, quit!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "index.html"; // Or wherever you want to go
    }
  });
});

