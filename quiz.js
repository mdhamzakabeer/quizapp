let questions = [];
let currentIndex = 0;
let score = 0;
let quizId = null;
let matchedQuiz = null;
let subjectName = "Unknown";

// Decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Load on page
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  quizId = urlParams.get("id");
  const categoryId = urlParams.get("category");
  const subjectParam = urlParams.get("subject");

  if (subjectParam) {
    subjectName = decodeURIComponent(subjectParam);
  } else if (categoryId) {
    const categories = JSON.parse(localStorage.getItem("apiCategories")) || [];
    const matchedCategory = categories.find(c => c.id == categoryId);
    if (matchedCategory) subjectName = matchedCategory.name;
  }

  if (quizId) {
    loadQuestionsFromLocalQuizzes(quizId);
  } else if (categoryId) {
    fetchQuestionsFromAPI(categoryId);
  } else {
    alert("No quiz ID or category provided.");
    window.location.href = "index.html";
  }
});

// Fetch from API
async function fetchQuestionsFromAPI(categoryId) {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
    const data = await res.json();
    questions = data.results.map(q => ({
      question: decodeHtml(q.question),
      correct_answer: decodeHtml(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decodeHtml),
      userSelected: null // ✅ important addition
    }));

    quizId = Date.now().toString(); // ✅ important
    subjectName = subjectName || "API Quiz"; // ✅ in case subjectName is empty

    currentIndex = 0;
    score = 0;
    showQuestion();
  } catch (error) {
    console.error("API fetch error:", error);
    alert("Failed to load questions from API.");
  }
}

// Load from local quizzes
function loadQuestionsFromLocalQuizzes(quizId) {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  matchedQuiz = quizzes.find(quiz => quiz.id === quizId);

  if (matchedQuiz) {
    questions = matchedQuiz.questions;
    subjectName = matchedQuiz.subject || "Unknown";
    currentIndex = 0;
    score = 0;
    showQuestion();
  } else {
    alert("Quiz not found locally. Redirecting to home.");
    window.location.href = "index.html";
  }
}
// Show questions
function showQuestion() {
  const questionData = questions[currentIndex];
  const container = document.getElementById('question-container');

  const correct = questionData.correct || questionData.correct_answer;
  const optionsArray = questionData.options || [...questionData.incorrect_answers];

  const allAnswers = shuffle([
    ...optionsArray.filter(opt => opt.toLowerCase() !== correct.toLowerCase()),
    correct
  ]);

  container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Q${currentIndex + 1}: ${decodeHtml(questionData.question)}</h2>
    <form id="options-form" class="grid gap-4">
      ${allAnswers.map(ans => `
        <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition hover:border-blue-400">
          <input type="radio" name="answer" value="${ans}" class="hidden">
          <span class="ml-2 font-medium text-gray-700">${decodeHtml(ans)}</span>
        </label>
      `).join('')}
    </form>
  `;

  document.getElementById('next-btn').disabled = true;

  let optionLabels = document.querySelectorAll('#options-form label'); // 👈 ab naam alag
  const nextBtn = document.getElementById('next-btn');

  optionLabels.forEach(option => {
    option.addEventListener('click', () => {
      optionLabels.forEach(opt => {
        opt.classList.remove('border-blue-500', 'bg-blue-50');
        opt.querySelector('input').checked = false;
      });

      const input = option.querySelector('input');
      input.checked = true;
      option.classList.add('border-blue-500', 'bg-blue-50');
      nextBtn.disabled = false;
    });
  });

  document.getElementById('back-btn').style.display = currentIndex === 0 ? 'none' : 'inline-block';
}


// Next button
document.getElementById('next-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  const currentQuestion = questions[currentIndex];
  const correctAnswer = (currentQuestion.correct || currentQuestion.correct_answer || "").trim().toLowerCase();

  if (selected) {
    const selectedAnswer = selected.value.trim().toLowerCase();
    currentQuestion.userSelected = selected.value; // ✅ Save selected answer
    if (selectedAnswer === correctAnswer) {
      score++;
    }
  }

  currentIndex++;

  saveProgress(); // ✅ Save after next

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// Show Result
function showResult() {
  const container = document.getElementById('question-container');

  saveProgress(); // ✅ Save at finish too

  container.innerHTML = `
    <h2 class="text-2xl font-bold text-green-600">Quiz Completed!</h2>
    <p class="mt-4 text-lg">Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <a href="result.html" class="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">📜 View All Results</a><br>
    <a href="index.html" class="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔙 Back to Home</a>
  `;

  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('back-btn').style.display = 'none';
}

// Save Progress
function saveProgress() {
  quizId = quizId || Date.now().toString();
  let quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
  let savedQuiz = quizData.find(item => item.quizId === quizId);

  if (savedQuiz) {
    savedQuiz.score = score;
    savedQuiz.currentIndex = currentIndex;
    savedQuiz.date = new Date().toLocaleString();
    savedQuiz.questions = questions;
    savedQuiz.total = questions.length;
    savedQuiz.subject = subjectName;
  } else {
    quizData.push({
      quizId: quizId,
      subject: subjectName,
      questions: questions,
      score: score,
      currentIndex: currentIndex,
      total: questions.length,
      date: new Date().toLocaleString()
    });
  }

  localStorage.setItem("quizResults", JSON.stringify(quizData));
}

// Quit button
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
      window.location.href = "index.html";
    }
  });
});
