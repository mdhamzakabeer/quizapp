const quizForm = document.getElementById('quiz-form');
const questionList = document.getElementById('question-list');

// Load saved quizzes on page load
window.addEventListener('DOMContentLoaded', loadSavedQuizzes);

function generateId() {
  return 'q_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}
// Submit handler
quizForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const subject = document.getElementById('subject-input').value.trim();
  const question = document.getElementById('question').value.trim();
  const optionA = document.getElementById('optionA').value.trim();
  const optionB = document.getElementById('optionB').value.trim();
  const optionC = document.getElementById('optionC').value.trim();
  const optionD = document.getElementById('optionD').value.trim();
  const correct = document.getElementById('correct').value.trim().toUpperCase();

  if (!subject || !question || !optionA || !optionB || !optionC || !optionD || !correct) {
    alert("Please fill in all fields.");
    return;
  }

  const newQuestion = {
    question,
    id:generateId(),
    options: [optionA, optionB, optionC, optionD],
    correct
  };

  // Save to localStorage
  const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
  let subjectQuiz = stored.find(q => q.subject.toLowerCase() === subject.toLowerCase());

  if (subjectQuiz) {
    subjectQuiz.questions.push(newQuestion);
  } else {
    stored.push({
      subject,
      questions: [newQuestion]
    });
  }

  localStorage.setItem("quizzes", JSON.stringify(stored));

  addQuestionToUI(subject, newQuestion);
  quizForm.reset();
});

// Render a single question in the UI
function addQuestionToUI(subject, q) {
  const li = document.createElement('li');
  li.className = "bg-white p-4 rounded-xl shadow-md border border-gray-200";
  li.innerHTML = `
    <div class="mb-2 text-blue-600 font-bold text-lg">${subject}</div>
    <div class="font-medium mb-1">${q.question}</div>
    <ul class="text-sm text-gray-700 mb-2 space-y-1">
      <li><strong>A:</strong> ${q.options[0]}</li>
      <li><strong>B:</strong> ${q.options[1]}</li>
      <li><strong>C:</strong> ${q.options[2]}</li>
      <li><strong>D:</strong> ${q.options[3]}</li>
    </ul>
    <div class="text-green-600 text-sm font-semibold mb-2">Correct Answer: ${q.correct}</div>
    <div class="flex gap-3">
      <button class="edit-btn bg-yellow-100 text-yellow-700 px-4 py-1 rounded hover:bg-yellow-200 transition">✏️ Edit</button>
      <button class="delete-btn bg-red-100 text-red-600 px-4 py-1 rounded hover:bg-red-200 transition">🗑️ Delete</button>
    </div>
  `;
  questionList.appendChild(li);
}

// Load existing data from localStorage on page load
function loadSavedQuizzes() {
  const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
  stored.forEach(quiz => {
    quiz.questions.forEach(q => {
      addQuestionToUI(quiz.subject, q);
    });
  });
}

// Delete functionality
questionList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-btn')) {
    const li = e.target.closest('li');
    const subject = li.querySelector('div').textContent.trim();
    const questionText = li.querySelector('.font-medium').textContent.trim();

    // Remove from UI
    li.remove();

    // Remove from localStorage
    let stored = JSON.parse(localStorage.getItem("quizzes")) || [];
    stored = stored.map(q => {
      if (q.subject === subject) {
        q.questions = q.questions.filter(ques => ques.question !== questionText);
      }
      return q;
    }).filter(q => q.questions.length > 0);

    localStorage.setItem("quizzes", JSON.stringify(stored));
  }

  if (e.target.classList.contains('edit-btn')) {
    alert('✏️ Edit feature will go here.');
  }
});
