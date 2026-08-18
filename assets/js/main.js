/* ==========================================================================
   디자인코드랩 랜딩페이지 인터랙션
   1. 히어로 카드 탭 전환 (3가지 다짐 / 프리미엄 홈페이지 / 기본 유지보수)
   2. FAQ 아코디언 토글
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initTabCard();
  initFaqAccordion();
  initMobileNav();
});

/* --------------------------------------------------------------------------
   히어로 우측 카드: 탭 전환
   -------------------------------------------------------------------------- */
function initTabCard() {
  const tabButtons = document.querySelectorAll('.tab-card__nav-btn');
  const panels = document.querySelectorAll('.tab-card__panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   모바일 헤더: 햄버거 메뉴 토글
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    const willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    toggle.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeNav();
  });
}

/* --------------------------------------------------------------------------
   FAQ 아코디언: 클릭한 항목만 열림, 나머지는 닫힘
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    const toggle = item.querySelector('.faq-item__toggle');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      items.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__toggle').textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        toggle.textContent = '–';
      }
    });
  });
}
