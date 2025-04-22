document.addEventListener("DOMContentLoaded", () => {




  const isLoggedIn = JSON.parse(localStorage.getItem("isLogin"));

  // Redirect if not logged in
  if (!isLoggedIn) {
    window.location.href = "login/signUp/quiz-form-login.html";
    return;
  }


  // cards creation



  let cardContainer = document.getElementById("card-container");
  if (!cardContainer) {
    console.error("card-container not found!");
    return;
  }
  
  const createCardsByFetchingDataOfApi = (quizData) => {
  
    if (!cardContainer) {
      console.error("Card container not found in HTML.");
      return;
    }
  
    // Clear previous cards
    cardContainer.innerHTML = "";
  
    // ✅ API DATA CARDS
    if (quizData && Array.isArray(quizData.trivia_categories)) {
      quizData.trivia_categories.forEach((category) => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer";
  
        const h4 = document.createElement("h4");
        h4.className = "text-lg font-semibold mb-2 text-blue-600";
        h4.textContent = category.name;
  
        const p = document.createElement("p");
        p.className = "text-gray-600 text-sm";
        p.textContent = `Category ID: ${category.id}`;
  
        card.appendChild(h4);
        card.appendChild(p);
  
        card.addEventListener("click", () => {
          window.location.href = `quiz.html?category=${encodeURIComponent(category.id)}`;
        });
  
        cardContainer.appendChild(card);
      });
    } else {
      console.error("Invalid API data: trivia_categories not found");
    }
  
    // ✅ LOCAL STORAGE CARDS
    const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
    stored.forEach((quiz, index) => {
      const subjectId = `quiz_${index}_${quiz.subject.toLowerCase().replace(/\s+/g, '_')}`;
  
      const card = document.createElement("div");
      card.className = "bg-white shadow-md rounded-lg p-4 border cursor-pointer hover:shadow-lg transition";
      card.dataset.subject = quiz.subject;
      card.id = subjectId;
  
      card.innerHTML = `
        <h3 class="text-lg font-bold text-blue-600">${quiz.subject}</h3>
        <p class="text-sm text-gray-500">ID: ${subjectId}</p>
      `;
  
      card.addEventListener('click', () => {
        localStorage.setItem('selectedSubject', quiz.subject);
        window.location.href = 'quiz.html';
      });
  
      cardContainer.appendChild(card);
    });
  
    // ✅ CREATE NEW CARD
    const createCard = document.createElement("div");
    createCard.className = "bg-gray-100 p-6 rounded-xl shadow border-dashed border-2 border-blue-400 hover:bg-blue-50 transition flex items-center justify-center cursor-pointer";
    createCard.innerHTML = `
      <div class="text-center">
        <div class="text-4xl text-blue-600 font-bold mb-2">+</div>
        <p class="text-blue-600 font-semibold">Create New Quiz</p>
      </div>
    `;
  
    createCard.addEventListener("click", () => {
      window.location.href = "create-quiz.html";
    });
  
    cardContainer.appendChild(createCard);
  };
  
  
  
  
  
  // Show/hide nav items
  
  const loginNav = document.getElementById("login-nav");
  const signupNav = document.getElementById("signup-nav");
  const logoutNav = document.getElementById("logout-nav");

  if (loginNav) loginNav.style.display = "none";
  if (signupNav) signupNav.style.display = "none";
  if (logoutNav) logoutNav.style.display = "block";

  // Logout
  if (logoutNav) {
    logoutNav.addEventListener("click", () => {
      localStorage.removeItem("isLogin");
      window.location.href = "login/signUp/quiz-form-login.html";
    });
  }
// Fetch dropdown quiz categories

let data=null;
async function dropdownData() {
  const response = await fetch("https://opentdb.com/api_category.php");
  data = await response.json();

console.log(data)
createCardsByFetchingDataOfApi(data)
  const subjectDropdown = document.getElementById("subject");

  if (subjectDropdown) {
    subjectDropdown.innerHTML="";
    data.trivia_categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      subjectDropdown.appendChild(option);
    });
  }
}

dropdownData();

// Start Quiz button
const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const selectedValue = document.getElementById("subject").value;
    if (!selectedValue) {
      alert("Please select a quiz category.");
      return;
    }
    window.location.href = `quiz.html?category=${selectedValue}`;
  });
}




// cards dunctionality


const cards = Array.from(cardContainer.children);

cards.forEach(card => {
  card.addEventListener("click", () => {
    const h4 = card.querySelector("h4");
    const subject = h4 ? h4.textContent: "";
    if (subject) {
      window.location.href = `quiz.html?subject=${subject}`;
    }
  });
});









});


