/**
 * Main Client Scripts — Contemporary Product Studio
 * Navigation management, smooth interactions, active section tracking, and accessible utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavObserver();
  initCopyEmail();
  initSmoothScroll();
});

/**
 * Mobile Navigation Drawer Toggle & Accessibility
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu(isOpen) {
    const nextState = isOpen !== undefined ? isOpen : !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', nextState);
    toggleBtn.setAttribute('aria-expanded', String(nextState));
    document.body.classList.toggle('nav-locked', nextState);
    
    // Toggle icon between hamburger and close (cross/dash)
    const icon = toggleBtn.querySelector('.nav-toggle-icon');
    if (icon) {
      if (nextState) {
        icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
      } else {
        icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
      }
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close when a nav item link is clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        toggleMenu(false);
      }
    });
  });
}

/**
 * Active Section Navigation Tracker using IntersectionObserver
 */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  function updateActiveNav() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 140;

    // If near the top in hero section, no section nav link should be active
    const firstSection = sections[0];
    if (firstSection && scrollY + headerOffset < firstSection.offsetTop) {
      navLinks.forEach((link) => {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      return;
    }

    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Handle bottom of page
    if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 50) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        currentSectionId = lastSection.getAttribute('id');
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (currentSectionId && href === `#${currentSectionId}`) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'location');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Listen to scroll & resize, with initial run
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav, { passive: true });
  updateActiveNav();
}

/**
 * Interactive Copy Email Utility with Visual Confirmation
 */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  if (!copyButtons.length) return;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'hello@productdesigner.com';
      const labelEl = btn.querySelector('.copy-label') || btn;
      const originalText = labelEl.textContent;

      try {
        await navigator.clipboard.writeText(email);
        labelEl.textContent = 'Copied to clipboard!';
        btn.classList.add('is-copied');

        setTimeout(() => {
          labelEl.textContent = originalText;
          btn.classList.remove('is-copied');
        }, 2200);
      } catch (err) {
        // Fallback to mailto
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/**
 * Header Offset Compensation for Smooth Scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jump
        history.pushState(null, '', targetId);
      }
    });
  });
}
