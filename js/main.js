/* ============================================
   FADE® — Main JavaScript
   ============================================ */

'use strict';

// ─── Cursor System ───────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const cursorText = cursorFollower?.querySelector('.cursor-text');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    document.body.classList.add('cursor-ready');
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower with lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateCursor() {
    followerX = lerp(followerX, mouseX, 0.12);
    followerY = lerp(followerY, mouseY, 0.12);
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor states
  document.querySelectorAll('a, button, .service-card, .project-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // View cursor for cards with data-cursor-text
  document.querySelectorAll('[data-cursor-text]').forEach(el => {
    const text = el.getAttribute('data-cursor-text');
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view');
      document.body.classList.remove('cursor-hover');
      if (cursorText) cursorText.textContent = text;
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view');
    });
  });

  // Drag cursor for carousel
  const carousel = document.getElementById('services-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-drag');
    });
    carousel.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-drag');
    });
  }
}

// ─── Magnetic Buttons ─────────────────────────────────────────────────────────
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

// ─── Navbar ───────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function updateNavbar() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// ─── Focus Trap (mobile menu) ─────────────────────────────────────────────────
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

// ─── Hero Word Reveal ─────────────────────────────────────────────────────────
function initHeroReveal() {
  const words = document.querySelectorAll('.hero-title .word-reveal');
  words.forEach((word, i) => {
    setTimeout(() => {
      word.classList.add('visible');
    }, 200 + i * 80);
  });

  // Other hero reveal items
  const revealItems = document.querySelectorAll('.hero .reveal-item');
  revealItems.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, 800 + i * 150);
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal-item');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (!sib.classList.contains('visible')) {
            setTimeout(() => {
              sib.classList.add('visible');
            }, delay);
            delay += 80;
          }
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(item => {
    // Skip hero items - they animate on load
    if (!item.closest('.hero-content')) {
      observer.observe(item);
    }
  });
}

// ─── Parallax Hero ────────────────────────────────────────────────────────────
function initParallax() {
  const heroBg = document.getElementById('hero-parallax');
  if (!heroBg) return;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;
    if (scrollY <= maxScroll) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// ─── Services Carousel ────────────────────────────────────────────────────────
function initServicesCarousel() {
  const carousel = document.getElementById('services-carousel');
  if (!carousel) return; // carousel not present on this page

  const prevBtn = document.getElementById('services-prev');
  const nextBtn = document.getElementById('services-next');

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  // Arrow navigation
  const cardWidth = 360 + 16; // card width + gap
  prevBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
  nextBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  // Drag to scroll
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = carousel.scrollLeft;
    carousel.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    carousel.scrollLeft = scrollStart - dx;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.style.userSelect = '';
  });

  // Auto-advance
  let autoTimer = setInterval(() => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= maxScroll - 4) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 4) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 5000);
  });
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
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

// ─── Pricing Toggle ───────────────────────────────────────────────────────────
function initPricingToggle() {
  const monthlyBtn = document.getElementById('toggle-monthly');
  if (!monthlyBtn) return; // pricing UI not present on this page

  const projectBtn = document.getElementById('toggle-project');
  const studioPrice = document.getElementById('price-studio');
  const agencyPrice = document.getElementById('price-agency');

  const prices = {
    monthly: { studio: '$3,500', agency: '$7,500' },
    project: { studio: '$8,000', agency: '$18,000' },
  };

  function setMode(mode) {
    const isMonthly = mode === 'monthly';
    monthlyBtn.classList.toggle('active', isMonthly);
    projectBtn.classList.toggle('active', !isMonthly);

    const p = prices[mode];
    const periodEl1 = studioPrice?.nextElementSibling;
    const periodEl2 = agencyPrice?.nextElementSibling;

    // Animate price change
    [studioPrice, agencyPrice].forEach(el => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
    });

    setTimeout(() => {
      if (studioPrice) studioPrice.textContent = p.studio;
      if (agencyPrice) agencyPrice.textContent = p.agency;
      if (periodEl1) periodEl1.textContent = isMonthly ? '/mo' : ' flat';
      if (periodEl2) periodEl2.textContent = isMonthly ? '/mo' : ' flat';
      [studioPrice, agencyPrice].forEach(el => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'opacity 0.3s, transform 0.3s';
      });
    }, 200);
  }

  monthlyBtn?.addEventListener('click', () => setMode('monthly'));
  projectBtn?.addEventListener('click', () => setMode('project'));
}

// ─── Smooth Anchor Scroll ─────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─── Stats Counter Animation ──────────────────────────────────────────────────
// Project inquiry modal
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
          <input id="project-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="project-form-row">
          <label for="project-email">Email</label>
          <input id="project-email" name="email" type="email" autocomplete="email" required>
        </div>
       
        <div class="project-form-row">
          <label for="project-type">Project type</label>
          <select id="project-type" name="type" required>
            <option value="">Select one</option>
            <option>Web app</option>
            <option>Website</option>
            <option>Ecommerce</option>
            <option>Dashboard / SaaS</option>
            <option>API / backend</option>
          </select>
        </div>
        <div class="project-form-row">
          <label for="project-budget">Budget range</label>
          <select id="project-budget" name="budget" required>
            <option value="">Select one</option>
            <option>Under $1,000</option>
            <option>$1,000 - $3,000</option>
            <option>$3,000 - $8,000</option>
            <option>$8,000+</option>
          </select>
        </div>
        <div class="project-form-row">
          <label for="project-message">Project details</label>
          <textarea id="project-message" name="message" rows="5" required></textarea>
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

  function openModal() {
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

function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  // Use data-counter attribute on any numeric stat element
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.counterSuffix || '';
    if (isNaN(target)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target, suffix);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// ─── Active Nav Link on Scroll ────────────────────────────────────────────────
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.fontWeight = link.getAttribute('href') === `#${id}` ? '700' : '500';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

// ─── Copy images to output folder check ──────────────────────────────────────
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      // Use a gradient placeholder if image fails
      this.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%; height: 100%; min-height: 200px;
        background: linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%);
        border-radius: inherit;
      `;
      this.parentElement.appendChild(placeholder);
    });
  });
}

// ─── Page Load Animation ─────────────────────────────────────────────────────
function initPageLoad() {
  // Animate navbar in
  navbar.style.opacity = '0';
  navbar.style.transform = 'translateY(-20px)';
  navbar.style.transition = 'opacity 0.5s, transform 0.5s';
  setTimeout(() => {
    navbar.style.opacity = '1';
    navbar.style.transform = 'translateY(0)';
  }, 50);
}

// ─── Projects Slideshow ───────────────────────────────────────────────────────
function initProjectsSlideshow() {
  const slides = document.querySelectorAll('.project-slide');
  const dots = document.querySelectorAll('.projects-slideshow-dots .dot');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  if (slides.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = index;
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    if (slides.length <= 1) return; // No-op with a single slide
    stopAutoPlay();
    timer = setInterval(nextSlide, 2500); // 2.5s auto play
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  // Interactive dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(index);
      startAutoPlay(); // Reset timer
    });
  });

  // Prev/Next buttons
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoPlay(); // Reset timer
  });

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoPlay(); // Reset timer
  });

  // Pause on hover
  const container = document.querySelector('.projects-slideshow-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

// ─── Keyboard Accessibility ───────────────────────────────────────────────────
function initA11y() {
  // Tab focus styles
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// ─── Project Filter ───────────────────────────────────────────────────────────
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.removeAttribute('data-hidden');
          card.style.display = '';
        } else {
          card.setAttribute('data-hidden', 'true');
          card.style.display = 'none';
        }
      });
    });
  });
}

// ─── Init All ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Mark JS as active — enables CSS-first hero reveal & other JS-gated styles
  document.body.classList.add('js-ready');
  initPageLoad();
  initHeroReveal();
  initScrollReveal();
  initParallax();
  initServicesCarousel();
  initFAQ();
  initPricingToggle();
  initSmoothScroll();
  initProjectInquiryForm();
  initCounters();
  initActiveNavLink();
  initImageFallbacks();
  initProjectsSlideshow();
  initProjectFilter();
  initA11y();

  // Add keyboard nav styles
  const style = document.createElement('style');
  style.textContent = `
    body.keyboard-nav *:focus {
      outline: 2px solid var(--color-accent) !important;
      outline-offset: 3px;
    }
  `;
  document.head.appendChild(style);
});
