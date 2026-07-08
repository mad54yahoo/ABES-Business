(() => {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // ---------- Mobile Navigation ----------
  const initMobileNav = () => {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    if (!menuBtn || !menu) return;

    const icon = menuBtn.querySelector('i');

    const setIcon = (isOpen) => {
      if (!icon) return;
      icon.classList.toggle('fa-times', isOpen);
      icon.classList.toggle('fa-bars', !isOpen);
    };

    const openMenu = () => {
      menu.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      setIcon(true);
    };

    const closeMenu = () => {
      menu.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      setIcon(false);
    };

    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = menu.classList.contains('active');
      isActive ? closeMenu() : openMenu();
    });

    // Close menu after clicking a nav link (event delegation)
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        menu.classList.contains('active') &&
        !menu.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
        menuBtn.focus();
      }
    });
  };

  // ---------- FAQ Accordion ----------
  const initFaqAccordion = () => {
    const faqButtons = qsa('.faq-question');
    if (!faqButtons.length) return;

    faqButtons.forEach((button) => {
      const answer = button.nextElementSibling;
      if (!answer) return;

      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', () => {
        const isOpen = Boolean(answer.style.maxHeight);

        faqButtons.forEach((otherButton) => {
          const otherAnswer = otherButton.nextElementSibling;
          if (otherAnswer && otherAnswer !== answer) {
            otherAnswer.style.maxHeight = null;
            otherButton.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          answer.style.maxHeight = null;
          button.setAttribute('aria-expanded', 'false');
        } else {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  // ---------- Header Shadow on Scroll ----------
  const initHeaderShadow = () => {
    const header = qs('header');
    if (!header) return;

    let ticking = false;

    const updateHeaderShadow = () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 5px 20px rgba(0,0,0,0.35)'
        : 'none';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderShadow);
        ticking = true;
      }
    }, { passive: true });

    updateHeaderShadow();
  };

  // ---------- Contact Form ----------
  const initContactForm = () => {
    const form = qs('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      const nameField = form.querySelector('input[type="text"]');
      const emailField = form.querySelector('input[type="email"]');

      const name = nameField ? nameField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';

      if (!name || !email) {
        e.preventDefault();
        alert('Please fill in all required fields.');
        return;
      }
      // Valid submission: let the browser submit the form normally to FormSubmit.
    });
  };

  // ---------- Statistics Counter Animation ----------
  const initStatsCounter = () => {
    const statsSection = qs('.stats');
    const counters = qsa('.stats h2');
    if (!statsSection || !counters.length) return;

    const animateCounters = () => {
      counters.forEach((counter) => {
        const targetText = counter.textContent;
        const target = parseInt(targetText.replace(/\D/g, ''), 10);
        if (Number.isNaN(target)) return;

        const suffix = targetText.replace(/[0-9]/g, '');
        const increment = Math.max(1, Math.ceil(target / 80));
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = current + suffix;
        }, 20);
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            obs.disconnect();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(statsSection);
    } else {
      let started = false;

      const checkPosition = () => {
        if (started) return;
        const position = statsSection.getBoundingClientRect().top;
        if (position < window.innerHeight - 100) {
          started = true;
          animateCounters();
          window.removeEventListener('scroll', checkPosition);
        }
      };

      window.addEventListener('scroll', checkPosition, { passive: true });
      window.addEventListener('load', checkPosition);
      checkPosition();
    }
  };

  // ---------- Footer Year ----------
  const initFooterYear = () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
      return;
    }

    const footer = qs('footer p');
    if (footer) {
      footer.innerHTML = `&copy; ${new Date().getFullYear()} Accounting For Business Enterprises (ABES). All Rights Reserved.`;
    }
  };

  // ---------- Init ----------
  const init = () => {
    initMobileNav();
    initFaqAccordion();
    initHeaderShadow();
    initContactForm();
    initStatsCounter();
    initFooterYear();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
