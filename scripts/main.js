/* ==============================================
   SKIN SOLUTIONS – DR. NAVDEEP KAUR
   JavaScript – Interactions & Animations
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => navObserver.observe(s));

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinksContainer?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      hamburger?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll reveal animation ---- */
  const revealElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .credential-item, .why-point, .stat-card, .contact-card, .appt-contact-item'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---- Number counter animation ---- */
  const animateCounters = () => {
    document.querySelectorAll('.big-num, .stat-num').forEach(el => {
      const text = el.textContent.trim();
      const numMatch = text.match(/[\d.]+/);
      if (!numMatch) return;
      const target = parseFloat(numMatch[0]);
      const suffix = text.replace(numMatch[0], '');
      const duration = 1800;
      const start = performance.now();
      const isFloat = text.includes('.');

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = isFloat ?
          (target * eased).toFixed(1) :
          Math.floor(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    });
  };

  // Trigger counters once Why Us section is visible
  const whySection = document.getElementById('why-us');
  if (whySection) {
    const countObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        countObserver.disconnect();
      }
    }, { threshold: 0.3 });
    countObserver.observe(whySection);
  }

  /* ---- Appointment form ---- */
  const form = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();

    if (!name || !phone) {
      showError(!name ? 'patientName' : 'patientPhone', 'This field is required');
      return;
    }

    if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone.replace(/\s/g, ''))) {
      showError('patientPhone', 'Please enter a valid phone number');
      return;
    }

    // API submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const bookingData = {
      id: Date.now(),
      name,
      phone,
      age: document.getElementById('patientAge').value,
      treatment: document.getElementById('treatment').value,
      date: document.getElementById('preferredDate').value,
      time: document.getElementById('preferredTime').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };

    // Use localStorage for Demo
    setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
        stored.push(bookingData);
        localStorage.setItem('appointments', JSON.stringify(stored));

        form.style.display = 'none';
        formSuccess.style.display = 'block';
    }, 800);
  });

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#e05555';
    field.style.boxShadow = '0 0 0 3px rgba(224,85,85,0.12)';
    const existing = field.parentElement.querySelector('.field-error');
    if (!existing) {
      const err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'font-size:0.75rem;color:#e05555;margin-top:0.2rem;';
      err.textContent = message;
      field.parentElement.appendChild(err);
    }
    field.focus();
    setTimeout(() => {
      field.style.borderColor = '';
      field.style.boxShadow = '';
      const errEl = field.parentElement.querySelector('.field-error');
      if (errEl) errEl.remove();
    }, 3000);
  }

  /* ---- Set minimum date for appointment ---- */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate() + 1).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ---- Hamburger animation styles (injected once) ---- */
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .hamburger span { transition: all 0.3s ease; }
  `;
  document.head.appendChild(style);

});
