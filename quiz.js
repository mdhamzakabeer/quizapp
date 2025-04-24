let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function loadQuestionsFromLocalQuizzes(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    console.log("All Local Quizzes:", quizzes);

    // Convert both quizId and quiz.id to string for safe comparison
    const matchedQuiz = quizzes.find(quiz => String(quiz.id) === String(quizId));

    if (matchedQuiz) {
        console.log("Matched Quiz:", matchedQuiz);
        return matchedQuiz.questions;
    } else {
        console.warn("No matching quiz found for id:", quizId);
        return [];
    }
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");

    questionContainer.innerText = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].correct;

    if (selectedOption === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");

    questionContainer.innerText = `Quiz Completed! Your Score: ${score}/${questions.length}`;
    optionsContainer.innerHTML = "";
}

// Main Code to load quiz based on ID
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("id");

    if (quizId) {
        questions = loadQuestionsFromLocalQuizzes(quizId);
        if (questions.length > 0) {
            showQuestion();
        } else {
            document.getElementById("question-container").innerText = "No questions found for this quiz.";
        }
    } else {
        document.getElementById("question-container").innerText = "Quiz ID not found in URL.";
    }
});

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
    if (selectedAnswer === correctAnswer) {
      score++;
    }
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
    <a href="results.html" class="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">📜 View All Results</a><br>
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
      questions: questions,
      score: score,
      currentIndex: currentIndex,
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

