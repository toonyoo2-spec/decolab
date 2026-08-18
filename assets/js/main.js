/* ==========================================================================
   디자인코드랩 랜딩페이지 인터랙션
   1. 히어로 카드 탭 전환 (3가지 다짐 / 프리미엄 홈페이지 / 기본 유지보수)
   2. FAQ 아코디언 토글
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initTabCard();
  initFaqAccordion();
  initMobileNav();
  initPreviewModal();
  initOrderLookup();
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
   샘플 카드 "미리보기" 팝업
   레퍼런스 페이지가 아직 없어 실제 샘플 대신 스타일 미리보기 + 제작하기 CTA를 보여줌
   -------------------------------------------------------------------------- */
function initPreviewModal() {
  const modal = document.getElementById('previewModal');
  if (!modal) return;

  const dialog = modal.querySelector('.preview-modal__dialog');
  const imageEl = document.getElementById('previewModalImage');
  const tagEl = document.getElementById('previewModalTag');
  const titleEl = document.getElementById('previewModalTitle');
  const triggers = document.querySelectorAll('.js-preview');
  let lastFocused = null;

  function openModal(trigger) {
    const key = trigger.getAttribute('data-preview-key') || '';
    const title = trigger.getAttribute('data-preview-title') || '';
    const tag = trigger.getAttribute('data-preview-tag') || '';

    imageEl.className = 'preview-modal__image' + (key ? ' ' + key : '');
    tagEl.textContent = tag;
    titleEl.textContent = title;

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dialog.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(trigger);
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

/* --------------------------------------------------------------------------
   주문 조회 페이지(order.html) 전용: 로그인 폼 제출 시 목업 상태 화면 표시
   백엔드 연동 전 시안이므로 입력값 검증 없이 항상 동일한 목업 결과를 보여줌
   -------------------------------------------------------------------------- */
function initOrderLookup() {
  const form = document.getElementById('orderLoginForm');
  const result = document.getElementById('orderStatus');
  if (!form || !result) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* --------------------------------------------------------------------------
   FAQ 아코디언: 항목별로 독립적으로 열고 닫힘 (다른 항목에 영향 없음)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    const toggle = item.querySelector('.faq-item__toggle');

    question.addEventListener('click', function () {
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      toggle.textContent = willOpen ? '–' : '+';
    });
  });
}
