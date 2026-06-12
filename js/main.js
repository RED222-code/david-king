/* ============================================
   FADE® - Main JavaScript
   ============================================ */

'use strict';

// --- Navbar -------------------------------------------------------------------
// Always show the scrolled (opaque) navbar state - no scroll-based toggle needed.

// --- Mobile Menu --------------------------------------------------------------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// --- Focus Trap (mobile menu) -------------------------------------------------
let _focusTrapHandler = null;

function trapFocus(el) {
  const focusable = Array.from(
    el.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
  ).filter(n => !n.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  _focusTrapHandler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };
  el.addEventListener('keydown', _focusTrapHandler);
  first.focus();
}

function releaseFocusTrap(el) {
  if (_focusTrapHandler) {
    el.removeEventListener('keydown', _focusTrapHandler);
    _focusTrapHandler = null;
  }
  hamburger?.focus();
}

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  if (isOpen) {
    trapFocus(mobileMenu);
  } else {
    releaseFocusTrap(mobileMenu);
  }
}

hamburger?.addEventListener('click', toggleMenu);

document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
    releaseFocusTrap(mobileMenu);
  });
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu();
});

// Close when clicking outside the dropdown
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    toggleMenu();
  }
});

// --- Section Header Reveal ---------------------------------------------------
function initSectionHeaderReveal() {
  const headers = document.querySelectorAll('.section-heading');
  if (!headers.length) return;

  if (!('IntersectionObserver' in window)) {
    headers.forEach((header) => header.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  headers.forEach((header) => observer.observe(header));
}
// --- Smooth Anchor Scroll -----------------------------------------------------
function initSmoothScroll() {
  const navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('start-project-trigger')) return;
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        let navH = navbar ? navbar.offsetHeight : 80;

        // If about page sticky sub-nav is active, offset it as well
        const aboutTabs = document.querySelector('.about-page-tabs');
        if (aboutTabs && window.innerWidth > 768) {
          navH += aboutTabs.offsetHeight;
        } else if (aboutTabs && window.innerWidth <= 768) {
          // On mobile there is no top sticky navbar
          navH = aboutTabs.offsetHeight + 16;
        }

        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// --- FAQ Accordion ------------------------------------------------------------
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(f => {
        f.classList.remove('active');
        f.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// --- Project Inquiry Modal ----------------------------------------------------
function initProjectInquiryForm() {
  const triggers = document.querySelectorAll('.start-project-trigger');
  if (!triggers.length) return;

  const contactEmail = 'davidking18222@gmail.com';
  const whatsappNumber = '2348159243744';

  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="project-modal-backdrop" data-project-modal-close></div>
    <div class="project-modal-panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button type="button" class="project-modal-close" aria-label="Close project form" data-project-modal-close>&times;</button>
      <div class="section-label">Project Inquiry</div>
      <h2 id="project-modal-title">Start a project</h2>
      <form class="project-form" id="project-inquiry-form">
        <div class="project-form-row">
          <label for="project-name">Name</label>
          <input id="project-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
        </div>
        <div class="project-form-row">
          <label for="project-email">Email</label>
          <input id="project-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        </div>
        <div class="project-form-row">
          <select id="project-type" name="type" aria-label="Project type" required>
            <option value="" selected disabled hidden>Project type</option>
            <option>Web app</option>
            <option>Website</option>
            <option>Ecommerce</option>
            <option>Dashboard / SaaS</option>
            <option>API / backend</option>
          </select>
        </div>
        <div class="project-form-row">
          <select id="project-budget" name="budget" aria-label="Budget range" required>
            <option value="" selected disabled hidden>Budget range</option>
            <option>Under $1,000</option>
            <option>$1,000 - $3,000</option>
            <option>$3,000 - $8,000</option>
            <option>$8,000+</option>
          </select>
        </div>
        <div class="project-form-row">
          <label for="project-message">Project details</label>
          <textarea id="project-message" name="message" rows="5" placeholder="Tell me what you're building, your timeline, and any must-have features." required></textarea>
        </div>
        <p class="project-form-note">Submitting sends the inquiry by email and opens WhatsApp with the details ready to send.</p>
        <p class="project-form-status" role="status" aria-live="polite"></p>
        <button type="submit" class="btn btn-primary project-form-submit">Send inquiry</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#project-inquiry-form');
  const firstInput = modal.querySelector('#project-name');
  const status = modal.querySelector('.project-form-status');
  const submitButton = modal.querySelector('.project-form-submit');
  let previouslyFocused = null;

  function openModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    previouslyFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-modal-open');
    setTimeout(() => firstInput?.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-modal-open');
    previouslyFocused?.focus?.();
  }

  function buildMessage(data) {
    return [
      'New project inquiry',
      '',
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone/WhatsApp: ${data.get('phone') || 'Not provided'}`,
      `Project type: ${data.get('type')}`,
      `Budget: ${data.get('budget')}`,
      '',
      'Project details:',
      data.get('message'),
    ].join('\n');
  }

  triggers.forEach(trigger => trigger.addEventListener('click', openModal));
  modal.querySelectorAll('[data-project-modal-close]').forEach(el => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const message = buildMessage(data);
    const subject = encodeURIComponent(`Project inquiry from ${data.get('name')}`);
    const body = encodeURIComponent(message);
    const emailPayload = new FormData();
    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${body}`
      : `https://wa.me/?text=${body}`;

    emailPayload.append('name', data.get('name'));
    emailPayload.append('email', data.get('email'));
    emailPayload.append('phone', data.get('phone') || 'Not provided');
    emailPayload.append('project_type', data.get('type'));
    emailPayload.append('budget', data.get('budget'));
    emailPayload.append('message', message);
    emailPayload.append('_subject', `Project inquiry from ${data.get('name')}`);
    emailPayload.append('_captcha', 'false');

    if (status) status.textContent = 'Opening WhatsApp and sending inquiry...';
    if (submitButton) submitButton.disabled = true;
    window.open(whatsappUrl, '_blank', 'noopener');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: emailPayload,
      });

      if (!response.ok) throw new Error('Email service unavailable');

      if (status) status.textContent = 'Email sent.';
      form.reset();
      setTimeout(closeModal, 600);
    } catch (error) {
      if (status) status.textContent = 'Email service did not respond. Opening your email app instead...';
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// --- Projects Slideshow -------------------------------------------------------
function initProjectsSlideshow() {
  const slides = document.querySelectorAll('.project-slide');
  const dots = document.querySelectorAll('.projects-slideshow-dots .dot');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  if (slides.length === 0) return;

  let currentIndex = 0;
  let timer = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  function nextSlide() {
    showSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAutoPlay() {
    if (slides.length <= 1 || prefersReducedMotion || document.hidden) return;
    stopAutoPlay();
    timer = setInterval(nextSlide, 4200);
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(index);
      startAutoPlay();
    });
  });

  prevBtn?.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

  startAutoPlay();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });
}

// --- Image Fallbacks ----------------------------------------------------------
function initImageFallbacks() {
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.parentElement || img.dataset.fallbackHandled === 'true') return;

    img.dataset.fallbackHandled = 'true';
    img.style.display = 'none';

    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%; height: 100%; min-height: 200px;
      background: linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%);
      border-radius: inherit;
    `;
    img.parentElement.appendChild(placeholder);
  }, true);
}

// --- Project Filter -----------------------------------------------------------
function initProjectFilter() {
  const filterBar = document.querySelector('.projects-filter-bar');
  const filterBtns = Array.from(document.querySelectorAll('.projects-filter-bar .filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('#projects-grid .stack-card'));
  const emptyState = document.querySelector('.projects-filter-empty');
  if (!filterBar || !filterBtns.length || !projectCards.length) return;

  const cardTags = new Map(
    projectCards.map((card) => {
      const tags = (card.dataset.tags || card.dataset.category || '')
        .split(/[\s,]+/)
        .filter(Boolean);
      return [card, tags];
    })
  );

  function applyFilter(filter) {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const tags = cardTags.get(card) || [];
      const isVisible = filter === 'all' || tags.includes(filter);
      if (isVisible) {
        card.removeAttribute('data-hidden');
      } else {
        card.setAttribute('data-hidden', 'true');
      }
      if (isVisible) visibleCount += 1;
    });

    filterBtns.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  filterBar.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn || !filterBar.contains(btn)) return;
    applyFilter(btn.dataset.filter || 'all');
  });

  applyFilter(filterBtns.find((btn) => btn.classList.contains('active'))?.dataset.filter || 'all');
}

// --- Process Stack Deck (mobile) ---------------------------------------------
function initProcessCarousel() {
  const isMobile = () => window.innerWidth <= 768;
  const grid  = document.querySelector('.process-grid');
  const dots  = document.querySelectorAll('.process-swipe-dot');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.process-card'));
  const total = cards.length;
  let current   = 0;
  let animating = false;

  function setGridHeight() {
    if (!isMobile()) {
      grid.style.minHeight = '';
      return;
    }
    let max = 0;
    cards.forEach(c => { max = Math.max(max, c.scrollHeight); });
    if (max > 0) grid.style.minHeight = max + 'px';
  }

  function stackCards() {
    cards.forEach((card, i) => {
      const pos = ((i - current) % total + total) % total;
      card.setAttribute('data-stack', pos <= 2 ? String(pos) : 'hidden');
    });
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function dismissTop() {
    if (animating || !isMobile()) return;
    animating = true;

    const topCard   = cards[current];
    const next      = (current + 1) % total;
    const afterNext = (current + 2) % total;

    topCard.classList.add('stack-exit');
    topCard.setAttribute('data-stack', 'hidden');

    setTimeout(() => {
      cards[next].setAttribute('data-stack', '0');
      cards[next].classList.add('stack-enter');
      cards[afterNext].setAttribute('data-stack', '1');
    }, 20);

    setTimeout(() => {
      topCard.classList.remove('stack-exit');
      cards[next].classList.remove('stack-enter');
      current = next;
      stackCards();
      animating = false;
    }, 500);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.getAttribute('data-stack') === '0') dismissTop();
    });
  });

  let touchStartX = 0;
  grid.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  grid.addEventListener('touchend', e => {
    if (!isMobile()) return;
    if (touchStartX - e.changedTouches[0].clientX > 40) dismissTop();
  }, { passive: true });

  function init() {
    if (isMobile()) {
      requestAnimationFrame(() => {
        setGridHeight();
        stackCards();
      });
    } else {
      cards.forEach(c => c.removeAttribute('data-stack'));
      grid.style.minHeight = '';
    }
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
}

// --- Keyboard Accessibility ---------------------------------------------------
function initA11y() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// --- Page Transitions & Hash Routing ------------------------------------------
function initPageTransitions() {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = Array.from(document.querySelectorAll('.reveal-item, .reveal-left, .reveal-right'));
  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 30, 180)}ms`);
  });

  // On page load, clear the transition state after the first paint.
  requestAnimationFrame(() => {
    if (prefersReducedMotion) {
      body.classList.remove('page-transitioning');
      return;
    }
    requestAnimationFrame(() => {
      body.classList.remove('page-transitioning');
    });
  });

  // Handle internal page routing transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip custom transition for external, mailto, tel, whatsapp, modal triggers
    if (
      link.classList.contains('start-project-trigger') ||
      link.getAttribute('target') === '_blank' ||
      link.getAttribute('rel') === 'noopener' ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('https://wa.me')
    ) {
      return;
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const linkUrl = new URL(link.href, window.location.href);

    if (linkUrl.origin === window.location.origin) {
      // Exclude page-internal hashes
      const isSamePageHash = linkUrl.pathname === window.location.pathname && linkUrl.hash !== '';
      const isIndexFallbackHash = (currentPath === 'index.html' || currentPath === '') && 
                                  (linkUrl.pathname.endsWith('index.html') || linkUrl.pathname.endsWith('/')) && 
                                  linkUrl.hash !== '';

      if (isSamePageHash || isIndexFallbackHash) {
        return;
      }

      // Internal page transition out
      e.preventDefault();
      if (prefersReducedMotion) {
        window.location.href = href;
        return;
      }
      body.classList.add('page-transitioning');

      setTimeout(() => {
        window.location.href = href;
      }, 180);
    }
  });

  // Handle back/forward cache restore
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      body.classList.remove('page-transitioning');
    }
  });

  // Smooth scroll to hash anchor on page load
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      // Reset scroll position instantly to prevent instant browser jump
      window.scrollTo(0, 0);

      // Smooth scroll after entrance transition ends
      setTimeout(() => {
        const navbar = document.getElementById('navbar');
        let navH = navbar ? navbar.offsetHeight : 80;

        const aboutTabs = document.querySelector('.about-page-tabs');
        if (aboutTabs && window.innerWidth > 768) {
          navH += aboutTabs.offsetHeight;
        } else if (aboutTabs && window.innerWidth <= 768) {
          navH = aboutTabs.offsetHeight + 16;
        }

        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 400);
    }
  }
}

// --- Reveal Items ------------------------------------------------------------
function initRevealItems() {
  const items = Array.from(document.querySelectorAll('.reveal-item, .reveal-left, .reveal-right'));
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px',
  });

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 30, 180)}ms`);
    observer.observe(item);
  });
}

// --- About Page Sticky Nav & Active Highlight ---------------------------------
function initAboutPageTabs() {
  const tabs = document.querySelector('.about-page-tabs');
  if (!tabs) return;

  const activeName = tabs.querySelector('.about-page-tabs-active-name');

  const sectionMap = {
    '#experience': 'Experience',
    '#what-i-do': 'What I Do',
    '#beyond-code': 'Beyond Code',
  };

  const sections = Object.keys(sectionMap)
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const tabLinks = tabs.querySelectorAll('a');
  let ticking = false;

  function handleScroll() {
    const isMobile = window.innerWidth <= 768;
    // top: 80px on desktop → threshold 81; top: 16px on mobile → threshold 17
    const stickyThreshold = isMobile ? 17 : 81;
    const rect = tabs.getBoundingClientRect();

    if (rect.top <= stickyThreshold) {
      tabs.classList.add('is-sticky');
    } else {
      tabs.classList.remove('is-sticky');
    }

    // Active section detection
    let activeId = '';
    const scrollPos = window.scrollY + (isMobile ? 120 : 180);

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        activeId = '#' + section.id;
      }
    });

    tabLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === activeId);
    });

    // Update the bento card active-name label
    if (activeName) {
      if (activeId && sectionMap[activeId]) {
        activeName.textContent = sectionMap[activeId];
        activeName.classList.add('visible');
      } else {
        activeName.classList.remove('visible');
      }
    }
  }

  function scheduleHandleScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
  }

  window.addEventListener('scroll', scheduleHandleScroll, { passive: true });
  window.addEventListener('resize', scheduleHandleScroll, { passive: true });
  handleScroll(); // Run once initially
}

// --- Init All -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');
  initPageTransitions();
  initRevealItems();
  initSmoothScroll();

  initSectionHeaderReveal();
  initFAQ();
  initProjectInquiryForm();
  initProjectsSlideshow();
  initProjectFilter();
  initImageFallbacks();
  initA11y();
  initProcessCarousel();
  initAboutPageTabs();


  // Keyboard nav focus styles
  const style = document.createElement('style');
  style.textContent = `
    body.keyboard-nav *:focus {
      outline: 2px solid var(--color-accent) !important;
      outline-offset: 3px;
    }
  `;
document.head.appendChild(style);
});

