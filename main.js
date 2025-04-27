document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  if (userData && userData.login) {
    console.log("User is logged in:", userData);
    // User is logged in, continue
  } else {
    console.log("User not logged in. Redirecting to login page...");
    window.location.href = 'login.html'; // Apni login page ka path do
  }

  // Redirect if not logged in
  

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

    stored.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow-md rounded-lg p-4 border cursor-pointer hover:shadow-lg transition";
      card.dataset.subject = quiz.subject;
      card.dataset.id = quiz.id; // Optional: store ID as a data attribute
      card.id = quiz.id; // Use quiz.id directly
    
      card.innerHTML = `
        <h3 class="text-lg font-bold text-blue-600">${quiz.subject}</h3>
        <p class="text-sm text-gray-500">ID: ${quiz.id}</p>
      `;
    
      card.addEventListener('click', () => {
        localStorage.setItem('selectedSubject', quiz.subject);
        window.location.href = `quiz.html?id=${quiz.id}`;
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
      window.location.href = `create-quiz.html`;

    });
  
    cardContainer.appendChild(createCard);
  };
  
 // Show/hide nav items
const loginNav = document.getElementById("login-nav");
const signupNav = document.getElementById("signup-nav");
const logoutNav = document.getElementById("logout-nav");

// 👇 NEW: Mobile nav IDs
const mobileLoginNav = document.getElementById("mobile-login-nav");
const mobileSignupNav = document.getElementById("mobile-signup-nav");
const mobileLogoutNav = document.getElementById("mobile-logout-nav");

if (isLoggedIn) {
  // ✅ If user is logged in
  if (loginNav) loginNav.style.display = "none";
  if (signupNav) signupNav.style.display = "none";
  if (logoutNav) logoutNav.style.display = "block";

  if (mobileLoginNav) mobileLoginNav.style.display = "none";
  if (mobileSignupNav) mobileSignupNav.style.display = "none";
  if (mobileLogoutNav) mobileLogoutNav.style.display = "block";
} else {
  // ✅ If user is NOT logged in
  if (loginNav) loginNav.style.display = "block";
  if (signupNav) signupNav.style.display = "block";
  if (logoutNav) logoutNav.style.display = "none";

  if (mobileLoginNav) mobileLoginNav.style.display = "block";
  if (mobileSignupNav) mobileSignupNav.style.display = "block";
  if (mobileLogoutNav) mobileLogoutNav.style.display = "none";
}

// Logout
if (logoutNav) {
  logoutNav.addEventListener("click", () => {
    localStorage.removeItem("isLogin");
    window.location.href = "login/signUp/quiz-form-login.html";
  });
}
// 👇 NEW: Mobile Logout
if (mobileLogoutNav) {
  mobileLogoutNav.addEventListener("click", () => {
    localStorage.removeItem("isLogin");
    window.location.href = "login/signUp/quiz-form-login.html";
  });
}
 
  

// Fetch dropdown quiz categories

let data=null;
async function dropdownData() {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    console.log(data);
// ✅ Save API categories for later use in quiz.js
localStorage.setItem("apiCategories", JSON.stringify(data.trivia_categories));
    createCardsByFetchingDataOfApi(data); // render cards for both API + local

    const subjectDropdown = document.getElementById("subject");

    if (subjectDropdown) {
      subjectDropdown.innerHTML = "";

      // 👉 API categories
      data.trivia_categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id; // value for API quiz
        option.textContent = category.name;
        subjectDropdown.appendChild(option);
      });

      // 👉 Local quizzes
      const dataFromLocal = JSON.parse(localStorage.getItem("quizzes")) || [];
      dataFromLocal.forEach((quiz) => {
        const option = document.createElement("option");
        option.value = quiz.id; // value is the local quiz id
        option.textContent = `${quiz.subject} (Local)`; // label it nicely
        subjectDropdown.appendChild(option);
      });
    }
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
}


dropdownData();

// Start Quiz button
const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const selectedValue = document.getElementById("subject").value;
    console.log(selectedValue)
    if (!selectedValue) {
      alert("Please select a quiz category.");
      return;
    }
    console.log(typeof selectedValue)
    if (selectedValue.length <= 2) {
      const selectedText = document.getElementById("subject").selectedOptions[0].textContent;
      const subject = encodeURIComponent(selectedText);
      window.location.href = `quiz.html?category=${selectedValue}&subject=${subject}`;
    } else {
      window.location.href = `quiz.html?id=${selectedValue}`;
    }
    

  });
}



const subscribeBtn = document.getElementById('subscribe-btn');
      const btnText = document.getElementById('btn-text');
      const btnLoader = document.getElementById('btn-loader');
      
      subscribeBtn.addEventListener('click', function() {
        var email = document.getElementById('subscriber-email').value.trim();
      
        // Simple Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
          Swal.fire({
            icon: 'warning',
            title: 'Invalid Email',
            text: 'Please enter a valid email address!',
            confirmButtonColor: '#f1c40f'
          });
          return;
        }
      
        // Check if Already Subscribed
        if (localStorage.getItem('subscribed') === 'true') {
          Swal.fire({
            icon: 'info',
            title: 'Already Subscribed',
            text: 'You have already subscribed!',
            confirmButtonColor: '#3085d6'
          });
          return;
        }
      
        // Show Loader
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
      
        // Decide Template ID
        let templateID = '';
        if (email.endsWith('@gmail.com')) {
          templateID = 'template_eeaxq4v'; // Gmail users
        } else {
          templateID = 'template_psetoe2'; // Other users
        }
      
        emailjs.send('service_sbt7ist', templateID, {
          user_email: email
        })
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
      
          // Save Subscription in LocalStorage
          localStorage.setItem('subscribed', 'true');
      
          Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: 'Thank you for subscribing to GrowQuiz!',
            confirmButtonColor: '#3085d6',
            timer: 2500
          });
          document.getElementById('subscriber-email').value = '';
        }, function(error) {
          console.log('FAILED...', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try again later!',
            confirmButtonColor: '#d33'
          });
        })
        .finally(function() {
          // Hide Loader
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        });
      });


});


