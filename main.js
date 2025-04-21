document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLogin"));

  // Redirect if not logged in
  if (!isLoggedIn) {
    window.location.href = "quiz-form-sign-up.html";
    return;
  }

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
      window.location.href = "quiz-form-login.html";
    });
  }

  // Fetch dropdown quiz categories
  async function dropdownData() {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    const subjectDropdown = document.getElementById("subject");

    if (subjectDropdown) {
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
});
