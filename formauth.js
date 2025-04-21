const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLINK");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Form toggles
loginLink.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});
signupLink.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});

// SIGN UP - Store data in localStorage
signupForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload
  const userName = document.getElementById("name").value;
  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  const userData = {
    name: userName,
    email: userEmail,
    password: userPassword,
  };

  localStorage.setItem("quizUser", JSON.stringify(userData));
  alert("Signup successful! You can now login.");
  signupForm.reset();

  // Redirect to login
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// LOGIN - Check credentials
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginEmail = document.getElementById("email").value;
  const loginPassword = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("quizUser"));

  if (
    storedUser &&
    storedUser.email === loginEmail &&
    storedUser.password === loginPassword
  ) {
    alert("Login successful!");

    // Optionally store a login flag
    localStorage.setItem("isLoggedIn", "true");

    // Redirect or hide form
    loginForm.classList.add("hidden");
    document.querySelector(".w-full.max-w-md").innerHTML = `
      <div class="text-center text-xl text-green-600 font-bold">
        Welcome, ${storedUser.name}! 🎉
      </div>
    `;
  } else {
    alert("Invalid credentials. Try again.");
  }
});

// Auto-login if already logged in
window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const storedUser = JSON.parse(localStorage.getItem("quizUser"));

  if (isLoggedIn === "true" && storedUser) {
    loginForm.classList.add("hidden");
    signupForm.classList.add("hidden");

    document.querySelector(".w-full.max-w-md").innerHTML = `
      <div class="text-center text-xl text-green-600 font-bold">
        Welcome back, ${storedUser.name}! 🎉
      </div>
    `;
  }
});
