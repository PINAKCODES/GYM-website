// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initPreloader();
  initNavigation();
  initScrollAnimations();
  initGalleryFilter();
  initModals();
  initBackToTop();
  initDarkMode();
  initCookieConsent();
  initContactForm();
  initStatsCounter();
  initSmoothScroll();
  initPricingAnimations();
});

// Preloader
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
          preloader.style.display = 'none';
      }, 300);
  });
}

// Navigation
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      const isExpanded = navToggle.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close mobile menu when clicking links
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          navToggle.setAttribute('aria-expanded', 'false');
      });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
              target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });
}

// Scroll Animations with GSAP
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Feature Cards Animation
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
          }
      });
  });

  // Stats Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      
      gsap.to(stat, {
          textContent: target,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
          }
      });
  });

  // Testimonials Animation
  gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
      gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.3,
          ease: "power3.out",
          scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          }
      });
  });
}

// Gallery Filter
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // Filter gallery items
          const filter = button.dataset.filter;
          galleryItems.forEach(item => {
              if (filter === 'all' || item.dataset.category === filter) {
                  item.style.display = 'block';
                  gsap.to(item, { opacity: 1, duration: 0.3 });
              } else {
                  gsap.to(item, {
                      opacity: 0,
                      duration: 0.3,
                      onComplete: () => item.style.display = 'none'
                  });
              }
          });
      });
  });
}

// Modals
function initModals() {
  const modalOverlay = document.querySelector('.modal-overlay');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  const galleryZoomButtons = document.querySelectorAll('.gallery-zoom');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');

  // Open modal function
  function openModal(modal) {
      modalOverlay.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
  }

  // Close modal function
  function closeModal() {
      modalOverlay.classList.remove('active');
      modals.forEach(modal => modal.classList.remove('active'));
      document.body.style.overflow = '';
  }

  // Gallery image zoom
  galleryZoomButtons.forEach(button => {
      button.addEventListener('click', () => {
          const galleryItem = button.closest('.gallery-item');
          const imgSrc = galleryItem.querySelector('img').src;
          const imgAlt = galleryItem.querySelector('img').alt;
          modalImage.src = imgSrc;
          modalImage.alt = imgAlt;
          openModal(imageModal);
      });
  });

  // Close modal events
  closeButtons.forEach(button => {
      button.addEventListener('click', closeModal);
  });

  modalOverlay.addEventListener('click', closeModal);

  // Close modal on escape key
  document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
          backToTop.classList.add('visible');
      } else {
          backToTop.classList.remove('visible');
      }
  });

  backToTop.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
}

// Enhanced Dark Mode Toggle
function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const icon = darkModeToggle.querySelector('i');
  const root = document.documentElement;

  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
  const currentTheme = savedTheme || systemTheme;

  // Apply initial theme
  applyTheme(currentTheme);

  // Theme toggle click handler
  darkModeToggle.addEventListener('click', () => {
      const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
  });

  // System theme change handler
  prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          applyTheme(newTheme);
      }
  });

  function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      updateIcon(theme === 'dark');
      updateColors(theme);
  }

  function updateIcon(isDark) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      darkModeToggle.setAttribute('aria-label', 
          `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  function updateColors(theme) {
      const isDark = theme === 'dark';
      document.body.style.backgroundColor = isDark ? 
          'var(--dark-bg)' : 'var(--light-text)';
      
      // Update specific elements that need color adjustments
      const elements = document.querySelectorAll(
          '.feature-card, .pricing-card, .testimonial-card, .contact-form'
      );
      
      elements.forEach(el => {
          el.style.backgroundColor = isDark ? 
              'var(--dark-surface)' : 'var(--light-text)';
          el.style.borderColor = isDark ? 
              'var(--dark-border)' : 'var(--border-color)';
      });
  }
}

// Cookie Consent
function initCookieConsent() {
  const cookieConsent = document.querySelector('.cookie-consent');
  const acceptButton = document.querySelector('.accept-cookies');
  
  if (!localStorage.getItem('cookieConsent')) {
      cookieConsent.removeAttribute('hidden');
  }

  acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieConsent.setAttribute('hidden', '');
  });
}

// Contact Form
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const inputs = form.querySelectorAll('input, textarea, select');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors
      clearErrors();

      // Validate form
      if (validateForm()) {
          const submitButton = form.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          submitButton.querySelector('.loading-indicator').style.display = 'inline-block';

          try {
              // Simulate form submission
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Show success message
              showMessage('Message sent successfully!', 'success');
              form.reset();
          } catch (error) {
              showMessage('An error occurred. Please try again.', 'error');
          } finally {
              submitButton.disabled = false;
              submitButton.querySelector('.loading-indicator').style.display = 'none';
          }
      }
  });

  // Form validation
  function validateForm() {
      let isValid = true;
      
      inputs.forEach(input => {
          if (input.required && !input.value.trim()) {
              showError(input, 'This field is required');
              isValid = false;
          } else if (input.type === 'email' && !validateEmail(input.value)) {
              showError(input, 'Please enter a valid email address');
              isValid = false;
          }
      });

      return isValid;
  }

  function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
      const errorElement = input.nextElementSibling.nextElementSibling;
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      input.classList.add('error');
  }

  function clearErrors() {
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(error => error.style.display = 'none');
      inputs.forEach(input => input.classList.remove('error'));
  }

  function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `form-message ${type}`;
      messageDiv.textContent = message;
      form.insertBefore(messageDiv, form.firstChild);

      setTimeout(() => {
          messageDiv.remove();
      }, 5000);
  }
}

// Stats Counter
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const target = parseInt(entry.target.dataset.target);
              const duration = 2000;
              const increment = target / (duration / 16);
              let current = 0;

              const updateCounter = () => {
                  current += increment;
                  if (current < target) {
                      entry.target.textContent = Math.floor(current);
                      requestAnimationFrame(updateCounter);
                  } else {
                      entry.target.textContent = target;
                  }
              };

              requestAnimationFrame(updateCounter);
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// Enhanced Smooth Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          
          if (target) {
              const headerOffset = 100;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });

              // Close mobile menu if open
              const navMenu = document.querySelector('.nav-menu');
              const navToggle = document.querySelector('.nav-toggle');
              if (navMenu.classList.contains('active')) {
                  navMenu.classList.remove('active');
                  navToggle.classList.remove('active');
                  document.body.classList.remove('menu-open');
              }
          }
      });
  });
}

// Enhanced Pricing Animations
function initPricingAnimations() {
  gsap.utils.toArray('.pricing-card').forEach((card, i) => {
      // Initial state
      gsap.set(card, { 
          transformPerspective: 1000,
          transformStyle: "preserve-3d"
      });

      // Card animation
      gsap.from(card, {
          y: 100,
          rotationX: -30,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.2,
          ease: "power4.out",
          scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          }
      });

      // Features stagger animation
      const features = card.querySelectorAll('.pricing-features li');
      gsap.from(features, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: i * 0.2 + 0.5,
          ease: "power2.out",
          scrollTrigger: {
              trigger: card,
              start: 'top 85%'
          }
      });

      // Price animation
      const price = card.querySelector('.price');
      gsap.from(price, {
          scale: 0,
          rotation: -15,
          opacity: 0,
          duration: 1,
          delay: i * 0.2 + 0.3,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
              trigger: card,
              start: 'top 85%'
          }
      });

      // Button animation
      const button = card.querySelector('.pricing-btn');
      gsap.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.2 + 0.8,
          ease: "power2.out",
          scrollTrigger: {
              trigger: card,
              start: 'top 85%'
          }
      });
  });
}

function updateDarkMode(isDark) {
  const root = document.documentElement;
  const elements = document.querySelectorAll(
      '.feature-card, .pricing-card, .testimonial-card, .contact-form'
  );
  
  // Apply transitions
  root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  elements.forEach(el => {
      el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
  });
  
  // Update theme
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  
  // Update colors
  document.body.style.backgroundColor = isDark ? 
      'var(--dark-bg)' : 'var(--light-text)';
  
  elements.forEach(el => {
      el.style.backgroundColor = isDark ? 
          'var(--dark-surface)' : 'var(--light-text)';
      el.style.borderColor = isDark ? 
          'var(--dark-border)' : 'var(--border-color)';
  });
  
  // Remove transitions after animation
  setTimeout(() => {
      root.style.transition = '';
      elements.forEach(el => {
          el.style.transition = '';
      });
  }, 300);
}
