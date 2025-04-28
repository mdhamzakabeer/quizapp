// GSAP + TextPlugin + ScrollTrigger register
// GSAP + TextPlugin + ScrollTrigger register
gsap.registerPlugin(TextPlugin, ScrollTrigger);

// Headline text animation (Typing effect loop)
gsap.to("#headline", {
  duration: 2,
  text: "Welcome to GrowQuiz!",
  ease: "none",
  repeat: -1,
  repeatDelay: 1,
});

// Welcome Section animation
gsap.from("#welcomeSection", {
  x: -200,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  onComplete: () => {
    gsap.to("#headline", {
      duration: 2,
      text: "Welcome to GrowQuiz!",
      ease: "none"
    });
  }
});

// Loader text animation
gsap.to("#loader h1", {
  text: "Welcome to GrowQuiz!",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut"
});

// Window Load Animations
window.addEventListener('load', () => {

  // Animate Quiz Cards on scroll
  gsap.utils.toArray(".quiz-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 60%",
        scrub: true,
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
    });
  });

  // ScrollTrigger refresh
  ScrollTrigger.refresh();
});

// Hide Loader and animate Header after 1.5s
setTimeout(() => {
  gsap.to("#loader", {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("loader").style.display = "none";

      // Header bounce animation
      gsap.from("header", {
        y: -100,
        opacity: 0,
        duration: 1.5,
        ease: "bounce.out"
      });
    }
  });
}, 1500);

// 🌟 NEW: Navbar appear on scroll
gsap.from("nav", {
  scrollTrigger: {
    trigger: "nav",
    start: "top top",
    toggleActions: "play none none none",
  },
  y: -50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

// 🌟 NEW: Background image slow zoom
gsap.to("#background-image", {
  scale: 1.1,
  duration: 10,
  ease: "none",
  repeat: -1,
  yoyo: true
});

// 🌟 NEW: Button hover animations
document.querySelectorAll(".animated-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, { scale: 1.1, duration: 0.3, ease: "power1.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { scale: 1.0, duration: 0.3, ease: "power1.in" });
  });
});

// 🌟 NEW: Footer appear when near bottom
gsap.from("footer", {
  scrollTrigger: {
    trigger: "footer",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out"
});