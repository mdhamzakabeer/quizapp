

function gsapAnimations() {
    gsap.registerPlugin(TextPlugin, ScrollTrigger);
  
    // Navbar Animation
    gsap.from("header", {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "bounce.out"
    });
  
    // Welcome Headline Text Animation
    gsap.to("#headline", {
      duration: 2,
      text: "Welcome to GrowQuiz!",
      ease: "power2.out",
      delay: 0.5
    });
  
    // Section Scroll Animations
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
  
    // Page Loader Animation
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
  
    // Button Click Animation
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        gsap.fromTo(button, 
          { scale: 1 },
          { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
        );
      });
    });
  
    // Hero Image Parallax Effect
    gsap.to("#hero-image", {
      scrollTrigger: {
        trigger: "#hero-image",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      scale: 1.2,
      ease: "none"
    });
  }
gsapAnimations();