const quizForm = document.getElementById('quiz-form');
const questionList = document.getElementById('question-list');
let editingQuestionId = null;

window.addEventListener('DOMContentLoaded', loadSavedQuizzes);

function generateId() {
  return 'q_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

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

  const options = [optionA, optionB, optionC, optionD];
  const correctIndex = {A: 0, B: 1, C: 2, D: 3}[correct];

  if (correctIndex === undefined) {
    alert("Correct answer must be A, B, C, or D");
    return;
  }

  const correctAnswer = options[correctIndex];
  const incorrectAnswers = options.filter((opt, idx) => idx !== correctIndex);

  const newQuestion = {
    id: editingQuestionId || generateId(),
    question,
    correct_answer: correctAnswer,
    incorrect_answers: incorrectAnswers
  };

  const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
  let subjectQuiz = stored.find(q => q.subject.toLowerCase() === subject.toLowerCase());

  if (subjectQuiz) {
    if (editingQuestionId) {
      subjectQuiz.questions = subjectQuiz.questions.map(q => 
        q.id === editingQuestionId ? newQuestion : q
      );
    } else {
      subjectQuiz.questions.push(newQuestion);
    }
  } else {
    stored.push({
      id: generateId(),
      subject,
      questions: [newQuestion]
    });
  }

  localStorage.setItem("quizzes", JSON.stringify(stored));

  if (editingQuestionId) {
    updateQuestionInUI(subject, newQuestion);
  } else {
    addQuestionToUI(subject, newQuestion);
  }

  quizForm.reset();
  editingQuestionId = null;
});

function addQuestionToUI(subject, q) {
  const li = document.createElement('li');
  li.className = "bg-white p-4 rounded-xl shadow-md border border-gray-200";
  li.setAttribute('data-id', q.id);
  li.innerHTML = `
    <div class="mb-2 text-blue-600 font-bold text-lg">${subject}</div>
    <div class="font-medium mb-1">${q.question}</div>
    <ul class="text-sm text-gray-700 mb-2 space-y-1">
      ${[...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map((opt, i) => 
        `<li><strong>${String.fromCharCode(65 + i)}:</strong> ${opt}</li>`
      ).join('')}
    </ul>
    <div class="text-green-600 text-sm font-semibold mb-2">Correct Answer: ${q.correct_answer}</div>
    <div class="flex gap-3">
      <button class="edit-btn bg-yellow-100 text-yellow-700 px-4 py-1 rounded hover:bg-yellow-200 transition">✏️ Edit</button>
      <button class="delete-btn bg-red-100 text-red-600 px-4 py-1 rounded hover:bg-red-200 transition">🗑️ Delete</button>
    </div>
  `;
  questionList.appendChild(li);
}

function updateQuestionInUI(subject, q) {
  const li = document.querySelector(`li[data-id="${q.id}"]`);
  if (!li) return;
  li.innerHTML = `
    <div class="mb-2 text-blue-600 font-bold text-lg">${subject}</div>
    <div class="font-medium mb-1">${q.question}</div>
    <ul class="text-sm text-gray-700 mb-2 space-y-1">
      ${[...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map((opt, i) => 
        `<li><strong>${String.fromCharCode(65 + i)}:</strong> ${opt}</li>`
      ).join('')}
    </ul>
    <div class="text-green-600 text-sm font-semibold mb-2">Correct Answer: ${q.correct_answer}</div>
    <div class="flex gap-3">
      <button class="edit-btn bg-yellow-100 text-yellow-700 px-4 py-1 rounded hover:bg-yellow-200 transition">✏️ Edit</button>
      <button class="delete-btn bg-red-100 text-red-600 px-4 py-1 rounded hover:bg-red-200 transition">🗑️ Delete</button>
    </div>
  `;
}

function loadSavedQuizzes() {
  const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
  stored.forEach(quiz => {
    quiz.questions.forEach(q => {
      addQuestionToUI(quiz.subject, q);
    });
  });
}

questionList.addEventListener('click', function(e) {
  const li = e.target.closest('li');
  if (!li) return;

  const subject = li.querySelector('div').textContent.trim();
  const questionId = li.getAttribute('data-id');

  if (e.target.classList.contains('delete-btn')) {
    li.remove();
    let stored = JSON.parse(localStorage.getItem("quizzes")) || [];
    stored = stored.map(q => {
      if (q.subject === subject) {
        q.questions = q.questions.filter(ques => ques.id !== questionId);
      }
      return q;
    }).filter(q => q.questions.length > 0);
    localStorage.setItem("quizzes", JSON.stringify(stored));
  }

  if (e.target.classList.contains('edit-btn')) {
    const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
    const subjectQuiz = stored.find(q => q.subject === subject);
    const questionToEdit = subjectQuiz?.questions.find(q => q.id === questionId);

    if (questionToEdit) {
      document.getElementById('subject-input').value = subject;
      document.getElementById('question').value = questionToEdit.question;
      const allOptions = [...questionToEdit.incorrect_answers, questionToEdit.correct_answer];
      document.getElementById('optionA').value = allOptions[0] || '';
      document.getElementById('optionB').value = allOptions[1] || '';
      document.getElementById('optionC').value = allOptions[2] || '';
      document.getElementById('optionD').value = allOptions[3] || '';
      document.getElementById('correct').value = ['A', 'B', 'C', 'D'][allOptions.indexOf(questionToEdit.correct_answer)];
      editingQuestionId = questionToEdit.id;
    }
  }
});
