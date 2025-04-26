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
        card.className = "bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer card"; // ✅ important "card" class
  
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
      card.className = "bg-white shadow-md rounded-lg p-4 border cursor-pointer hover:shadow-lg transition card"; // ✅ important "card" class
      card.dataset.subject = quiz.subject;
      card.dataset.id = quiz.id;
      card.id = quiz.id;
  
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
    createCard.className = "bg-gray-100 p-6 rounded-xl shadow border-dashed border-2 border-blue-400 hover:bg-blue-50 transition flex items-center justify-center cursor-pointer card"; // ✅ important "card" class
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
  
    // ✅ Animate cards after ALL cards are created
    animateCards();
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

});
gsap.to("#headline", {
  duration: 2,
  text: "Welcome to GrowQuiz!",
  ease: "none",
  repeat:-1,
  repeatDelay:1,
});
 gsap.from("#welcomeSection", {
      x: -200,    // Start 200px to the left
      opacity: 0, // Invisible initially
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        // Typing animation after slide-in finishes
        gsap.to("#headline", {
          duration: 2,
          text: "Welcome to GrowQuiz!",
          ease: "none"
        });
      }
    });
    function animateCards() {
      gsap.registerPlugin(ScrollTrigger);
    
      // Kill all old ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
      // Target ALL .card divs inside #card-container
      gsap.utils.toArray("#card-container .card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",   // Jab card viewport mein aaye
            end: "top 60%",     // Jab thoda aur andar aaye
            scrub: true,        // Smooth scroll-based animation
            // markers: true,   // (Optional) Debug markers dikhane ke liye
          },
          opacity: 0,
          y: 50,
          x: 100,               // ✅ chhota "x", not "X"
          duration: 1,
          ease: "power2.out",
        });
      });
    }
    
    
    gsap.from("header", {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "bounce.out"
    });
    
    

    // Simple Loader Animation with GSAP
gsap.to("#loader h1", {
  text: "Welcome to GrowQuiz!",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut"
});

// Hide Loader after 3 seconds
setTimeout(() => {
  gsap.to("#loader", {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("loader").style.display = "none";
    }
  });
}, 3000);

  
    // Animate already existing cards
