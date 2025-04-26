const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  // Animate the button
  menuBtn.classList.toggle('open');
});

// Animate hamburger icon to X
menuBtn.addEventListener('click', () => {
  const spans = menuBtn.querySelectorAll('span');
  spans[0].classList.toggle('rotate-45');
  spans[0].classList.toggle('translate-y-2');
  spans[1].classList.toggle('opacity-0');
  spans[2].classList.toggle('-rotate-45');
  spans[2].classList.toggle('-translate-y-2');
});
