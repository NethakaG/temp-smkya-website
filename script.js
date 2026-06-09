document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR BACKGROUND SCROLL EFFECT =====
  const header = document.querySelector('.nav-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== MOBILE MENU DRAWER =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade, .reveal-card-up, .reveal-card-down');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ===== BEFORE / AFTER COMPARISON SLIDER =====
  const sliderContainer = document.querySelector('.ba-slider-container');
  const handle = document.querySelector('.ba-handle');
  const afterImage = document.querySelector('.ba-image-after');

  if (sliderContainer && handle && afterImage) {
    let isDragging = false;

    const setSliderPosition = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      const positionX = clientX - rect.left;
      let percentage = (positionX / rect.width) * 100;
      
      // Clamp values between 0 and 100
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Update handle position and image clipping
      handle.style.left = `${percentage}%`;
      afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // Desktop mouse events
    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobile touch events
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      setSliderPosition(e.touches[0].clientX);
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ===== TESTIMONIALS DRAG & AUTO-SCROLL =====
  const marquee = document.querySelector('.testimonials-marquee');
  if (marquee) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollTimer;

    // Loop scroll event to create seamless infinite scrolling
    marquee.addEventListener('scroll', () => {
      const halfWidth = marquee.scrollWidth / 2;
      if (marquee.scrollLeft >= halfWidth) {
        marquee.scrollLeft = 1;
      } else if (marquee.scrollLeft <= 0) {
        marquee.scrollLeft = halfWidth - 1;
      }
    });

    // Drag scroll handlers for mouse cursor
    marquee.addEventListener('mousedown', (e) => {
      isDown = true;
      marquee.style.cursor = 'grabbing';
      startX = e.pageX - marquee.offsetLeft;
      scrollLeft = marquee.scrollLeft;
      stopAutoScroll();
    });

    marquee.addEventListener('mouseleave', () => {
      isDown = false;
      marquee.style.cursor = 'grab';
      startAutoScroll();
    });

    marquee.addEventListener('mouseup', () => {
      isDown = false;
      marquee.style.cursor = 'grab';
      startAutoScroll();
    });

    marquee.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - marquee.offsetLeft;
      const walk = (x - startX) * 1.5;
      marquee.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile swiping (pauses auto-scroll)
    marquee.addEventListener('touchstart', () => {
      stopAutoScroll();
    }, { passive: true });

    marquee.addEventListener('touchend', () => {
      startAutoScroll();
    }, { passive: true });

    // Auto-scroll loop
    function startAutoScroll() {
      if (autoScrollTimer) return;
      autoScrollTimer = setInterval(() => {
        if (!isDown) {
          marquee.scrollLeft += 1;
        }
      }, 30);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }

    // Initialize auto scroll
    startAutoScroll();
  }



  // ===== BOOKING FORM SUBMISSION =====
  const bookingForm = document.querySelector('.booking-form form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'BOOKING SPOT...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Show success alert/toast
        showNotification('Success! Your spot has been booked. We will contact you shortly.');
        bookingForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Helper notification toast
  function showNotification(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'custom-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '32px';
      toast.style.right = '32px';
      toast.style.backgroundColor = '#00d8ff';
      toast.style.color = '#191919';
      toast.style.fontFamily = "'Unbounded', sans-serif";
      toast.style.fontWeight = '700';
      toast.style.fontSize = '0.8rem';
      toast.style.padding = '16px 28px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
      toast.style.zIndex = '9999';
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      document.body.appendChild(toast);
    }

    toast.textContent = message.toUpperCase();
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 4000);
  }
});
