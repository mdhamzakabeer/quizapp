// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication status
  const isLoggedIn = JSON.parse(localStorage.getItem("isLogin") || "false");

  // Navigation elements
  const loginNav = document.getElementById("login-nav");
  const signupNav = document.getElementById("signup-nav");
  const logoutNav = document.getElementById("logout-nav");
  const subjectDropdown = document.getElementById("subject");
  const startBtn = document.getElementById("start-btn");

  // Authentication check and redirect
  if (!isLoggedIn) {
    window.location.href = "login/signUp/quiz-form-login.html";
    return;
  }

  // Update navigation visibility
  if (loginNav) loginNav.style.display = "none";
  if (signupNav) signupNav.style.display = "none";
  if (logoutNav) logoutNav.style.display = "block";

  // Handle logout
  if (logoutNav) {
    logoutNav.addEventListener("click", () => {
      localStorage.removeItem("isLogin");
      window.location.href = "login/signUp/quiz-form-login.html";
    });
  }

  // Fetch and populate quiz categories
  async function loadQuizCategories() {
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      if (!response.ok) {
        throw new Error('Failed to fetch quiz categories');
      }

      const data = await response.json();
      
      if (!data.trivia_categories || !Array.isArray(data.trivia_categories)) {
        throw new Error('Invalid category data received');
      }

      if (subjectDropdown) {
        // Add default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a category";
        subjectDropdown.appendChild(defaultOption);

        // Add categories
        data.trivia_categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          subjectDropdown.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading quiz categories:', error);
      if (subjectDropdown) {
        subjectDropdown.innerHTML = '<option value="">Error loading categories</option>';
      }
    }
  }

  // Handle Start Quiz button
  if (startBtn && subjectDropdown) {
    startBtn.addEventListener("click", () => {
      const selectedValue = subjectDropdown.value;
      if (!selectedValue) {
        alert("Please select a quiz category.");
        return;
      }
      window.location.href = `quiz.html?category=${selectedValue}`;
    });
  }

  // Load categories when page loads
  loadQuizCategories();
});