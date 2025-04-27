
gsap.registerPlugin(TextPlugin, ScrollTrigger);

// 2. Welcome Headline Text Animation
gsap.to("#headline", {
    duration: 2,
    text: "Welcome to GrowQuiz!",
    ease: "power2.out",
    delay: 0.5
  });