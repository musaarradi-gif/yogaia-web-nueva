/* ============================================================
   YOGAIA — JavaScript Base
   Versión: 1.0.0 | Fase: Esqueleto funcional
   Cubre: Header scroll, Menú móvil, Dropdowns, Acordeón
   ============================================================ */

(function () {
  'use strict';

  /* ─── Header: sombra al hacer scroll ──────────────────────── */
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ─── Menú móvil ───────────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');
  const overlay   = document.createElement('div');

  overlay.className = 'nav-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:rgba(0,0,0,.4)',
    'z-index:199', 'display:none', 'opacity:0',
    'transition:opacity .3s ease'
  ].join(';');

  document.body.appendChild(overlay);

  function openNav() {
    mainNav.classList.add('is-open');
    overlay.style.display = 'block';
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    document.body.style.overflow = 'hidden';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    mainNav.classList.remove('is-open');
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    /* Cierra todos los dropdowns móviles */
    document.querySelectorAll('.has-dropdown.dropdown-open')
      .forEach(el => el.classList.remove('dropdown-open'));
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.contains('is-open') ? closeNav() : openNav();
    });
  }

  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });


  /* ─── Dropdowns en móvil (toggle) ─────────────────────────── */
  document.querySelectorAll('.has-dropdown > .main-nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return; // desktop usa CSS :hover
      e.preventDefault();
      const parent = link.closest('.has-dropdown');
      const isOpen = parent.classList.contains('dropdown-open');

      /* Cierra todos los demás */
      document.querySelectorAll('.has-dropdown.dropdown-open').forEach(el => {
        if (el !== parent) el.classList.remove('dropdown-open');
      });

      parent.classList.toggle('dropdown-open', !isOpen);
    });
  });


  /* ─── Acordeón genérico (legacy API) ──────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen  = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ─── Acordeón nuevo (FAQ v2) ──────────────────────────────── */
  document.querySelectorAll('.accordion__title').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';

      /* Cierra todos los demás del mismo acordeón padre */
      const parent = btn.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion__title[aria-expanded="true"]').forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const otherContent = other.closest('.accordion__item').querySelector('.accordion__content');
            if (otherContent) {
              otherContent.style.maxHeight = null;
              otherContent.style.display = '';
            }
          }
        });
      }

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        setTimeout(() => { content.style.display = ''; }, 300);
      } else {
        btn.setAttribute('aria-expanded', 'true');
        content.style.display = 'block';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  /* ─── Marcar enlace activo en navegación ───────────────────── */
  function markActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav__link, .nav-dropdown a').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  markActiveNavLink();


  /* ─── Cerrar nav al redimensionar a desktop ────────────────── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });


  /* ─── Smooth scroll para anclas internas ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNav();
    });
  });

})();
