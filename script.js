// Плавное появление блоков при прокрутке
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach(el => observer.observe(el));

// Мобильное меню
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.main-nav');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Плавный скролл с учётом фиксированной шапки
const smoothLinks = document.querySelectorAll('a[href^="#"]');
const header = document.querySelector('.site-header');

smoothLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    const headerOffset = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Текущий год в footer
const currentYear = document.getElementById('current-year');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


// Небольшой каскадный эффект появления карточек
const cards = document.querySelectorAll('.card, .protocol-card');
cards.forEach((card, index) => {
  card.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
});

// Фильтры архива протоколов
const filterChips = document.querySelectorAll('.filter-chip');
const protocolCards = document.querySelectorAll('.protocol-card');

if (filterChips.length && protocolCards.length) {
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter || 'all';

      filterChips.forEach(item => item.classList.toggle('is-active', item === chip));

      protocolCards.forEach((card, index) => {
        const typeList = (card.dataset.types || '').split(' ');
        const shouldShow =
          filter === 'all' ||
          card.dataset.era === filter ||
          typeList.includes(filter);

        card.classList.toggle('is-hidden', !shouldShow);
        card.classList.remove('is-filtered-in');

        if (shouldShow) {
          card.style.animationDelay = `${Math.min(index * 35, 210)}ms`;
          requestAnimationFrame(() => card.classList.add('is-filtered-in'));
        }
      });
    });
  });
}

// Лёгкий 3D-отклик карточек на движение курсора
const canUseHoverMotion = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches;

if (canUseHoverMotion) {
  document.querySelectorAll('.card, .protocol-card').forEach(item => {
    item.addEventListener('pointermove', event => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
      item.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
    });

    item.addEventListener('pointerleave', () => {
      item.style.removeProperty('--rx');
      item.style.removeProperty('--ry');
    });
  });
}
