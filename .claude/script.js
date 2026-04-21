/* ===================================================
   大衆プラザ いな勢 — script.js
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     1. ヘッダー スクロール変化
  ────────────────────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ──────────────────────────────
     2. ハンバーガーメニュー
  ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビリンクをクリックしたら閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ──────────────────────────────
     3. スクロール reveal アニメーション
  ────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // 同一親要素の兄弟で順番にディレイをかける
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────
     4. ギャラリー カルーセル
  ────────────────────────────── */
  const track     = document.getElementById('galleryTrack');
  const slides    = track ? [...track.children] : [];
  const dotsWrap  = document.getElementById('galleryDots');
  const prevBtn   = document.getElementById('galleryPrev');
  const nextBtn   = document.getElementById('galleryNext');

  if (!track || slides.length === 0) return;

  let current   = 0;
  let autoTimer = null;

  // 1スライドあたりの表示枚数（CSS と合わせる）
  const getSlidesPerView = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 1;
    return 3;
  };

  const maxIndex = () => Math.max(0, slides.length - getSlidesPerView());

  // ドット生成
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery__dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `${i + 1}枚目へ`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsWrap.querySelectorAll('.gallery__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, maxIndex()));
    const slideW = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${current * slideW}px)`;
    updateDots();
  };

  const next = () => goTo(current < maxIndex() ? current + 1 : 0);
  const prev = () => goTo(current > 0 ? current - 1 : maxIndex());

  prevBtn && prevBtn.addEventListener('click', () => { resetAuto(); prev(); });
  nextBtn && nextBtn.addEventListener('click', () => { resetAuto(); next(); });

  // タッチスワイプ
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { resetAuto(); diff > 0 ? next() : prev(); }
  });

  // 自動再生
  const startAuto = () => { autoTimer = setInterval(next, 4000); };
  const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

  // リサイズ対応
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
    }, 200);
  });

  buildDots();
  goTo(0);
  startAuto();


  /* ──────────────────────────────
     5. スムーススクロール（アンカー）
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // ヘッダー高さ分
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
