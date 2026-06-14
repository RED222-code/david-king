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
  const headers = Array.from(document.querySelectorAll('.section-heading')).filter((header) => {
    if (
      document.body.classList.contains('home-page') &&
      header.closest('#projects') &&
      window.matchMedia('(max-width: 768px)').matches
    ) {
      return false;
    }
    return true;
  });
  if (!headers.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    headers.forEach((header) => header.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -10% 0px'
  });

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
    updateNavState();
  }

  function updateNavState() {
    const single = slides.length <= 1;
    [prevBtn, nextBtn].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle('is-disabled', single);
      btn.disabled = single;
    });
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

  updateNavState();

  const slideshowWrap = document.querySelector('.projects-slideshow-wrap');
  if (slideshowWrap && 'IntersectionObserver' in window) {
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden) startAutoPlay();
        else stopAutoPlay();
      });
    }, { threshold: 0.15 });
    slideObserver.observe(slideshowWrap);
  } else {
    startAutoPlay();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else if (slideshowWrap && slideshowWrap.getBoundingClientRect().bottom > 0 &&
               slideshowWrap.getBoundingClientRect().top < window.innerHeight) {
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

    const countEl = document.getElementById('projects-count');
    if (countEl) {
      countEl.textContent = visibleCount === 1
        ? '1 project'
        : `${visibleCount} projects`;
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
  const items = Array.from(document.querySelectorAll('.reveal-item, .reveal-left, .reveal-right'))
    .filter((item) => {
      if (item.classList.contains('section-heading')) return false;
      if (
        document.body.classList.contains('home-page') &&
        item.closest('#projects') &&
        window.matchMedia('(max-width: 768px)').matches
      ) {
        return false;
      }
      return true;
    });
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const normalObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      normalObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px',
  });

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 30, 180)}ms`);
    if (item.closest('.hero')) {
      item.classList.add('visible');
      return;
    }
    normalObserver.observe(item);
  });
}


// --- About Page Sticky Nav & Active Highlight ---------------------------------
function initAboutPageTabs() {
  const tabs = document.querySelector('.about-page-tabs');
  if (!tabs) return;

  const activeName = tabs.querySelector('.about-page-tabs-active-name');

  const sectionMap = {
    '#experience': 'Experience',
    '#what-i-do': 'Capabilities',
    '#beyond-code': 'Beyond Code',
  };

  const sections = Object.keys(sectionMap)
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const tabLinks = tabs.querySelectorAll('a');
  let stickyTicking = false;

  function setActiveSection(activeId) {
    tabLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeId);
    });

    if (activeName) {
      if (activeId && sectionMap[activeId]) {
        activeName.textContent = sectionMap[activeId];
        activeName.classList.add('visible');
      } else {
        activeName.classList.remove('visible');
      }
    }
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const visibleSections = new Set();

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        if (entry.isIntersecting) visibleSections.add(id);
        else visibleSections.delete(id);
      });

      let activeId = '';
      sections.forEach((section) => {
        const id = `#${section.id}`;
        if (visibleSections.has(id)) activeId = id;
      });
      setActiveSection(activeId);
    }, {
      rootMargin: '-35% 0px -50% 0px',
      threshold: 0,
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  function updateStickyState() {
    const isMobile = window.innerWidth <= 768;
    const stickyThreshold = isMobile ? 17 : 81;
    tabs.classList.toggle('is-sticky', tabs.getBoundingClientRect().top <= stickyThreshold);
  }

  function scheduleStickyUpdate() {
    if (stickyTicking) return;
    stickyTicking = true;
    requestAnimationFrame(() => {
      updateStickyState();
      stickyTicking = false;
    });
  }

  window.addEventListener('scroll', scheduleStickyUpdate, { passive: true });
  window.addEventListener('resize', scheduleStickyUpdate, { passive: true });
  updateStickyState();
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
  initMobileProcessZoom();
  initAboutPageTabs();
  initMobileStickyHeadings();
  initAboutBlockMobileFocus();


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

// --- Scroll-Driven Process Card Stack (home page, mobile) ---------------------
function initMobileProcessZoom() {
  if (!document.body.classList.contains('home-page')) return;

  const isMobile = () => window.innerWidth <= 768;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const sourceGrid = document.getElementById('process-cards-source');
  const track      = document.getElementById('process-scroll-track');
  const stage      = document.getElementById('process-stack-stage');
  const dotsEl     = document.querySelectorAll('#process-stack-dots .process-swipe-dot');
  const dotsWrap   = document.getElementById('process-stack-dots');
  const projectsSection = document.getElementById('projects');
  const projectsPanel   = projectsSection?.querySelector('.container');

  if (!sourceGrid || !track || !stage) return;

  const sourceCards = Array.from(sourceGrid.querySelectorAll('.process-card'));
  const total       = sourceCards.length;
  if (!total) return;

  let stackCards = [];
  let ticking    = false;
  let lastActive = -1;
  let workHandedOff = false;
  let trackLayout = null;

  function measureTrackLayout() {
    const vh = window.innerHeight;
    const sceneH = vh * SCENE_VH;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    trackLayout = {
      vh,
      sceneH,
      trackTop,
      trackEnd: trackTop + track.offsetHeight,
    };
  }

  // ── Scroll-animation constants ────────────────────────────────────────────
  // Each card occupies one "scene". A scene fraction of 1.0 = one viewport height.
  // ENTER + DWELL + RECEDE must equal 1.0
  const SCENE_VH = 1.5;   // scene height in viewport-height units per card
  const ENTER    = 0.18;  // fraction: card slides up from below
  const DWELL    = 0.60;  // fraction: card is fully active (default)
  const RECEDE   = 0.22;  // fraction: card shrinks behind the next

  // Per-card custom dwell times (overrides default DWELL)
  const CARD_DWELL = [
    0.85,  // Card 1 (Plan): stays longer
    0.85,  // Card 2 (Build): stays longer
    0.85   // Card 3 (Launch): stays longer
  ];
  const WORK_DWELL = 0.85;
  const cardSceneTotal = CARD_DWELL.slice(0, total).reduce((sum, dwell) => sum + dwell, 0);
  const workSceneStart = cardSceneTotal;
  const totalScenes = cardSceneTotal + WORK_DWELL;

  // Bouncy ease-out (approximated spring)
  function bounceOut(t) {
    const b1 = 4/11, b2 = 6/11, b3 = 8/11, b4 = 3/4,
          b5 = 9/11, b6 = 10/11, b7 = 15/16,
          b8 = 21/22, b9 = 63/64, bx = 1 / b1 / b1;
    if (t < b1) return bx * t * t;
    if (t < b3) return bx * (t -= b2) * t + b4;
    if (t < b6) return bx * (t -= b5) * t + b7;
    return bx * (t -= b8) * t + b9;
  }
  function easeOut3(t) { return 1 - Math.pow(1 - t, 3); }

  function applySceneMotion(p, dwell, onActive) {
    let scale = 1;
    let ty = 0;
    let opacity = 1;
    let active = false;

    if (p > ENTER) {
      scale = 0.86;
      ty = 72;
      opacity = 0;
    } else if (p > 0) {
      const t = 1 - (p / ENTER);
      const eased = bounceOut(t);
      scale = 0.86 + eased * 0.14;
      ty = 72 * (1 - eased);
      opacity = Math.min(1, t * 4);
    } else if (p >= -dwell) {
      scale = 1;
      ty = 0;
      opacity = 1;
      active = true;
    } else if (p >= -(dwell + RECEDE)) {
      const t = (-p - dwell) / RECEDE;
      const eased = easeOut3(t);
      scale = 1 - eased * 0.12;
      ty = eased * 28;
      opacity = 1 - eased * 0.58;
    } else {
      const depth = Math.floor(-p - dwell - RECEDE);
      scale = Math.max(0.78, 0.88 - depth * 0.05);
      ty = 28 + depth * 18;
      opacity = Math.max(0.12, 0.42 - depth * 0.15);
    }

    if (onActive) onActive(active);
    return { scale, ty, opacity };
  }

  function markProjectsVisible() {
    projectsSection?.querySelectorAll('.reveal-item, .section-heading').forEach((el) => {
      el.classList.add('visible');
    });
  }

  function resetProjectsScrollState() {
    if (!projectsSection || !projectsPanel) return;
    projectsSection.classList.remove('projects--scroll-handoff', 'projects--scroll-pending', 'projects--scroll-active', 'projects--scroll-complete');
    projectsSection.style.marginTop = '';
    projectsPanel.style.transform = '';
    projectsPanel.style.opacity = '';
    projectsPanel.style.filter = '';
    projectsPanel.style.pointerEvents = '';
    if (dotsWrap) dotsWrap.style.opacity = '';
  }

  // ── Build cloned cards into the stage ────────────────────────────────────
  function buildStack() {
    stage.innerHTML = '';
    stackCards = sourceCards.map((src, i) => {
      const card = src.cloneNode(true);
      card.className = 'process-stack-card';
      // Forward data-step so CSS step-colour variables apply
      card.setAttribute('data-step', src.dataset.step || String(i + 1).padStart(2, '0'));
      card.setAttribute('data-psc-index', i);
      stage.appendChild(card);
      return card;
    });
  }


  // ── Main render — drives every card's transform from scroll position ──────
  function render() {
    if (!isMobile()) {
      track.style.display      = 'none';
      sourceGrid.style.display = '';
      stackCards.forEach(c => { c.style.cssText = ''; c.classList.remove('psc-active'); });
      resetProjectsScrollState();
      workHandedOff = false;
      trackLayout = null;
      return;
    }

    if (!trackLayout) measureTrackLayout();
    const { vh, sceneH, trackTop, trackEnd } = trackLayout;

    // scrolled = px scrolled into the track (accounting for sticky navbar offset)
    const scrolled = Math.max(0, window.scrollY - trackTop + 60);
    const raw = scrolled / sceneH;

    // Calculate cumulative scene positions for each card
    let cumulativeProgress = 0;
    const cardPositions = CARD_DWELL.slice(0, total).map((dwell) => {
      const pos = cumulativeProgress;
      cumulativeProgress += dwell;
      return pos;
    });

    if (workHandedOff || window.scrollY >= trackEnd - vh * 0.2) {
      if (!workHandedOff) {
        workHandedOff = true;
        resetProjectsScrollState();
        projectsSection?.classList.add('projects--scroll-complete');
        markProjectsVisible();
      }
    } else if (projectsSection && projectsPanel) {
      projectsSection.classList.add('projects--scroll-handoff');
      projectsSection.classList.toggle('projects--scroll-pending', raw < workSceneStart - ENTER);
      projectsSection.classList.toggle('projects--scroll-active', raw >= workSceneStart - ENTER);

      const workP = workSceneStart - raw;
      const workMotion = applySceneMotion(workP, WORK_DWELL);
      projectsPanel.style.transform = `translateY(${workMotion.ty.toFixed(1)}px) scale(${workMotion.scale.toFixed(4)})`;
      projectsPanel.style.opacity = workMotion.opacity.toFixed(4);
      projectsPanel.style.pointerEvents = workMotion.opacity > 0.65 ? '' : 'none';

      if (workMotion.opacity > 0.9 && workP <= 0 && workP >= -WORK_DWELL) {
        markProjectsVisible();
      }
    }

    // Update progress dots (hide once Work scene begins)
    if (dotsWrap) {
      const dotsFade = raw < workSceneStart - ENTER
        ? 1
        : Math.max(0, 1 - (raw - (workSceneStart - ENTER)) / 0.12);
      dotsWrap.style.opacity = String(dotsFade);
      dotsWrap.style.pointerEvents = dotsFade > 0.1 ? '' : 'none';
    }

    let activeIdx = 0;
    for (let i = 0; i < total; i++) {
      if (raw >= cardPositions[i]) activeIdx = i;
    }
    if (activeIdx !== lastActive) {
      lastActive = activeIdx;
      dotsEl.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }

    stackCards.forEach((card, i) => {
      const cardDwell = CARD_DWELL[i] || DWELL;
      const cardStart = cardPositions[i];
      const p = cardStart - raw;
      let zIndex = i + 1;

      const motion = applySceneMotion(p, cardDwell, (active) => {
        card.classList.toggle('psc-active', active);
      });

      if (p > ENTER) {
        zIndex = i + 1;
      } else if (p > 0) {
        zIndex = total + 5;
      } else if (p >= -(cardDwell + RECEDE)) {
        zIndex = total + 10;
      } else {
        const depth = Math.floor(-p - cardDwell - RECEDE);
        zIndex = Math.max(1, total - depth);
      }

      if (raw >= workSceneStart - ENTER * 0.5) {
        const handoff = Math.min(1, (raw - (workSceneStart - ENTER * 0.5)) / 0.2);
        motion.opacity *= 1 - handoff * 0.92;
        motion.ty += handoff * 36;
        motion.scale *= 1 - handoff * 0.08;
        card.classList.remove('psc-active');
      }

      card.style.transform = `translateY(${motion.ty.toFixed(1)}px) scale(${motion.scale.toFixed(4)})`;
      card.style.opacity   = motion.opacity.toFixed(4);
      card.style.zIndex    = String(zIndex);
    });
  }

  // ── Setup / teardown ─────────────────────────────────────────────────────
  function setup() {
    if (!isMobile()) {
      track.style.display      = 'none';
      sourceGrid.style.display = '';
      resetProjectsScrollState();
      workHandedOff = false;
      return;
    }

    track.style.display      = 'block';
    sourceGrid.style.display = 'none';
    workHandedOff = false;

    if (!stackCards.length) buildStack();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.height = '';
      resetProjectsScrollState();
      markProjectsVisible();
      stackCards.forEach((card) => {
        card.style.cssText = '';
        card.classList.add('psc-active');
      });
      return;
    }

    const vh     = window.innerHeight;
    const sceneH = vh * SCENE_VH;
    track.style.height = (sceneH * totalScenes).toFixed(0) + 'px';

    if (projectsSection) {
      projectsSection.style.marginTop = `${-(vh - 60)}px`;
      projectsSection.classList.remove('projects--scroll-complete');
    }

    trackLayout = null;
    measureTrackLayout();
    render();
  }

  function scheduleRender() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { render(); ticking = false; });
  }

  setup();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { stackCards = []; trackLayout = null; setup(); }, 200);
  }, { passive: true });

  window.addEventListener('scroll', scheduleRender, { passive: true });
}

// --- Mobile Sticky Section Headings -------------------------------------------
function initMobileStickyHeadings() {
  const isMobile = () => window.innerWidth <= 768;
  const headings = document.querySelectorAll('.section-heading');
  if (!headings.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!isMobile()) {
        entry.target.classList.remove('is-stuck');
        return;
      }
      // Stuck if top is at absolute top (0px) and it crosses the threshold
      const isStuck = entry.intersectionRatio < 1 && entry.boundingClientRect.top <= 1;
      entry.target.classList.toggle('is-stuck', isStuck);
    });
  }, {
    threshold: [1],
    rootMargin: '0px 0px 0px 0px' // aligns with the absolute top edge of viewport
  });

  headings.forEach((heading) => observer.observe(heading));

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      headings.forEach((heading) => heading.classList.remove('is-stuck'));
    }
  }, { passive: true });
}

// --- About section blocks: mobile center focus --------------------------------
function initAboutBlockMobileFocus() {
  const blocks = [
    ...document.querySelectorAll('#about-me .about-block'),
    ...document.querySelectorAll(
      '.about-page .experience-item, .about-page .what-card, .about-page .about-hero-panel, .about-page .beyond-card'
    ),
  ];
  if (!blocks.length) return;

  const isMobile = () => window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer = null;
  let resizeTimer = null;

  function triggerBounce(block) {
    if (prefersReducedMotion || block.dataset.bounced === 'true') return;
    block.dataset.bounced = 'true';
    block.classList.add('is-bouncing');
    block.addEventListener('animationend', () => {
      block.classList.remove('is-bouncing');
    }, { once: true });
  }

  function handleIntersect(entries) {
    entries.forEach((entry) => {
      const block = entry.target;
      if (entry.isIntersecting) {
        block.classList.add('is-viewport-active');
        triggerBounce(block);
      } else {
        block.classList.remove('is-viewport-active', 'is-bouncing');
      }
    });
  }

  function setup() {
    if (observer) {
      blocks.forEach((block) => observer.unobserve(block));
    }

    blocks.forEach((block) => {
      block.classList.remove('is-viewport-active', 'is-bouncing');
    });

    if (!isMobile() || !('IntersectionObserver' in window)) return;

    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-44% 0px -44% 0px',
      threshold: 0,
    });

    blocks.forEach((block) => observer.observe(block));
  }

  setup();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  }, { passive: true });
}
