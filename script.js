// SMKYA - Shared JS
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      burger.setAttribute('aria-expanded', expanded);
    });
  }

  // Scroll reveal via Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Form: friendly submission feedback (mailto fallback)
  document.querySelectorAll('form[data-feedback]').forEach((f) => {
    f.addEventListener('submit', () => {
      const btn = f.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Opening your email…';
      }
    });
  });
});
