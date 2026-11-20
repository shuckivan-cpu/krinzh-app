/* ============================================
   Кринж & Co — Client Application JS
   ============================================ */

// ===== SPA ROUTER =====
let currentScreen = 'home';
const NAV_MAP = { home: 'home', catalog: 'catalog', calendar: 'calendar', profile: 'profile' };

function navigateTo(screen, params = {}) {
  if (screen === 'more') { openMoreMenu(); return; }
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Show target
  const el = document.getElementById('screen-' + screen);
  if (el) {
    el.classList.add('active');
    currentScreen = screen;
    window.scrollTo(0, 0);
    // Update bottom nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    const navMatch = Object.keys(NAV_MAP).find(k => NAV_MAP[k] === screen) || '';
    const navEl = document.querySelector(`.nav-item[data-nav="${navMatch}"]`);
    if (navEl) navEl.classList.add('active');
    // Track
    trackPageVisit(screen);
    // Screen-specific init
    initScreen(screen, params);
  }
  window.location.hash = screen;
}

function initScreen(screen, params) {
  switch (screen) {
    case 'home': renderHome(); break;
    case 'test': initTest(); break;
    case 'breathing': /* already set up */ break;
    case 'diary': renderDiary(); break;
    case 'catalog': renderCatalog(); break;
    case 'booking': initBooking(params); break;
    case 'calendar': renderClientCalendar(); break;
    case 'payment': initPayment(params); break;
    case 'profile': renderProfile(); break;
    case 'chat': renderChat(); break;
    case 'notifications': renderNotifications(); break;
    case 'feedback': renderFeedbackForm(); break;
    case 'streams': renderStreams(); break;
    case 'contacts': renderContacts(); break;
  }
}

// ===== HOME SCREEN =====
function renderHome() {
  renderHomeSpecialists();
  renderReviewsCarousel();
  renderVKProducts();
  renderContactInfo();
  renderHomeStreams();
  document.getElementById('legal-notice').textContent = KrinzhData.company.legal;
  updateNotifBadge();
}

function renderHomeSpecialists() {
  const container = document.getElementById('home-specialists');
  if (!container) return;
  container.innerHTML = '';
  
  KrinzhData.specialists.forEach(spec => {
    trackSpecialistView(spec.id);
    const card = document.createElement('div');
    card.className = 'specialist-card';
    card.innerHTML = `
      <div class="spec-avatar-wrapper">
        <div class="specialist-avatar">${spec.avatar}</div>
        <span class="spec-exp-badge">${spec.experience}</span>
      </div>
      <div class="spec-name" title="${spec.name}">${spec.name}</div>
      <div class="spec-role" title="${spec.role}">${spec.role}</div>
      <div class="spec-edu" title="${spec.education}">
        <span style="font-size:0.85rem">🎓</span>
        <span class="spec-edu-text">${spec.education}</span>
      </div>
      <div class="spec-tag" title="${spec.specialization}">
        <span style="font-size:0.8rem">🎯</span>
        <span class="spec-tag-text">${spec.specialization}</span>
      </div>
      <div class="spec-rating-row">
        <div class="star-rating">${renderStars(spec.rating)}</div>
        <span class="rating-value">${spec.rating}</span>
        <span class="reviews-count">(${spec.reviews} отзывов)</span>
      </div>
      <button class="btn btn-outline btn-sm w-full spec-book-btn" onclick="navigateTo('booking',{specialistId:'${spec.id}'})">
        Записаться на приём
      </button>
    `;
    container.appendChild(card);
  });
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= Math.round(rating) ? '' : 'empty'}">${i <= Math.round(rating) ? '★' : '☆'}</span>`;
  }
  return html;
}

// ===== REVIEWS CAROUSEL =====
let reviewIndex = 0;
let reviewInterval;

function renderReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  const dots = document.getElementById('carousel-dots');
  if (!track) return;
  const allReviews = [...KrinzhData.reviews, ...AppState.reviews.filter(r => r.rating >= 4)];
  track.innerHTML = allReviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.avatar || '👤'}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date ? formatDate(r.date) : ''}</div>
        </div>
      </div>
      <div class="star-rating" style="justify-content:flex-start">${renderStars(r.rating)}</div>
      <div class="review-text">"${r.text}"</div>
    </div>
  `).join('');
  dots.innerHTML = allReviews.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToReview(${i})"></span>`).join('');
  reviewIndex = 0;
  clearInterval(reviewInterval);
  reviewInterval = setInterval(() => goToReview((reviewIndex + 1) % allReviews.length), 5000);
}

function goToReview(idx) {
  reviewIndex = idx;
  const track = document.getElementById('reviews-track');
  if (track) track.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// Touch swipe for carousel
(function() {
  let startX = 0;
  document.addEventListener('touchstart', e => {
    if (e.target.closest('.reviews-carousel')) startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (e.target.closest('.reviews-carousel') && startX) {
      const diff = startX - e.changedTouches[0].clientX;
      const totalReviews = KrinzhData.reviews.length;
      if (Math.abs(diff) > 50) {
        goToReview(diff > 0 ? Math.min(reviewIndex + 1, totalReviews - 1) : Math.max(reviewIndex - 1, 0));
      }
      startX = 0;
    }
  }, { passive: true });
})();

function renderVKProducts() {
  const container = document.getElementById('vk-products');
  if (!container) return;
  container.innerHTML = KrinzhData.vkProducts.map(p => `
    <div class="card" style="cursor:pointer" onclick="window.open('${KrinzhData.company.vkLink}','_blank')">
      <div style="background:var(--bg-tertiary);height:80px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:var(--space-3)">🛍️</div>
      <div class="font-medium text-sm">${p.name}</div>
      <div class="text-xs text-muted mb-2">${p.desc}</div>
      <div class="text-amber font-bold">${formatPrice(p.price)}</div>
    </div>
  `).join('');
}

function renderContactInfo() {
  const c = KrinzhData.company;
  const setEl = (id, val) => { const e = document.getElementById(id); if (e) { if (e.tagName === 'A') { e.textContent = val; } else { e.textContent = val; }}};
  setEl('contact-address', c.address);
  setEl('contact-hours', c.workingHours);
  const phone = document.getElementById('contact-phone');
  if (phone) { phone.textContent = c.phone; phone.href = `tel:${c.phone.replace(/\D/g, '')}`; }
  const email = document.getElementById('contact-email');
  if (email) { email.textContent = c.email; email.href = `mailto:${c.email}`; }
}

function renderHomeStreams() {
  const container = document.getElementById('home-streams');
  if (!container) return;
  const streams = (AppState.streams && AppState.streams.length > 0) ? AppState.streams : KrinzhData.streams;
  if (!streams || streams.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📡</div><p class="text-muted">Пока нет запланированных трансляций</p></div>';
    return;
  }
  container.innerHTML = streams.slice(0, 3).map(s => `
    <div class="stream-card mb-3">
      <div class="stream-status ${new Date(s.date) > new Date() ? 'upcoming' : ''}">
        ${new Date(s.date) > new Date() ? '<span class="live-dot" style="display:inline-block;margin-right:4px"></span> 📅 Предстоящий эфир' : '▶ Запись эфира'}
      </div>
      <h4 class="mb-1">${s.title}</h4>
      ${s.description ? `<p class="text-xs text-secondary mb-2">${s.description}</p>` : ''}
      <p class="text-xs text-amber font-bold mb-3">🕐 ${formatDateTime(s.date)}</p>
      <div class="flex gap-2">
        <a href="${s.url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">📺 Смотреть на VK</a>
        <button class="btn btn-sm btn-secondary" onclick="downloadICS('${s.title.replace(/'/g, "\\'")}','Трансляция Кринж & Co','${s.date}')">📅 В календарь</button>
      </div>
    </div>
  `).join('');
}

// ===== EXPRESS TEST =====
let testState = { currentQ: 0, answers: [] };

function initTest() {
  testState = { currentQ: 0, answers: [] };
  renderTestQuestion();
}

function renderTestQuestion() {
  const q = KrinzhData.testQuestions[testState.currentQ];
  const container = document.getElementById('test-content');
  const progress = document.getElementById('test-progress');
  if (!q) { renderTestResults(); return; }

  progress.innerHTML = KrinzhData.testQuestions.map((_, i) =>
    `<div class="progress-step ${i < testState.currentQ ? 'completed' : i === testState.currentQ ? 'current' : ''}"></div>`
  ).join('');

  container.innerHTML = `
    <div class="test-question">
      <p class="text-sm text-muted mb-2">Вопрос ${testState.currentQ + 1} из ${KrinzhData.testQuestions.length}</p>
      <h3>${q.question}</h3>
      ${q.options.map((o, i) =>
        `<button class="test-option" onclick="answerTest(${o.score})">${o.text}</button>`
      ).join('')}
    </div>
  `;
}

function answerTest(score) {
  testState.answers.push(score);
  testState.currentQ++;
  renderTestQuestion();
}

function renderTestResults() {
  const result = calculateTestScore(testState.answers);
  const program = KrinzhData.programs.find(p => p.id === result.recommended);
  
  // Save results
  AppState.testResults.push({ date: new Date().toISOString(), answers: testState.answers, ...result });
  AppState.save('testResults');
  trackEvent('test_completed', { score: result.score, level: result.level });

  document.getElementById('test-progress').innerHTML = KrinzhData.testQuestions.map(() =>
    '<div class="progress-step completed"></div>'
  ).join('');

  document.getElementById('test-content').innerHTML = `
    <div class="test-result">
      <div class="result-score">${result.score}</div>
      <div class="result-level" style="color:var(--${result.color})">${result.level}</div>
      <p class="result-desc">${result.description}</p>
      <div class="card mb-4" style="text-align:left;border-color:var(--amber)">
        <h4 class="mb-2">💡 Рекомендуемая программа:</h4>
        <div class="font-bold text-lg mb-1">${program.name}</div>
        <div class="text-amber font-bold text-xl mb-2">${formatPrice(program.price)}</div>
        <p class="text-sm text-muted">${program.description}</p>
      </div>
      <button class="btn btn-primary btn-block btn-lg" onclick="navigateTo('booking',{programId:'${result.recommended}'})">Записаться на программу</button>
      <button class="btn btn-secondary btn-block mt-4" onclick="initTest()">Пройти тест заново</button>
    </div>
  `;
}

// ===== BREATHING TRAINER =====
let breathingState = { running: false, phase: 'idle', timer: 0, cycle: 0, intervalId: null, animFrameId: null };
const BREATHING_PHASES = [
  { name: 'Вдохните 🌟', duration: 4, cssClass: 'inhale' },
  { name: 'Задержите дыхание 💫', duration: 7, cssClass: 'hold' },
  { name: 'Выдохните 🌙', duration: 8, cssClass: 'exhale' }
];
const MAX_CYCLES = 4;

function toggleBreathing() {
  if (breathingState.running) {
    pauseBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  breathingState.running = true;
  if (breathingState.phase === 'idle') {
    breathingState.cycle = 0;
    breathingState.phaseIndex = 0;
  }
  document.getElementById('breathing-start').textContent = '⏸ Пауза';
  runBreathingPhase();
}

function pauseBreathing() {
  breathingState.running = false;
  clearInterval(breathingState.intervalId);
  document.getElementById('breathing-start').textContent = '▶ Продолжить';
}

function resetBreathing() {
  breathingState.running = false;
  breathingState.phase = 'idle';
  breathingState.cycle = 0;
  clearInterval(breathingState.intervalId);
  const circle = document.getElementById('breathing-circle');
  circle.className = 'breathing-circle';
  circle.style.transform = 'scale(1)';
  document.getElementById('breathing-phase').textContent = 'Нажмите «Старт»';
  document.getElementById('breathing-countdown').textContent = '';
  document.getElementById('breathing-timer').textContent = '';
  document.getElementById('breathing-cycle').textContent = 'Цикл: 0 / ' + MAX_CYCLES;
  document.getElementById('breathing-start').textContent = '▶ Старт';
}

function runBreathingPhase() {
  if (!breathingState.running) return;
  if (breathingState.cycle >= MAX_CYCLES) {
    finishBreathing();
    return;
  }
  const p = BREATHING_PHASES[breathingState.phaseIndex];
  const circle = document.getElementById('breathing-circle');
  circle.className = 'breathing-circle ' + p.cssClass;
  document.getElementById('breathing-phase').textContent = p.name;
  
  let remaining = p.duration;
  document.getElementById('breathing-countdown').textContent = remaining;
  document.getElementById('breathing-cycle').textContent = `Цикл: ${breathingState.cycle + 1} / ${MAX_CYCLES}`;

  clearInterval(breathingState.intervalId);
  breathingState.intervalId = setInterval(() => {
    remaining--;
    document.getElementById('breathing-countdown').textContent = remaining > 0 ? remaining : '';
    if (remaining <= 0) {
      clearInterval(breathingState.intervalId);
      breathingState.phaseIndex++;
      if (breathingState.phaseIndex >= BREATHING_PHASES.length) {
        breathingState.phaseIndex = 0;
        breathingState.cycle++;
      }
      runBreathingPhase();
    }
  }, 1000);
}

function finishBreathing() {
  breathingState.running = false;
  breathingState.phase = 'idle';
  clearInterval(breathingState.intervalId);
  const circle = document.getElementById('breathing-circle');
  circle.className = 'breathing-circle';
  circle.style.transform = 'scale(1)';
  document.getElementById('breathing-phase').textContent = '✨ Отлично! Вы завершили все циклы';
  document.getElementById('breathing-countdown').textContent = '🎉';
  document.getElementById('breathing-start').textContent = '▶ Начать заново';
  breathingState.cycle = 0;
  breathingState.phaseIndex = 0;
  // Track session
  trackEvent('breathing_completed', { cycles: MAX_CYCLES });
  showToast('Дыхательная сессия завершена! 🎉', 'success');
}

// ===== SLEEP DIARY =====
let diaryDate = new Date().toISOString().split('T')[0];

function renderDiary() {
  document.getElementById('diary-date').textContent = formatDate(diaryDate);
  const data = AppState.diary[diaryDate] || {};
  const checklist = document.getElementById('diary-checklist');
  
  checklist.innerHTML = KrinzhData.diaryItems.map(item => {
    const checked = data[item.id] || false;
    return `
      <div class="checklist-item ${checked ? 'checked' : ''}" onclick="toggleDiaryItem('${item.id}')">
        <span class="check-icon">${checked ? '✓' : ''}</span>
        <span style="font-size:1.2rem">${item.icon}</span>
        <span class="check-text">${item.label}</span>
      </div>
    `;
  }).join('');

  updateDiaryProgress();
  renderDiaryChart();
  renderDiaryStreak();

  // Disable future dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('diary-next').disabled = diaryDate >= today;
}

function toggleDiaryItem(itemId) {
  if (!AppState.diary[diaryDate]) AppState.diary[diaryDate] = {};
  AppState.diary[diaryDate][itemId] = !AppState.diary[diaryDate][itemId];
  AppState.save('diary');
  renderDiary();
}

function changeDiaryDay(delta) {
  const d = new Date(diaryDate);
  d.setDate(d.getDate() + delta);
  const today = new Date().toISOString().split('T')[0];
  if (d.toISOString().split('T')[0] <= today) {
    diaryDate = d.toISOString().split('T')[0];
    renderDiary();
  }
}

function updateDiaryProgress() {
  const data = AppState.diary[diaryDate] || {};
  const total = KrinzhData.diaryItems.length;
  const done = KrinzhData.diaryItems.filter(i => data[i.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('diary-percent').textContent = pct + '%';
  document.getElementById('diary-fill').style.width = pct + '%';
}

function renderDiaryChart() {
  const chart = document.getElementById('diary-chart');
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const data = AppState.diary[key] || {};
    const total = KrinzhData.diaryItems.length;
    const done = KrinzhData.diaryItems.filter(item => data[item.id]).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    days.push({ name: DAY_NAMES[(d.getDay() + 6) % 7], pct });
  }
  chart.innerHTML = days.map(d => `
    <div class="day-bar">
      <div class="bar-fill" style="height:${Math.max(d.pct, 2)}%"></div>
      <span class="day-name">${d.name}</span>
    </div>
  `).join('');
}

function renderDiaryStreak() {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    const data = AppState.diary[key] || {};
    const done = KrinzhData.diaryItems.filter(i => data[i.id]).length;
    if (done >= Math.ceil(KrinzhData.diaryItems.length * 0.7)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  const el = document.getElementById('diary-streak');
  el.innerHTML = streak > 0
    ? `<span class="streak-badge">🔥 Серия: ${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}</span>`
    : '<span class="text-sm text-muted">Выполняйте >70% пунктов ежедневно для серии</span>';
}

// ===== CATALOG =====
function renderCatalog() {
  const container = document.getElementById('catalog-list');
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  container.innerHTML = courses.filter(p => p.status !== 'inactive').map(p => {
    trackProgramView(p.id);
    return `
    <div class="program-card">
      ${p.badge ? `<span class="program-badge">${p.badge}</span>` : ''}
      <div class="program-content">
        <div class="program-title">${p.name}</div>
        <div class="program-desc">${p.description}</div>
        <ul class="program-features">
          ${(p.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${p.modules && p.modules.length > 0 ? `
          <div class="program-modules">
            <h5 class="mb-2 accordion-toggle" onclick="this.nextElementSibling.classList.toggle('open')">📖 Модули программы ▾</h5>
            <div class="accordion-content">
              ${p.modules.map(m => `
                <div class="module-item">
                  <span class="module-num">${m.num}</span>
                  <div>
                    <div class="font-medium text-sm">${m.title}</div>
                    ${m.desc ? `<div class="text-xs text-muted">${m.desc}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="flex items-center justify-between mt-4">
          <div>
            <div class="program-price">${formatPrice(p.price)}</div>
            ${p.installment ? `<div class="program-installment">или ${formatPrice(Math.ceil(p.price / 3))}/мес × 3 мес (0%)</div>` : ''}
          </div>
          <button class="btn btn-primary" onclick="navigateTo('booking',{programId:'${p.id}'})">Записаться</button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

// ===== BOOKING SYSTEM =====
let bookingState = { step: 0, programId: '', locationId: '', specialistId: '', date: '', time: '', name: '', phone: '', consent: false };
const BOOKING_STEPS = ['Программа', 'Место', 'Специалист', 'Дата', 'Данные', 'Подтверждение'];

function initBooking(params = {}) {
  if (params.programId) bookingState.programId = params.programId;
  if (params.specialistId) bookingState.specialistId = params.specialistId;
  if (bookingState.programId && bookingState.step === 0) bookingState.step = 1;
  if (AppState.currentUser) {
    bookingState.name = AppState.currentUser.name || '';
    bookingState.phone = AppState.currentUser.phone || '';
  }
  renderBookingStep();
}

function renderBookingStep() {
  renderBookingSteps();
  const container = document.getElementById('booking-content');
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;

  switch (bookingState.step) {
    case 0: // Select program
      container.innerHTML = `
        <h3 class="mb-4">Выберите программу</h3>
        ${courses.filter(p => p.status !== 'inactive').map(p => `
          <div class="location-card mb-3 ${bookingState.programId === p.id ? 'selected' : ''}" onclick="bookingState.programId='${p.id}';bookingState.step=1;renderBookingStep()">
            <div class="loc-name">${p.name}</div>
            <div class="loc-desc">${p.duration} • ${formatPrice(p.price)}</div>
          </div>
        `).join('')}
      `;
      break;
    case 1: // Select location
      const prog = courses.find(p => p.id === bookingState.programId);
      if (prog && (prog.type === 'online')) {
        bookingState.locationId = 'online';
        bookingState.step = 2;
        renderBookingStep();
        return;
      }
      container.innerHTML = `
        <h3 class="mb-4">Выберите турбазу</h3>
        <div class="grid grid-2">
          ${KrinzhData.locations.map(l => `
            <div class="location-card ${bookingState.locationId === l.id ? 'selected' : ''}" onclick="bookingState.locationId='${l.id}';bookingState.step=2;renderBookingStep()">
              <div class="loc-name">${l.name}</div>
              <div class="loc-desc">${l.area} • ${l.distance}</div>
              <div class="loc-amenities">${l.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>
              <div class="text-xs text-amber mt-2">★ ${l.rating}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-secondary mt-4" onclick="bookingState.step=0;renderBookingStep()">← Назад</button>
      `;
      break;
    case 2: // Select specialist
      container.innerHTML = `
        <h3 class="mb-4">Выберите специалиста</h3>
        ${KrinzhData.specialists.map(s => `
          <div class="location-card mb-3 ${bookingState.specialistId === s.id ? 'selected' : ''}" onclick="bookingState.specialistId='${s.id}';bookingState.step=3;renderBookingStep()">
            <div class="flex items-center gap-3">
              <span style="font-size:2rem">${s.avatar}</span>
              <div>
                <div class="loc-name">${s.name}</div>
                <div class="text-sm text-amber">${s.role}</div>
                <div class="text-xs text-muted">${s.experience} опыта • ★ ${s.rating}</div>
              </div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-secondary mt-4" onclick="bookingState.step=1;renderBookingStep()">← Назад</button>
      `;
      break;
    case 3: // Select date & time
      renderBookingCalendar(container);
      break;
    case 4: // Personal data
      container.innerHTML = `
        <h3 class="mb-4">Ваши данные</h3>
        <div class="form-group">
          <label class="form-label">Имя *</label>
          <input type="text" class="form-input" id="booking-name" value="${bookingState.name}" placeholder="Ваше полное имя" oninput="bookingState.name=this.value">
          <div class="form-error">Введите имя (минимум 2 символа)</div>
        </div>
        <div class="form-group">
          <label class="form-label">Телефон *</label>
          <input type="tel" class="form-input" id="booking-phone" value="${bookingState.phone}" placeholder="+7 (___) ___-__-__" oninput="bookingState.phone=this.value">
          <div class="form-error">Введите корректный номер телефона</div>
        </div>
        <div class="form-group">
          <label class="form-label">Выбранная программа</label>
          <input type="text" class="form-input" disabled value="${(courses.find(p => p.id === bookingState.programId) || {}).name || ''}">
        </div>
        <div class="checkbox-group mb-4">
          <input type="checkbox" id="booking-consent" ${bookingState.consent ? 'checked' : ''} onchange="bookingState.consent=this.checked">
          <label for="booking-consent">Я даю согласие на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных»</label>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-secondary" onclick="bookingState.step=3;renderBookingStep()">← Назад</button>
          <button class="btn btn-primary flex-1" onclick="validateAndProceedBooking()">Далее →</button>
        </div>
      `;
      break;
    case 5: // Confirmation
      const selectedProgram = courses.find(p => p.id === bookingState.programId);
      const selectedSpec = KrinzhData.specialists.find(s => s.id === bookingState.specialistId);
      const selectedLoc = KrinzhData.locations.find(l => l.id === bookingState.locationId);
      container.innerHTML = `
        <h3 class="mb-4">Подтверждение записи</h3>
        <div class="card mb-4">
          <div style="display:flex;flex-direction:column;gap:var(--space-3)">
            <div class="flex justify-between"><span class="text-muted">Программа:</span><span class="font-bold">${selectedProgram ? selectedProgram.name : ''}</span></div>
            ${selectedLoc ? `<div class="flex justify-between"><span class="text-muted">Турбаза:</span><span>${selectedLoc.name}</span></div>` : ''}
            <div class="flex justify-between"><span class="text-muted">Специалист:</span><span>${selectedSpec ? selectedSpec.name : ''}</span></div>
            <div class="flex justify-between"><span class="text-muted">Дата:</span><span>${formatDate(bookingState.date)}</span></div>
            <div class="flex justify-between"><span class="text-muted">Время:</span><span>${bookingState.time}</span></div>
            <div class="divider"></div>
            <div class="flex justify-between"><span class="text-muted">Имя:</span><span>${bookingState.name}</span></div>
            <div class="flex justify-between"><span class="text-muted">Телефон:</span><span>${formatPhone(bookingState.phone)}</span></div>
            <div class="divider"></div>
            <div class="flex justify-between"><span class="font-bold text-lg">Стоимость:</span><span class="text-amber font-bold text-lg">${selectedProgram ? formatPrice(selectedProgram.price) : ''}</span></div>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-secondary" onclick="bookingState.step=4;renderBookingStep()">← Назад</button>
          <button class="btn btn-primary flex-1" onclick="confirmBooking()">✅ Подтвердить и оплатить</button>
        </div>
      `;
      break;
  }
}

function renderBookingSteps() {
  const stepsEl = document.getElementById('booking-steps');
  stepsEl.innerHTML = BOOKING_STEPS.map((s, i) => `
    <div class="booking-step ${i < bookingState.step ? 'done' : i === bookingState.step ? 'active' : ''}">
      <span class="step-num">${i < bookingState.step ? '✓' : i + 1}</span>
      ${i < BOOKING_STEPS.length - 1 ? '<span class="step-line"></span>' : ''}
    </div>
  `).join('');
}

let bookingCalMonth, bookingCalYear;
function renderBookingCalendar(container) {
  const now = new Date();
  if (!bookingCalMonth && bookingCalMonth !== 0) { bookingCalMonth = now.getMonth(); bookingCalYear = now.getFullYear(); }
  const days = generateCalendarDays(bookingCalYear, bookingCalMonth);
  const today = now.toISOString().split('T')[0];

  container.innerHTML = `
    <h3 class="mb-4">Выберите дату и время</h3>
    <div class="card mb-2" style="background:var(--amber-soft);border-color:var(--amber)">
      <p class="text-sm" style="color:var(--amber);margin:0">⚠️ Бронирование доступно не позднее чем за 24 часа до сессии</p>
    </div>
    <div class="calendar-wrapper mb-4">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="bookingCalMonth--;if(bookingCalMonth<0){bookingCalMonth=11;bookingCalYear--;}renderBookingStep()">‹</button>
        <span class="month-title">${MONTH_NAMES[bookingCalMonth]} ${bookingCalYear}</span>
        <button class="cal-nav-btn" onclick="bookingCalMonth++;if(bookingCalMonth>11){bookingCalMonth=0;bookingCalYear++;}renderBookingStep()">›</button>
      </div>
      <div class="calendar-grid">
        ${DAY_NAMES.map(d => `<div class="day-label">${d}</div>`).join('')}
        ${days.map(d => {
          const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          const isPast = new Date(dateStr) < new Date(today);
          const isSelected = bookingState.date === dateStr;
          return `<div class="day-cell ${d.otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}"
            onclick="${!isPast && !d.otherMonth ? `selectBookingDate('${dateStr}')` : ''}">${d.day}</div>`;
        }).join('')}
      </div>
    </div>
    ${bookingState.date ? `
      <h4 class="mb-3">Доступное время на ${formatDate(bookingState.date)}</h4>
      <div class="time-slots" id="booking-time-slots"></div>
    ` : '<p class="text-center text-muted">Выберите дату на календаре</p>'}
    <div class="flex gap-3 mt-4">
      <button class="btn btn-secondary" onclick="bookingState.step=2;renderBookingStep()">← Назад</button>
      ${bookingState.time ? `<button class="btn btn-primary flex-1" onclick="bookingState.step=4;renderBookingStep()">Далее →</button>` : ''}
    </div>
  `;
  if (bookingState.date) renderBookingTimeSlots();
}

function selectBookingDate(dateStr) {
  bookingState.date = dateStr;
  bookingState.time = '';
  renderBookingStep();
}

function renderBookingTimeSlots() {
  const container = document.getElementById('booking-time-slots');
  if (!container) return;
  const slots = getAvailableSlots(bookingState.date, bookingState.specialistId);
  container.innerHTML = slots.map(s => `
    <div class="time-slot ${s.available ? '' : s.booked ? 'booked' : 'disabled'} ${bookingState.time === s.time ? 'selected' : ''}"
      onclick="${s.available ? `selectBookingTime('${s.time}')` : ''}">
      ${s.time}${s.booked ? ' 🔒' : s.tooSoon ? ' ⏰' : ''}
    </div>
  `).join('');
}

function selectBookingTime(time) {
  bookingState.time = time;
  renderBookingStep();
}

function validateAndProceedBooking() {
  let valid = true;
  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  
  if (!validateName(bookingState.name)) {
    nameInput.classList.add('error');
    valid = false;
  } else nameInput.classList.remove('error');

  if (!validatePhone(bookingState.phone)) {
    phoneInput.classList.add('error');
    valid = false;
  } else phoneInput.classList.remove('error');

  if (!bookingState.consent) {
    showToast('Необходимо согласие на обработку персональных данных', 'error');
    valid = false;
  }

  if (valid) {
    // Save user
    AppState.currentUser = { name: bookingState.name, phone: bookingState.phone, role: 'client' };
    AppState.save('currentUser');
    bookingState.step = 5;
    renderBookingStep();
  }
}

function confirmBooking() {
  const booking = bookSlot({
    programId: bookingState.programId,
    locationId: bookingState.locationId,
    specialistId: bookingState.specialistId,
    date: bookingState.date,
    time: bookingState.time,
    userName: bookingState.name,
    userPhone: bookingState.phone
  });
  showToast('Запись создана! Переходим к оплате...', 'success');
  addNotification('📋 Запись создана', `Вы записаны на ${formatDate(booking.date)} в ${booking.time}`, 'info');
  
  // Reset booking state
  const programId = bookingState.programId;
  bookingState = { step: 0, programId: '', locationId: '', specialistId: '', date: '', time: '', name: '', phone: '', consent: false };
  
  // Go to payment
  navigateTo('payment', { bookingId: booking.id });
}

// ===== CALENDAR VIEW =====
let calMonth, calYear;

function renderClientCalendar() {
  const now = new Date();
  if (!calMonth && calMonth !== 0) { calMonth = now.getMonth(); calYear = now.getFullYear(); }
  const days = generateCalendarDays(calYear, calMonth);
  const today = now.toISOString().split('T')[0];
  const container = document.getElementById('client-calendar');

  // Find days with bookings
  const bookingDates = new Set(AppState.bookings.filter(b => b.status !== 'cancelled').map(b => b.date));

  container.innerHTML = `
    <div class="calendar-header">
      <button class="cal-nav-btn" onclick="calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderClientCalendar()">‹</button>
      <span class="month-title">${MONTH_NAMES[calMonth]} ${calYear}</span>
      <button class="cal-nav-btn" onclick="calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderClientCalendar()">›</button>
    </div>
    <div class="calendar-grid">
      ${DAY_NAMES.map(d => `<div class="day-label">${d}</div>`).join('')}
      ${days.map(d => {
        const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
        const isToday = dateStr === today;
        const hasBooking = bookingDates.has(dateStr);
        return `<div class="day-cell ${d.otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasBooking ? 'has-booking' : ''}">${d.day}</div>`;
      }).join('')}
    </div>
  `;

  renderMyBookings();
}

function renderMyBookings() {
  const container = document.getElementById('my-bookings-list');
  const bookings = AppState.bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (bookings.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p class="text-muted">У вас пока нет записей</p><button class="btn btn-primary btn-sm mt-4" onclick="navigateTo(\'catalog\')">Посмотреть программы</button></div>';
    return;
  }
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  container.innerHTML = bookings.map(b => {
    const prog = courses.find(p => p.id === b.programId);
    const spec = KrinzhData.specialists.find(s => s.id === b.specialistId);
    const canCancel = canCancelBooking(b);
    const statusLabels = { pending: 'Ожидает', confirmed: 'Подтверждена', paid: 'Оплачена', cancelled: 'Отменена', completed: 'Завершена' };
    return `
      <div class="card mb-3">
        <div class="flex justify-between items-center mb-2">
          <span class="badge badge-${b.status}">${statusLabels[b.status] || b.status}</span>
          <span class="text-xs text-muted">${formatDateShort(b.date)} ${b.time}</span>
        </div>
        <div class="font-bold mb-1">${prog ? prog.name : 'Программа'}</div>
        <div class="text-sm text-muted mb-2">${spec ? spec.name : ''}</div>
        <div class="flex gap-2">
          ${canCancel && b.status !== 'cancelled' ? `<button class="btn btn-danger btn-sm" onclick="handleCancelBooking('${b.id}')">Отменить</button>` : ''}
          ${b.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="navigateTo('payment',{bookingId:'${b.id}'})">Оплатить</button>` : ''}
          ${b.status === 'completed' || b.status === 'confirmed' ? `<button class="btn btn-secondary btn-sm" onclick="navigateTo('feedback')">Оставить отзыв</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function handleCancelBooking(bookingId) {
  document.getElementById('confirm-title').textContent = 'Отмена записи';
  document.getElementById('confirm-text').textContent = 'Вы уверены, что хотите отменить эту запись? Если запись была оплачена, средства будут возвращены.';
  document.getElementById('confirm-action').onclick = () => {
    if (cancelBooking(bookingId)) {
      showToast('Запись отменена', 'success');
      renderMyBookings();
    } else {
      showToast('Не удалось отменить запись (менее 24 часов до сессии)', 'error');
    }
    closeModal('confirm-modal');
  };
  openModal('confirm-modal');
}

// ===== PAYMENT SYSTEM =====
let paymentState = { bookingId: '', method: 'card', installmentMonths: 0, processing: false };

function initPayment(params = {}) {
  if (params.bookingId) paymentState.bookingId = params.bookingId;
  renderPayment();
}

function renderPayment() {
  const container = document.getElementById('payment-content');
  const booking = AppState.bookings.find(b => b.id === paymentState.bookingId);
  if (!booking) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><p class="text-muted">Нет заказа для оплаты</p><button class="btn btn-primary btn-sm mt-4" onclick="navigateTo(\'catalog\')">Перейти к программам</button></div>';
    return;
  }
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  const prog = courses.find(p => p.id === booking.programId);
  const price = prog ? prog.price : 0;

  if (paymentState.processing) {
    container.innerHTML = `
      <div class="payment-processing">
        <div class="spinner"></div>
        <h3>Обработка оплаты...</h3>
        <p class="text-muted">Пожалуйста, не закрывайте страницу</p>
      </div>
    `;
    return;
  }

  if (booking.paymentStatus === 'paid') {
    const payment = AppState.payments.find(p => p.bookingId === booking.id && p.status === 'success');
    container.innerHTML = `
      <div class="payment-success">
        <div class="success-icon">✅</div>
        <h3 class="mb-2">Оплата прошла успешно!</h3>
        <p class="text-muted mb-4">Чек: ${payment ? payment.receipt : 'N/A'}</p>
        <div class="card mb-4" style="text-align:left">
          <div class="font-bold mb-2">${prog ? prog.name : ''}</div>
          <div class="text-sm text-muted mb-1">${formatDate(booking.date)} в ${booking.time}</div>
          <div class="text-amber font-bold">${formatPrice(price)}</div>
        </div>
        <button class="btn btn-primary btn-block" onclick="navigateTo('calendar')">Перейти в календарь</button>
      </div>
    `;
    return;
  }

  const installment3 = calculateInstallment(price, 3);
  const installment6 = calculateInstallment(price, 6);
  const installment12 = calculateInstallment(price, 12);

  container.innerHTML = `
    <div class="card mb-4" style="border-color:var(--amber)">
      <div class="flex justify-between items-center">
        <div>
          <div class="font-bold">${prog ? prog.name : ''}</div>
          <div class="text-sm text-muted">${formatDate(booking.date)} в ${booking.time}</div>
        </div>
        <div class="text-amber font-bold text-xl">${formatPrice(price)}</div>
      </div>
    </div>

    <h4 class="mb-3">Способ оплаты</h4>
    <div class="payment-method-selector">
      <div class="payment-method ${paymentState.method === 'card' ? 'selected' : ''}" onclick="paymentState.method='card';renderPayment()">
        <div class="method-icon">💳</div>
        <div>Карта</div>
      </div>
      <div class="payment-method ${paymentState.method === 'sbp' ? 'selected' : ''}" onclick="paymentState.method='sbp';renderPayment()">
        <div class="method-icon">📱</div>
        <div>СБП</div>
      </div>
      <div class="payment-method ${paymentState.method === 'installment' ? 'selected' : ''}" onclick="paymentState.method='installment';renderPayment()">
        <div class="method-icon">📊</div>
        <div>Рассрочка 0%</div>
      </div>
    </div>

    ${paymentState.method === 'card' ? `
      <div class="payment-card-form">
        <div class="form-group">
          <label class="form-label">Номер карты</label>
          <input type="text" class="form-input" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCardNumber(this)">
        </div>
        <div class="flex gap-3">
          <div class="form-group" style="flex:1">
            <label class="form-label">Срок</label>
            <input type="text" class="form-input" id="card-expiry" placeholder="MM/ГГ" maxlength="5">
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">CVV</label>
            <input type="password" class="form-input" id="card-cvv" placeholder="•••" maxlength="3">
          </div>
        </div>
      </div>
    ` : paymentState.method === 'sbp' ? `
      <div class="card text-center">
        <div style="font-size:4rem;margin-bottom:var(--space-3)">📱</div>
        <p>При нажатии «Оплатить» откроется экран оплаты через Систему Быстрых Платежей</p>
      </div>
    ` : `
      <div class="card">
        <h4 class="mb-3">Выберите срок рассрочки (0%)</h4>
        <div class="flex flex-col gap-2">
          <div class="location-card ${paymentState.installmentMonths === 3 ? 'selected' : ''}" onclick="paymentState.installmentMonths=3;renderPayment()">
            <div class="flex justify-between"><span>3 месяца</span><span class="font-bold text-amber">${formatPrice(installment3.monthly)}/мес</span></div>
          </div>
          <div class="location-card ${paymentState.installmentMonths === 6 ? 'selected' : ''}" onclick="paymentState.installmentMonths=6;renderPayment()">
            <div class="flex justify-between"><span>6 месяцев</span><span class="font-bold text-amber">${formatPrice(installment6.monthly)}/мес</span></div>
          </div>
          <div class="location-card ${paymentState.installmentMonths === 12 ? 'selected' : ''}" onclick="paymentState.installmentMonths=12;renderPayment()">
            <div class="flex justify-between"><span>12 месяцев</span><span class="font-bold text-amber">${formatPrice(installment12.monthly)}/мес</span></div>
          </div>
        </div>
        <p class="text-xs text-muted mt-2">Переплата 0%. Итого: ${formatPrice(price)}</p>
      </div>
    `}

    <button class="btn btn-primary btn-block btn-lg mt-4" onclick="processPaymentAction()">
      💳 Оплатить ${formatPrice(price)}
    </button>
  `;
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

async function processPaymentAction() {
  const booking = AppState.bookings.find(b => b.id === paymentState.bookingId);
  if (!booking) return;
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  const prog = courses.find(p => p.id === booking.programId);
  if (!prog) return;

  paymentState.processing = true;
  renderPayment();

  const payment = await processPayment(prog.price, paymentState.method, paymentState.bookingId);
  paymentState.processing = false;

  if (payment.status === 'success') {
    renderPayment(); // Will show success
  } else {
    showToast('Ошибка оплаты. Попробуйте ещё раз.', 'error');
    renderPayment();
  }
}

// ===== CHAT =====
const CHAT_THREAD = 'support';

function renderChat() {
  const msgs = AppState.chatMessages[CHAT_THREAD] || [];
  const container = document.getElementById('chat-messages');
  
  if (msgs.length === 0) {
    // Welcome message
    addChatMessage(CHAT_THREAD, 'Здравствуйте! 👋 Я помощник Кринж & Co. Задайте вопрос или напишите тему:\n\n• Запись на программу\n• Стоимость услуг\n• Отмена записи\n• Информация о турбазах', 'support');
  }

  const allMsgs = AppState.chatMessages[CHAT_THREAD] || [];
  container.innerHTML = allMsgs.map(m => `
    <div class="chat-message ${m.from === 'user' ? 'outgoing' : 'incoming'}">
      ${m.text.replace(/\n/g, '<br>')}
      <div class="msg-time">${new Date(m.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  addChatMessage(CHAT_THREAD, text, 'user');
  input.value = '';
  renderChat();

  // Show typing
  const container = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  // Auto-response
  setTimeout(() => {
    typing.remove();
    const response = getChatAutoResponse(text);
    addChatMessage(CHAT_THREAD, response, 'support');
    renderChat();
  }, 1500);
}

// ===== NOTIFICATIONS =====
function renderNotifications() {
  const container = document.getElementById('notifications-list');
  const notifs = [...AppState.notifications].reverse();
  if (notifs.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><p class="text-muted">Нет уведомлений</p></div>';
    return;
  }
  container.innerHTML = notifs.map(n => {
    const icons = { info: 'ℹ️', promo: '🎁', reminder: '⏰', stream: '📺', success: '✅' };
    return `
    <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}');this.classList.remove('unread')">
      <span class="notif-icon">${icons[n.type] || 'ℹ️'}</span>
      <div style="flex:1">
        <div class="notif-title">${n.title}</div>
        <div class="notif-text">${n.body}</div>
        <div class="notif-time">${timeAgo(n.date)}</div>
        ${n.streamUrl ? `<a href="${n.streamUrl}" target="_blank" class="btn btn-sm btn-primary mt-2">Смотреть</a>` : ''}
        ${n.calendarData ? `<button class="btn btn-sm btn-secondary mt-2" onclick="downloadICS('${n.calendarData.title}','','${n.calendarData.date}')">📅 В календарь</button>` : ''}
      </div>
    </div>
  `;
  }).join('');
  updateNotifBadge();
}

function updateNotifBadge() {
  const count = getUnreadCount();
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.style.display = count > 0 ? 'flex' : 'none';
    badge.textContent = count > 9 ? '9+' : count;
  }
}

// ===== FEEDBACK =====
let feedbackRating = 0;

function renderFeedbackForm() {
  const select = document.getElementById('feedback-session');
  const completedBookings = AppState.bookings.filter(b => ['confirmed', 'paid', 'completed'].includes(b.status));
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  select.innerHTML = '<option value="">Выберите сессию...</option>' +
    completedBookings.map(b => {
      const prog = courses.find(p => p.id === b.programId);
      return `<option value="${b.id}">${prog ? prog.shortName || prog.name : 'Сессия'} — ${formatDateShort(b.date)}</option>`;
    }).join('');
  feedbackRating = 0;
  updateFeedbackStars();
}

function setFeedbackRating(rating) {
  feedbackRating = rating;
  updateFeedbackStars();
}

function updateFeedbackStars() {
  document.querySelectorAll('#feedback-stars .star-btn').forEach((star, i) => {
    star.textContent = i < feedbackRating ? '★' : '☆';
    star.classList.toggle('active', i < feedbackRating);
  });
}

function submitFeedbackForm() {
  const session = document.getElementById('feedback-session').value;
  const text = document.getElementById('feedback-text').value.trim();
  const isAnon = document.getElementById('feedback-anon').checked;

  if (!feedbackRating) { showToast('Пожалуйста, поставьте оценку', 'error'); return; }
  if (!text) { showToast('Напишите ваши впечатления', 'error'); return; }

  submitFeedback({
    bookingId: session,
    rating: feedbackRating,
    text,
    name: isAnon ? 'Аноним' : (AppState.currentUser ? AppState.currentUser.name : 'Клиент'),
    avatar: '👤'
  });

  document.getElementById('feedback-text').value = '';
  feedbackRating = 0;
  updateFeedbackStars();
}

// ===== STREAMS =====
function renderStreams() {
  const container = document.getElementById('streams-list');
  const streams = (AppState.streams && AppState.streams.length > 0) ? AppState.streams : KrinzhData.streams;
  if (!streams || streams.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📺</div><p class="text-muted">Нет запланированных трансляций</p><p class="text-xs text-muted">Следите за обновлениями в нашем <a href="https://vk.ru/club241842043" target="_blank">сообществе VK</a></p></div>';
    return;
  }
  container.innerHTML = streams.map(s => `
    <div class="stream-card mb-3">
      <div class="stream-status ${new Date(s.date) > new Date() ? 'upcoming' : ''}">
        ${new Date(s.date) > new Date() ? '<span class="live-dot" style="display:inline-block;margin-right:4px"></span> 📅 Предстоящий эфир' : '▶ Запись эфира'}
      </div>
      <h4 class="mb-1">${s.title}</h4>
      <p class="text-sm text-secondary mb-2">${s.description || ''}</p>
      <p class="text-sm text-amber font-bold mb-3">🕐 ${formatDateTime(s.date)}</p>
      <div class="flex gap-2">
        <a href="${s.url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">📺 Смотреть на VK</a>
        <button class="btn btn-sm btn-secondary" onclick="downloadICS('${s.title.replace(/'/g, "\\'")}','Трансляция Кринж & Co','${s.date}')">📅 В календарь</button>
      </div>
    </div>
  `).join('');
}

// ===== CONTACTS =====
function renderContacts() {
  const c = KrinzhData.company;
  const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  setEl('contacts-address', c.address);
  setEl('contacts-hours', c.workingHours);
  const phone = document.getElementById('contacts-phone');
  if (phone) { phone.textContent = c.phone; phone.href = `tel:${c.phone.replace(/\D/g, '')}`; }
  const email = document.getElementById('contacts-email');
  if (email) { email.textContent = c.email; email.href = `mailto:${c.email}`; }
}

// ===== PROFILE =====
function renderProfile() {
  if (AppState.currentUser) {
    document.getElementById('profile-name').value = AppState.currentUser.name || '';
    document.getElementById('profile-phone').value = AppState.currentUser.phone || '';
  }
  renderProfileBookings();
  renderProfileTests();
  renderProfilePayments();
  updateFontButtons();
}

function saveProfile() {
  const name = document.getElementById('profile-name').value.trim();
  const phone = document.getElementById('profile-phone').value.trim();
  if (!validateName(name)) { showToast('Введите корректное имя', 'error'); return; }
  AppState.currentUser = { name, phone, role: 'client' };
  AppState.save('currentUser');
  showToast('Профиль сохранён', 'success');
}

function renderProfileBookings() {
  const container = document.getElementById('profile-bookings');
  const bookings = AppState.bookings;
  if (bookings.length === 0) {
    container.innerHTML = '<p class="text-sm text-muted">Нет записей</p>';
    return;
  }
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  container.innerHTML = bookings.slice(-5).reverse().map(b => {
    const prog = courses.find(p => p.id === b.programId);
    return `<div class="flex justify-between items-center mb-2 p-4" style="background:var(--bg-primary);border-radius:var(--radius-md)">
      <div><div class="text-sm font-medium">${prog ? prog.shortName || prog.name : ''}</div><div class="text-xs text-muted">${formatDateShort(b.date)} ${b.time}</div></div>
      <span class="badge badge-${b.status}">${b.status}</span>
    </div>`;
  }).join('');
}

function renderProfileTests() {
  const container = document.getElementById('profile-tests');
  if (AppState.testResults.length === 0) {
    container.innerHTML = '<p class="text-sm text-muted">Нет результатов тестов</p>';
    return;
  }
  container.innerHTML = AppState.testResults.slice(-3).reverse().map(r =>
    `<div class="mb-2 p-4" style="background:var(--bg-primary);border-radius:var(--radius-md)">
      <div class="flex justify-between"><span class="font-medium">${r.level}</span><span class="text-amber font-bold">${r.score} баллов</span></div>
      <div class="text-xs text-muted">${formatDate(r.date)}</div>
    </div>`
  ).join('');
}

function renderProfilePayments() {
  const container = document.getElementById('profile-payments');
  if (AppState.payments.length === 0) {
    container.innerHTML = '<p class="text-sm text-muted">Нет оплат</p>';
    return;
  }
  container.innerHTML = AppState.payments.slice(-5).reverse().map(p =>
    `<div class="flex justify-between items-center mb-2 p-4" style="background:var(--bg-primary);border-radius:var(--radius-md)">
      <div><div class="text-sm">${formatPrice(p.amount)}</div><div class="text-xs text-muted">${formatDateTime(p.date)}</div></div>
      <span class="badge badge-${p.status === 'success' ? 'confirmed' : 'cancelled'}">${p.status === 'success' ? '✅' : '❌'}</span>
    </div>`
  ).join('');
}

function updateFontButtons() {
  [1, 1.2, 1.4].forEach(s => {
    const btn = document.getElementById('font-' + s);
    if (btn) {
      btn.className = `btn btn-sm ${AppState.settings.fontSize === s ? 'btn-primary' : 'btn-secondary'}`;
    }
  });
}

// ===== MODALS =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openMoreMenu() { document.getElementById('more-menu').classList.add('active'); }
function closeMoreMenu() { document.getElementById('more-menu').classList.remove('active'); }

// Close modals on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
    e.target.classList.remove('active');
  }
});

// ===== HASH ROUTER =====
function handleHash() {
  const hash = window.location.hash.slice(1) || 'home';
  navigateTo(hash);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  handleHash();
  updateNotifBadge();
  // State change listener for cross-tab updates
  window.addEventListener('krinzh-state-change', (e) => {
    if (e.detail.fromOtherTab) {
      if (currentScreen === 'calendar') renderClientCalendar();
      if (currentScreen === 'notifications') renderNotifications();
      updateNotifBadge();
    }
  });
});

window.addEventListener('hashchange', handleHash);
