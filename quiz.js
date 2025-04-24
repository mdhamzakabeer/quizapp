// Get category ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category');

// Initialize quiz state
let questions = [];
let currentIndex = 0;
let score = 0;

// Utility function to decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Load Questions from API
async function loadQuestions() {
  const container = document.getElementById('question-container');
  try {
    // Show loading state
    container.innerHTML = '<p class="text-center">Loading questions...</p>';
    
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
    const data = await res.json();
    
    if (data.response_code !== 0 || !data.results || data.results.length === 0) {
      throw new Error('Failed to load questions. Please try again.');
    }
    
    questions = data.results;
    showQuestion();
  } catch (error) {
    container.innerHTML = `
      <div class="text-center">
        <p class="text-red-600 mb-4">${error.message}</p>
        <a href="index.html" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Back to Home</a>
      </div>
    `;
  }
}

// Display the current question
function showQuestion() {
  const questionData = questions[currentIndex];
  const container = document.getElementById('question-container');
  
  // Combine and shuffle answers
  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
  allAnswers.sort(() => Math.random() - 0.5);
  
  // Generate question HTML
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

  // Enable next button when an answer is selected
  const form = document.getElementById('options-form');
  form.addEventListener('change', () => {
    document.getElementById('next-btn').disabled = false;
  });

  // Show/hide back button
  const backBtn = document.getElementById('back-btn');
  backBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
}

// Handle Next button click
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

// Handle Back button click
document.getElementById('back-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// Show Result and save to localStorage
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

  // Hide navigation buttons
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('back-btn').style.display = 'none';
}

// Quit confirmation handler
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

// Initialize the quiz
quitMcqs();
loadQuestions();