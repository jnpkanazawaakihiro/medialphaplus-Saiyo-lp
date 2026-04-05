/**
 * MEDI ALPHA PLUS 採用LP
 * main.js
 */

console.log('🏥 MEDI ALPHA PLUS 採用LP - Loaded Successfully');

document.addEventListener('DOMContentLoaded', function () {

  // ===========================================
  // 1. ヒーロー背景画像の設定
  //    ユーザー提供の集合写真を優先
  // ===========================================
  const heroBgImg = document.getElementById('heroBgImg');
  // ヒーロー背景はCSSで設定済み（images/hero-team.jpg）
  // JSでの動的切り替えは不要


  // ===========================================
  // 2. Header スクロール処理
  // ===========================================
  const header = document.getElementById('site-header');
  
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  // ===========================================
  // 3. ハンバーガーメニュー
  // ===========================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));


  // ===========================================
  // 4. Intersection Observer フェードイン
  // ===========================================
  const fadeSections = document.querySelectorAll(
    '.section-header, .empathy-card, .specimen-card, .suited-card, .step-item, ' +
    '.flow-item, .area-card, .condition-item, .income-card, .support-card, ' +
    '.voice-card, .strength-card, .empathy-answer, .suit-reason, ' +
    '.growth-message, .suited-message, .mission-statement, .ceo-inner, ' +
    '.hero-text, .hero-stats, .income-models, .env-text'
  );

  fadeSections.forEach(el => {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // カードグループは少し遅延させて順番に表示
          const delay = getAnimationDelay(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  fadeSections.forEach(el => observer.observe(el));

  function getAnimationDelay(el) {
    // グリッド内の位置によって遅延を計算
    const gridItems = [
      '.empathy-card', '.specimen-card', '.suited-card',
      '.area-card', '.condition-item', '.income-card',
      '.support-card', '.voice-card', '.strength-card', '.step-item'
    ];
    
    for (const selector of gridItems) {
      if (el.matches(selector)) {
        const siblings = Array.from(document.querySelectorAll(selector));
        const index = siblings.indexOf(el);
        return Math.min(index * 80, 400);
      }
    }
    return 0;
  }


  // ===========================================
  // 5. スムーズスクロール（アンカーリンク）
  // ===========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header ? header.offsetHeight : 72;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  // ===========================================
  // 6. ヒーロー テキスト 登場アニメーション
  // ===========================================
  function animateHero() {
    const heroLabel = document.querySelector('.hero-label');
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSub = document.querySelector('.hero-sub');
    const heroTags = document.querySelector('.hero-tags');
    const heroCta = document.querySelector('.hero-cta-group');
    const heroStats = document.querySelector('.hero-stats');

    const elements = [heroLabel, heroHeadline, heroSub, heroTags, heroCta, heroStats];
    
    elements.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.transitionDelay = `${0.2 + i * 0.15}s`;
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }
  
  animateHero();


  // ===========================================
  // 7. 数値カウントアップ (stats)
  // ===========================================
  function countUp(el, target, duration, isFloat) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      
      if (isFloat) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current);
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isFloat ? target.toFixed(1) : target;
      }
    }
    
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNums = entry.target.querySelectorAll('.stat-num');
          statNums.forEach(el => {
            const text = el.textContent.trim();
            const numMatch = text.match(/[\d.]+/);
            if (numMatch) {
              const num = parseFloat(numMatch[0]);
              const isFloat = text.includes('.');
              const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
              
              // テキストを数値部分のみに
              el.innerHTML = '0' + suffix;
              const textNode = el.firstChild;
              
              countUp(textNode, num, 1800, isFloat);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  // ===========================================
  // 8. 共感カード クリックで選択トグル
  // ===========================================
  const empathyCards = document.querySelectorAll('.empathy-card');
  empathyCards.forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('selected');
      
      if (this.classList.contains('selected')) {
        this.style.background = '#e8f0fb';
        this.style.borderColor = '#1255a4';
        const icon = this.querySelector('.empathy-icon');
        if (icon) {
          icon.style.background = '#1255a4';
          icon.style.color = '#fff';
        }
      } else {
        this.style.background = '';
        this.style.borderColor = '';
        const icon = this.querySelector('.empathy-icon');
        if (icon) {
          icon.style.background = '';
          icon.style.color = '';
        }
      }
    });
  });


  // ===========================================
  // 9. 固定CTAバー（スクロール後に表示）
  // ===========================================
  const stickyCtaBar = createStickyCtaBar();
  
  function createStickyCtaBar() {
    const bar = document.createElement('div');
    bar.id = 'sticky-cta';
    bar.innerHTML = `
      <div class="sticky-cta-inner">
        <p class="sticky-cta-text">医療専門輸送ドライバー募集中</p>
        <a href="#cta" class="sticky-cta-btn">
          <i class="fab fa-line"></i> LINEで応募する
        </a>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      #sticky-cta {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 900;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(10, 22, 40, 0.97);
        backdrop-filter: blur(12px);
        border-top: 1px solid rgba(255,255,255,0.1);
        padding: 12px 24px;
      }
      #sticky-cta.show { transform: translateY(0); }
      .sticky-cta-inner {
        max-width: 1140px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .sticky-cta-text {
        font-size: 0.88rem;
        color: rgba(255,255,255,0.75);
        font-weight: 500;
        flex: 1;
      }
      .sticky-cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        background: #06C755;
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        border-radius: 50px;
        white-space: nowrap;
        text-decoration: none;
        transition: all 0.25s ease;
      }
      .sticky-cta-btn:hover {
        background: #05a848;
        transform: translateY(-1px);
      }
      @media (max-width: 480px) {
        .sticky-cta-text { font-size: 0.75rem; }
        .sticky-cta-btn { padding: 9px 16px; font-size: 0.82rem; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(bar);
    
    // スムーズスクロール対応
    bar.querySelector('.sticky-cta-btn').addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector('#cta');
      if (target) {
        const headerHeight = 72;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
          behavior: 'smooth'
        });
      }
    });
    
    return bar;
  }
  
  let stickyShown = false;
  window.addEventListener('scroll', function () {
    const heroHeight = document.querySelector('.hero') ? document.querySelector('.hero').offsetHeight : 600;
    const ctaSection = document.querySelector('#cta');
    const ctaBottom = ctaSection ? ctaSection.getBoundingClientRect().bottom : Infinity;
    
    if (window.scrollY > heroHeight * 0.7 && ctaBottom > 0) {
      if (!stickyShown) {
        stickyCtaBar.classList.add('show');
        stickyShown = true;
      }
    } else {
      if (stickyShown) {
        stickyCtaBar.classList.remove('show');
        stickyShown = false;
      }
    }
  }, { passive: true });


  // ===========================================
  // LP 案件プレビュー（最大5件をAPIから取得）
  // ===========================================
  const previewGrid = document.getElementById('preview-grid');
  const previewLoading = document.getElementById('preview-loading');

  if (previewGrid) {
    const STATUS_CONFIG = {
      '急募':       { cls: 'status-urgent', icon: 'fas fa-fire',           label: '急募' },
      '募集中':     { cls: 'status-open',   icon: 'fas fa-circle',         label: '募集中' },
      '残りわずか': { cls: 'status-few',    icon: 'fas fa-hourglass-half', label: '残りわずか' },
    };
    const AREA_COLORS = {
      '東京': '#1a73e8', '神奈川': '#0a9396', '埼玉': '#2d6a4f',
      '千葉': '#6a4c93', '東海': '#e07a5f',  '関西': '#c77dff',
      '九州': '#f4845f',
    };

    fetch('data/jobs.json')
      .then(r => r.json())
      .then(data => {
        if (previewLoading) previewLoading.style.display = 'none';
        const jobs = data
          .filter(j => j.is_active !== false && j.status !== '募集終了')
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .slice(0, 5);

        if (!jobs.length) {
          previewGrid.innerHTML = '<p class="preview-no-jobs">現在、案件を準備中です。お気軽にLINEでお問い合わせください。</p>';
          return;
        }

        previewGrid.innerHTML = jobs.map(job => {
          const st = STATUS_CONFIG[job.status] || STATUS_CONFIG['募集中'];
          const areaColor = AREA_COLORS[job.area_tag] || '#888';
          return `
          <div class="preview-job-card">
            <div class="preview-job-top">
              <span class="preview-area-tag" style="background:${areaColor}18;color:${areaColor};border-color:${areaColor}35">
                <i class="fas fa-map-pin"></i> ${job.area_tag || 'その他'}
              </span>
              <span class="preview-status ${st.cls}">
                <i class="${st.icon}"></i> ${st.label}
              </span>
            </div>
            <h3 class="preview-job-title">${job.title}</h3>
            <div class="preview-job-area"><i class="fas fa-map-marker-alt"></i> ${job.area}</div>
            <div class="preview-job-meta">
              <span><i class="fas fa-clock"></i> ${job.time_slot}</span>
              <span><i class="fas fa-calendar-alt"></i> ${job.work_days}</span>
              <span><i class="fas fa-car"></i> ${job.vehicle}</span>
            </div>
            ${Array.isArray(job.features) && job.features.length ? `
            <div class="preview-features">
              ${job.features.map(f => `<span class="preview-feature-tag"><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}
            </div>` : ''}
            <div class="preview-job-footer">
              <span class="preview-reward"><i class="fas fa-yen-sign"></i> 報酬：${job.reward_note}</span>
              <a href="jobs.html" class="preview-detail-btn">詳細を見る <i class="fas fa-arrow-right"></i></a>
            </div>
            <p class="preview-reward-note"><i class="fas fa-info-circle"></i> 報酬は経験・スキルに応じて変動します</p>
          </div>`;
        }).join('');
      })
      .catch(() => {
        if (previewLoading) previewLoading.style.display = 'none';
        previewGrid.innerHTML = '<p class="preview-no-jobs">案件情報の読み込みに失敗しました。</p>';
      });
  }

  // ===== FAQ アコーディオン + タブ =====
  const faqTabs  = document.querySelectorAll('.faq-tab');
  const faqItems = document.querySelectorAll('.faq-item');
  const faqQBtns = document.querySelectorAll('.faq-q');

  // タブ切り替え
  faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      faqTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      faqItems.forEach(item => {
        if (item.dataset.cat === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
          item.querySelector('.faq-q').classList.remove('open');
          item.querySelector('.faq-a').classList.remove('open');
        }
      });
    });
  });

  // アコーディオン開閉
  faqQBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = btn.classList.contains('open');
      btn.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });

});
