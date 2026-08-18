/* ==========================================================================
   디자인코드랩 랜딩페이지 인터랙션
   1. 히어로 카드 탭 전환 (3가지 다짐 / 프리미엄 홈페이지 / 기본 유지보수)
   2. FAQ 아코디언 토글
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initTabCard();
  initFaqAccordion();
  initMobileNav();
  initPreviewPage();
  initOrderLookup();
  initConsultModal();
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
   샘플 미리보기 페이지(preview.html): URL 쿼리로 업종별 내용 표시
   레퍼런스 페이지가 아직 없어 실제 샘플 대신 스타일 미리보기 + 제작하기 CTA를 보여줌
   예: preview.html?key=restaurant&title=...&tag=한식당
   -------------------------------------------------------------------------- */
function initPreviewPage() {
  const hero = document.getElementById('previewHero');
  const tagEl = document.getElementById('previewTag');
  const titleEl = document.getElementById('previewTitle');
  if (!hero || !tagEl || !titleEl) return;

  const params = new URLSearchParams(window.location.search);
  const key = params.get('key') || '';
  const title = params.get('title') || '샘플 미리보기';
  const tag = params.get('tag') || '';

  hero.className = 'preview-page__hero' + (key ? ' ' + key : '');
  tagEl.textContent = tag;
  titleEl.textContent = title;
  document.title = title + ' 미리보기 | 디자인코드랩';
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
   상담 신청 팝업
   제출 시 Web3Forms(https://web3forms.com)를 통해 deco_lab@naver.com으로 이메일 전송
   사용 전 아래 WEB3FORMS_ACCESS_KEY를 web3forms.com에서 발급받은 값으로 교체할 것
   -------------------------------------------------------------------------- */
var WEB3FORMS_ACCESS_KEY = '32b626a7-ad22-4fff-aaab-3058e9a73e7d';

function initConsultModal() {
  const modal = document.getElementById('consultModal');
  if (!modal) return;

  const dialog = modal.querySelector('.consult-modal__dialog');
  const form = document.getElementById('consultForm');
  const statusEl = document.getElementById('consultFormStatus');
  const openTriggers = document.querySelectorAll('.js-consult-open');
  let lastFocused = null;

  function openModal() {
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

  openTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', openModal);
  });

  modal.querySelectorAll('[data-consult-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      statusEl.textContent = '이메일 전송 설정이 아직 완료되지 않았습니다. (web3forms.com에서 Access Key 발급 필요)';
      statusEl.className = 'consult-modal__status is-error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', '[디자인코드랩 상담 신청] ' + (formData.get('subject') || ''));
    formData.append('from_name', '디자인코드랩 홈페이지');

    submitBtn.disabled = true;
    statusEl.textContent = '전송 중입니다...';
    statusEl.className = 'consult-modal__status';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        submitBtn.disabled = false;
        if (data.success) {
          statusEl.textContent = '문의가 정상적으로 접수되었습니다. 빠르게 연락드리겠습니다.';
          statusEl.className = 'consult-modal__status is-success';
          form.reset();
        } else {
          statusEl.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
          statusEl.className = 'consult-modal__status is-error';
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        statusEl.textContent = '전송에 실패했습니다. 네트워크 상태를 확인해주세요.';
        statusEl.className = 'consult-modal__status is-error';
      });
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
