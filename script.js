/* ============================================================
   VectorStudio — Shared JavaScript
   vectorstudio.tech | info@vectorstudio.tech
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cur && ring) {
    let rx = 0, ry = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
    });
    (function anim() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(anim);
    })();
  }

  /* ── SCROLL PROGRESS ── */
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    window.addEventListener('scroll', () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      prog.style.width = p + '%';
    }, { passive: true });
  }

  /* ── HAMBURGER MENU ── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

  /* ── COUNTER ANIMATION ── */
  function animCount(el, target) {
    const suffix = el.dataset.suffix || '';
    let start = null;
    const dur = 1800;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, +e.target.dataset.count);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── SKILL BAR ANIMATION ── */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.bar-section').forEach(s => barObs.observe(s));

  /* ── 3D TILT ── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const max = +(card.dataset.tilt || 8);
      card.style.transform = `perspective(700px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(4px)`;
      card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── PARALLAX HERO SHAPES ── */
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.shape').forEach((s, i) => {
      s.style.transform = `translateY(${sy * (0.03 + i * 0.015)}px)`;
    });
  }, { passive: true });

  /* ── SMOOTH NAV SCROLL (same-page) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navLinks.length) {
    const setActive = () => {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── BOOKING MODAL ── */
  const backdrop = document.getElementById('bookingModal');
  if (backdrop) {
    // Open triggers
    document.querySelectorAll('[data-book]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close
    const closeModal = () => {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.modal-close, #modalBackdropClose').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* ── FORM SUBMIT via formsubmit.co ── */
    const form = document.getElementById('bookingForm');
    const formBody = document.getElementById('formBody');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        const data = {};
        new FormData(form).forEach((v, k) => { data[k] = v; });
        data['_subject'] = 'New Appointment Request — VectorStudio';
        data['_template'] = 'table';

        try {
          const res = await fetch('https://formsubmit.co/ajax/info@vectorstudio.tech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success === 'true' || result.success === true) {
            formBody.style.display = 'none';
            success.style.display = 'block';
            form.reset();
          } else throw new Error('Failed');
        } catch {
          submitBtn.disabled = false;
          submitBtn.textContent = '⚠ Error — please try again';
          setTimeout(() => { submitBtn.textContent = 'Book My Appointment →'; }, 3000);
        }
      });
    }
  }

});
