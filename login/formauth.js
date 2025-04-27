

(function() {
  emailjs.init("Qzb9CnxmhL4YUVNvr"); // <-- Apni EmailJS PUBLIC key lagani hai
})();

// Animate on load 🚀
gsap.to("#loginBox", {
  opacity: 1,
  scale: 1,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#growQuiz", {
  y: -30,
  opacity: 0,
  delay: 0.2,
  duration: 0.8,
  ease: "back.out(1.7)"
});

gsap.from("#welcome", {
  x: -50,
  opacity: 0,
  delay: 0.4,
  duration: 0.8
});

gsap.from("#subtext", {
  x: 50,
  opacity: 0,
  delay: 0.6,
  duration: 0.8
});

// Form Submit 🧠
const form = document.getElementById('loginForm');
const poraCont = document.getElementById("pora-container");
const verifyOtpBtn = document.getElementById('verifyOtpBtn');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validation
  const nameRegex = /^[a-zA-Z\s]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(name) || !emailRegex.test(email)) {
    Toastify({
      text: "Please enter valid Name and Email.",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      duration: 3000
    }).showToast();
    return;
  }

  const existingUser = JSON.parse(localStorage.getItem('user'));

  // ⭐ FIRST CHECK: User already registered aur login nahi hua
  if (existingUser && existingUser.name === name && existingUser.email === email) {
    if (existingUser.login === true) {
      // Pehle se login hai
      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'Redirecting to dashboard...',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
      return;
    } else {
      // Pehle registered hai but login nahi hua, OTP maangna hoga
      showOtpBox();
      return;
    }
  }

  // ⭐ NEW USER: OTP bhejna padega
  const otp = Math.floor(100000 + Math.random() * 900000);

  localStorage.setItem('user', JSON.stringify({
    name,
    email,
    password,
    otp,
    login: false
  }));

  const templateParams = {
    sender_name: name,
    sender_email: email,
    sender_password: password,
    otp_code: otp
  };

  emailjs.send('service_cdl1aoy', 'template_8pt0cwm', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Check your email inbox.',
        timer: 3000,
        showConfirmButton: false
      });
      showOtpBox();
    }, function(error) {
      console.log('FAILED...', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to send OTP',
        text: 'Please try again later.'
      });
    });
});

// Show OTP Box
function showOtpBox() {
  poraCont.classList.add("hidden");
  document.getElementById('otpBox').classList.remove('hidden');

  gsap.from("#otpBox", {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    ease: "power3.out"
  });
}

// OTP Verify 🧩
verifyOtpBtn.addEventListener('click', function() {
  try {
    const enteredOtp = document.getElementById('otpInput').value.trim();
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData && enteredOtp && Number(enteredOtp) === Number(userData.otp)) {
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified!',
        text: 'Redirecting to dashboard...',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        // Update user data
        delete userData.otp;
        userData.login = true;
        localStorage.setItem('user', JSON.stringify(userData));

        window.location.href="../index.html";
      }, 2000);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'Please try again.'
      });
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: error.message
    });
  }
});
