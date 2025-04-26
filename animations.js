// main.js

// Register Plugins
gsap.registerPlugin(TextPlugin, ScrollTrigger);

// 1. Navbar Animation on Load
gsap.from("header", {
  y: -100,
  opacity: 0,
  duration: 1,
  ease: "bounce.out"
});

// 2. Welcome Headline Text Animation
gsap.to("#headline", {
  duration: 2,
  text: "Welcome to GrowQuiz!",
  ease: "power2.out",
  delay: 0.5
});

// 3. Section Scroll Animations
gsap.utils.toArray("section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out"
  });
});

// 4. Cards Hover Animation

// 5. Page Loader Animation (optional extra touch)
// Ye tab chalega jab tumhara page load hone ke time koi loader dikhana ho
const loader = document.getElementById("page-loader");

if (loader) {
  gsap.to(loader, {
    opacity: 0,
    duration: 1,
    delay: 1.5,
    onComplete: () => {
      loader.style.display = "none";
    }
  });
}

// 6. Buttons Click Animation
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    gsap.fromTo(button, 
      { scale: 1 },
      { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
    );
  });
});

// 7. Parallax Effect on Hero Section
gsap.to("#hero-image", {
  scrollTrigger: {
    trigger: "#hero-image",
    start: "top bottom",
    end: "bottom top",
    scrub: true, // smooth scroll based animation
  },
  scale: 1.2,
  ease: "none"
});
