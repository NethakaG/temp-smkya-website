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

  // ===== GLOBAL CARDS SPAWN REVEAL =====
  const animateCards = Array.from(document.querySelectorAll('.testimonial-card, .service-card, .pricing-card, .blog-card, .why-stat-card, .process-card, .trainer-card, .trainer-profile'))
    .filter(card => !card.closest('.testimonials-masonry'));
  if (animateCards.length > 0) {
    const directions = ['from-top', 'from-bottom', 'from-left', 'from-right'];
    
    // Assign random starting directions and strip default reveal animations to avoid conflicts
    animateCards.forEach(card => {
      card.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-fade', 'reveal-card-up', 'reveal-card-down');
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      card.classList.add('reveal-masonry', randomDir);
    });

    // IntersectionObserver to stagger entry animation per viewport batch
    const cardsObserver = new IntersectionObserver((entries) => {
      // Filter visible items and sort them by top bounding rect so they animate in sequence (top-to-bottom)
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          const rectA = a.target.getBoundingClientRect();
          const rectB = b.target.getBoundingClientRect();
          return rectA.top - rectB.top;
        });

      visibleEntries.forEach((entry, idx) => {
        // Set dynamic stagger delay (0.1s step) for elements intersecting simultaneously
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('reveal-in');
        cardsObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });

    animateCards.forEach(card => {
      cardsObserver.observe(card);
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



  // ===== REGISTRATION MODAL INJECTION & LOGIC =====
  
  // 1. Inject modal if not on contact.html
  const isContactPage = window.location.pathname.endsWith('contact.html');
  
  if (!isContactPage) {
    const modalHTML = `
      <div id="registration-modal">
        <div class="modal-box booking-form">
          <button class="modal-close-btn" aria-label="Close Modal">&times;</button>
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 32px; text-transform: uppercase;">Register Now</h2>
          
          <form action="#">
            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-email">Email *</label>
                <input type="email" id="modal-email" name="email" class="form-control" required placeholder="hello@example.com">
              </div>
              <div class="form-group">
                <label for="modal-first-name">First Name *</label>
                <input type="text" id="modal-first-name" name="first-name" class="form-control" required placeholder="First name">
              </div>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-last-name">Last Name *</label>
                <input type="text" id="modal-last-name" name="last-name" class="form-control" required placeholder="Last name">
              </div>
              <div class="form-group">
                <label for="modal-mobile-number">Mobile Number (including country code) *</label>
                <input type="tel" id="modal-mobile-number" name="mobile-number" class="form-control" required placeholder="+94 72 149 9479">
              </div>
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-date-of-birth">Date of Birth *</label>
                <input type="date" id="modal-date-of-birth" name="date-of-birth" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="modal-gender">Gender *</label>
                <select id="modal-gender" name="gender" class="form-control" required>
                  <option value="" disabled selected>Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="intersex">Intersex</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-occupation">Occupation</label>
                <input type="text" id="modal-occupation" name="occupation" class="form-control" placeholder="Your occupation">
              </div>
              <div class="form-group">
                <label for="modal-weight">Weight *</label>
                <input type="text" id="modal-weight" name="weight" class="form-control" required placeholder="e.g. 68kg">
              </div>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-country">Country of Residence *</label>
                <input type="text" id="modal-country" name="country" class="form-control" required placeholder="Country">
              </div>
              <div class="form-group">
                <label for="modal-address">Residential Address</label>
                <input type="text" id="modal-address" name="address" class="form-control" placeholder="Residential address">
              </div>
            </div>

            <div class="form-group">
              <label for="modal-health-conditions">Health Conditions *</label>
              <textarea id="modal-health-conditions" name="health-conditions" class="form-control" rows="4" required placeholder="Asthma, PCOS, gastritis, ankle injury, depression, anxiety, etc."></textarea>
            </div>

            <div class="form-group">
              <label for="modal-wellness-goals">Top 3 Wellness Goals *</label>
              <textarea id="modal-wellness-goals" name="wellness-goals" class="form-control" rows="4" required placeholder="Sports-specific training, building self-confidence, weight loss, improving flexibility, building healthy habits, injury prevention/recovery"></textarea>
            </div>

            <div class="form-group">
              <label for="modal-ranked-goals">Rank Your Fitness / Life Goals *</label>
              <textarea id="modal-ranked-goals" name="ranked-goals" class="form-control" rows="4" required placeholder="No.1 Build self-confidence, No.2 lose weight, No.3 improve flexibility"></textarea>
            </div>

            <div class="form-group">
              <label for="modal-program-select">Select the Program *</label>
              <select id="modal-program-select" name="program" class="form-control" required>
                <option value="" disabled selected>Select program</option>
                <option value="life-coaching">Life Coaching with Samaakhya</option>
                <option value="exercise-plan">SMKYA Individual / Couples Exercise Plan</option>
                <option value="nutrition">SMKYA Nutrition Consultation and Guidance</option>
                <option value="combination">A Combination of Packages</option>
              </select>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="modal-preferred-chat-date">Preferred Chat Date *</label>
                <input type="date" id="modal-preferred-chat-date" name="preferred-chat-date" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="modal-preferred-chat-time">Preferred Chat Time *</label>
                <select id="modal-preferred-chat-time" name="preferred-chat-time" class="form-control" required>
                  <option value="" disabled selected>Select time</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-accent">Submit Message</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  const modal = document.getElementById('registration-modal');
  
  function openRegistrationModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeRegistrationModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Set up event listeners for modal controls
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeRegistrationModal);
    }
    
    // Close modal when clicking outside modal box
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeRegistrationModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeRegistrationModal();
      }
    });
  }

  // Intercept all "Start" CTA buttons
  const startButtons = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.trim().toUpperCase() === 'START');
  
  startButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isContactPage) {
        // Smoothly scroll to inline form on the contact page
        const formTarget = document.getElementById('form-target');
        if (formTarget) {
          formTarget.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        openRegistrationModal();
      }
    });
  });

  // ===== BOOKING FORM SUBMISSION (EVENT DELEGATION) =====
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('.booking-form form');
    if (!form) return;
    
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'BOOKING SPOT...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success alert/toast
      showNotification('Success! Your spot has been booked. We will contact you shortly.');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Close modal if form is inside registration modal
      if (modal && modal.classList.contains('open') && modal.contains(form)) {
        setTimeout(() => {
          closeRegistrationModal();
        }, 500);
      }
    }, 1500);
  });

  // Helper notification toast
  function showNotification(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'custom-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '32px';
      toast.style.right = '32px';
      toast.style.backgroundColor = '#9BF2EA';
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
