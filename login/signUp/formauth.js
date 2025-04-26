document.addEventListener("DOMContentLoaded", () => {
  const showToast = (message, color = "#4ade80") => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: color,
      close: true
    }).showToast();
  };

  // Sign-Up Logic
  if (window.location.pathname.includes("sign-up")) {
    const form = document.getElementById("signUPForm");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const username = formData.get("username").trim();
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (!username || !password || !confirmPassword) {
        showToast("Please fill all fields", "#f87171"); // red
        return;
      }

      if (password !== confirmPassword) {
        showToast("Passwords do not match.", "#f87171"); // red
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
      const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

      if (!usernameRegex.test(username) && !emailRegex.test(username)) {
        showToast("Username must be 3-15 characters or a valid email.", "#facc15"); // yellow
        return;
      }

      if (!passwordRegex.test(password)) {
        showToast("Password must have 6+ chars, number, capital, and special char.", "#facc15"); // yellow
        return;
      }

      const users = JSON.parse(localStorage.getItem("userDetails")) || [];
      const userExists = users.some(user => user.username === username);

      if (userExists) {
        showToast("User is already registered!", "#f97316"); // orange
        return;
      }

      users.push({ username, password });
      localStorage.setItem("userDetails", JSON.stringify(users));

      showToast("Sign up successful!", "#4ade80"); // green
      form.reset();
    });
  }

  // Login Logic
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const username = formData.get("username").trim();
      const password = formData.get("userPassword").trim();

      if (!username || !password) {
        showToast("Please fill in both username and password.", "#f87171");
        return;
      }

      const users = JSON.parse(localStorage.getItem("userDetails")) || [];
      const match = users.find(user => user.username === username && user.password === password);

      if (match) {
        showToast("Login successful!", "#4ade80");
        localStorage.setItem("isLogin", JSON.stringify(true));
        setTimeout(() => {
          window.location.href = "../../index.html";
        }, 1000);
      } else {
        showToast("No matching user found. Please check your credentials.", "#f87171");
      }
    });
  }
});