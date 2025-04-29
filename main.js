document.addEventListener("DOMContentLoaded", () => {
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = userData && userData.login;

  setTimeout(() => {
    if (isLoggedIn) {
      console.log("User is logged in:", userData);
      // Continue
    } else {
      console.log("User not logged in. Redirecting to login page...");
      window.location.href = 'login/quiz-form-login.html';
    }
  }, 5000);

  // Cards Container
  const cardContainer = document.getElementById("card-container");
  if (!cardContainer) {
    console.error("card-container not found!");
    return;
  }

  // Function to create cards
  const createCards = (quizData) => {
    cardContainer.innerHTML = ""; // Clear previous cards

    // Create API cards
    if (quizData && Array.isArray(quizData.trivia_categories)) {
      quizData.trivia_categories.forEach((category) => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer";

        card.innerHTML = `
          <h4 class="text-lg font-semibold mb-2 text-blue-600">${category.name}</h4>
          <p class="text-gray-600 text-sm">Category ID: ${category.id}</p>
        `;

        card.addEventListener("click", () => {
          window.location.href = `quiz.html?category=${encodeURIComponent(category.id)}`;
        });

        cardContainer.appendChild(card);
      });
    }

    // Create Local Storage cards
    const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    storedQuizzes.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow-md rounded-lg p-4 border cursor-pointer hover:shadow-lg transition";

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

    // Create 'Create New Quiz' card
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

  // Navigation logic
  const loginNav = document.getElementById("login-nav");
  const signupNav = document.getElementById("signup-nav");
  const logoutNav = document.getElementById("logout-nav");

  const mobileLoginNav = document.getElementById("mobile-login-nav");
  const mobileSignupNav = document.getElementById("mobile-signup-nav");
  const mobileLogoutNav = document.getElementById("mobile-logout-nav");

  if (isLoggedIn) {
    if (loginNav) loginNav.style.display = "none";
    if (signupNav) signupNav.style.display = "none";
    if (logoutNav) logoutNav.style.display = "block";

    if (mobileLoginNav) mobileLoginNav.style.display = "none";
    if (mobileSignupNav) mobileSignupNav.style.display = "none";
    if (mobileLogoutNav) mobileLogoutNav.style.display = "block";
  } else {
    if (loginNav) loginNav.style.display = "block";
    if (signupNav) signupNav.style.display = "block";
    if (logoutNav) logoutNav.style.display = "none";

    if (mobileLoginNav) mobileLoginNav.style.display = "block";
    if (mobileSignupNav) mobileSignupNav.style.display = "block";
    if (mobileLogoutNav) mobileLogoutNav.style.display = "none";
  }

  // Logout event
  const logoutHandler = () => {
    localStorage.removeItem("user");
    window.location.href = "login/quiz-form-login.html";
  };

  if (logoutNav) logoutNav.addEventListener("click", logoutHandler);
  if (mobileLogoutNav) mobileLogoutNav.addEventListener("click", logoutHandler);

  // Fetch dropdown data and create cards
  const dropdownData = async () => {
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      const apiData = await response.json();
      console.log(apiData);

      localStorage.setItem("apiCategories", JSON.stringify(apiData.trivia_categories));

      createCards(apiData);

      const subjectDropdown = document.getElementById("subject");
      if (subjectDropdown) {
        subjectDropdown.innerHTML = "";

        apiData.trivia_categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          subjectDropdown.appendChild(option);
        });

        const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
        storedQuizzes.forEach((quiz) => {
          const option = document.createElement("option");
          option.value = quiz.id;
          option.textContent = `${quiz.subject} (Local)`;
          subjectDropdown.appendChild(option);
        });
      }

    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  dropdownData();

  // Start Quiz Button
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const subjectSelect = document.getElementById("subject");
      const selectedValue = subjectSelect.value;

      if (!selectedValue) {
        alert("Please select a quiz category.");
        return;
      }

      if (selectedValue.length <= 2) {
        const selectedText = subjectSelect.selectedOptions[0].textContent;
        const subject = encodeURIComponent(selectedText);
        window.location.href = `quiz.html?category=${selectedValue}&subject=${subject}`;
      } else {
        window.location.href = `quiz.html?id=${selectedValue}`;
      }
    });
  }

  // Subscribe Button
  const subscribeBtn = document.getElementById('subscribe-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('subscriber-email');
      const email = emailInput.value.trim();
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

      if (localStorage.getItem('subscribed') === 'true') {
        Swal.fire({
          icon: 'info',
          title: 'Already Subscribed',
          text: 'You have already subscribed!',
          confirmButtonColor: '#3085d6'
        });
        return;
      }

      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');

      const templateID = email.endsWith('@gmail.com') ? 'template_eeaxq4v' : 'template_psetoe2';

      emailjs.send('service_sbt7ist', templateID, { user_email: email })
        .then(() => {
          localStorage.setItem('subscribed', 'true');
          Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: 'Thank you for subscribing to GrowQuiz!',
            confirmButtonColor: '#3085d6',
            timer: 2500
          });
          emailInput.value = '';
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try again later!',
            confirmButtonColor: '#d33'
          });
        })
        .finally(() => {
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        });
    });
  }
  
});
