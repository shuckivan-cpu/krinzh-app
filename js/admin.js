/* ============================================
   Кринж & Co — Admin / Specialist Application JS
   ============================================ */

// ===== ADMIN ROUTING & NAVIGATION =====
let currentAdminScreen = 'dashboard';
let currentCalView = 'month';
let selectedCalDate = new Date().toISOString().split('T')[0];
let adminCalMonth = new Date().getMonth();
let adminCalYear = new Date().getFullYear();
let currentStatsPeriod = 'week';
let selectedChatThread = 'support';

function adminNav(screen) {
  document.querySelectorAll('.admin-main .screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('admin-' + screen);
  if (el) {
    el.classList.add('active');
    currentAdminScreen = screen;
    window.scrollTo(0, 0);

    // Update sidebar
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`.sidebar-nav .nav-link[data-nav="${screen}"]`);
    if (link) link.classList.add('active');

    // Update mobile bottom nav
    document.querySelectorAll('.admin-bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    const bottomMatch = document.querySelector(`.admin-bottom-nav .nav-item[data-nav="${screen}"]`);
    if (bottomMatch) bottomMatch.classList.add('active');

    // Close mobile sidebar if open
    closeSidebar();

    // Init screen data
    initAdminScreen(screen);
  }
  window.location.hash = screen;
}

function initAdminScreen(screen) {
  switch (screen) {
    case 'dashboard': renderDashboard(); break;
    case 'calendar': renderAdminCalendar(); break;
    case 'clients': renderClients(); break;
    case 'bookings': initBookingsFilters(); renderBookings(); break;
    case 'payments': renderPayments(); break;
    case 'courses': renderCourses(); break;
    case 'notifications': renderAdminNotifications(); break;
    case 'streams': renderAdminStreams(); break;
    case 'admin-chat': renderAdminChat(); break;
    case 'statistics': renderStatistics(); break;
    case 'settings': renderSettings(); break;
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  if (overlay) {
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
}

// ===== DASHBOARD =====
function renderDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];

  // Stats
  const todayBookings = AppState.bookings.filter(b => b.date === todayStr && b.status !== 'cancelled').length;
  const weekPayments = AppState.payments
    .filter(p => p.date >= weekAgo && p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  // Clients
  const uniquePhones = new Set(AppState.bookings.filter(b => b.createdAt >= monthAgo).map(b => b.userPhone));
  const totalRevenue = AppState.payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const statsContainer = document.getElementById('dash-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-number">${todayBookings}</div>
        <div class="stat-label">Записей сегодня</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-number">${formatPrice(weekPayments)}</div>
        <div class="stat-label">Оплаты за 7 дней</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-number">${uniquePhones.size}</div>
        <div class="stat-label">Новых клиентов (мес)</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-number">${formatPrice(totalRevenue)}</div>
        <div class="stat-label">Общая выручка</div>
      </div>
    `;
  }

  // Today schedule
  const todayScheduleEl = document.getElementById('dash-today');
  if (todayScheduleEl) {
    const todayList = AppState.bookings
      .filter(b => b.date === todayStr && b.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time));

    if (todayList.length === 0) {
      todayScheduleEl.innerHTML = '<p class="text-sm text-muted">На сегодня записей нет</p>';
    } else {
      const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
      todayScheduleEl.innerHTML = `
        <div class="timeline">
          ${todayList.map(b => {
            const prog = courses.find(p => p.id === b.programId);
            const spec = KrinzhData.specialists.find(s => s.id === b.specialistId);
            return `
              <div class="timeline-item">
                <div class="time-label">${b.time}</div>
                <div class="time-content">
                  <strong>${b.userName || 'Клиент'}</strong> (${formatPhone(b.userPhone || '')})<br>
                  <span class="text-xs text-muted">${prog ? prog.name : ''} • ${spec ? spec.name.split(' ')[0] : ''}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // Recent bookings
  const recentEl = document.getElementById('dash-recent');
  if (recentEl) {
    const recent = [...AppState.bookings].slice(-5).reverse();
    if (recent.length === 0) {
      recentEl.innerHTML = '<p class="text-sm text-muted">Записей пока нет</p>';
    } else {
      const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
      recentEl.innerHTML = recent.map(b => {
        const prog = courses.find(p => p.id === b.programId);
        return `
          <div class="flex justify-between items-center mb-3 p-3" style="background:var(--bg-primary);border-radius:var(--radius-md)">
            <div>
              <div class="font-medium text-sm">${b.userName || 'Клиент'}</div>
              <div class="text-xs text-muted">${prog ? prog.shortName || prog.name : ''} • ${formatDateShort(b.date)} ${b.time}</div>
            </div>
            <span class="badge badge-${b.status}">${b.status}</span>
          </div>
        `;
      }).join('');
    }
  }

  updateAdminBadge();
}

function updateAdminBadge() {
  const badge = document.getElementById('admin-notif-badge');
  const count = AppState.notifications.filter(n => !n.read).length;
  if (badge) {
    badge.style.display = count > 0 ? 'flex' : 'none';
    badge.textContent = count > 9 ? '9+' : count;
  }
}

// ===== CALENDAR (Specialist View) =====
function setCalView(view) {
  currentCalView = view;
  ['month', 'week', 'day'].forEach(v => {
    const btn = document.getElementById('cal-view-' + v);
    if (btn) btn.className = `btn btn-sm ${v === view ? 'btn-primary' : 'btn-secondary'}`;
  });
  renderAdminCalendar();
}

function renderAdminCalendar() {
  // Populate specialists filter if empty
  const filterSelect = document.getElementById('cal-specialist-filter');
  if (filterSelect && filterSelect.options.length <= 1) {
    KrinzhData.specialists.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      filterSelect.appendChild(opt);
    });
  }

  const specFilter = filterSelect ? filterSelect.value : '';
  const container = document.getElementById('admin-cal-grid');
  if (!container) return;

  if (currentCalView === 'month') {
    renderAdminCalMonth(container, specFilter);
  } else if (currentCalView === 'week') {
    renderAdminCalWeek(container, specFilter);
  } else {
    renderAdminCalDay(container, specFilter);
  }
}

function renderAdminCalMonth(container, specFilter) {
  const days = generateCalendarDays(adminCalYear, adminCalMonth);
  const today = new Date().toISOString().split('T')[0];

  // Map bookings to dates
  const bookings = AppState.bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    if (specFilter && b.specialistId !== specFilter) return false;
    return true;
  });

  const blocked = AppState.blockedSlots.filter(b => {
    if (specFilter && b.specialistId !== specFilter) return false;
    return true;
  });

  const bookingMap = {};
  bookings.forEach(b => {
    if (!bookingMap[b.date]) bookingMap[b.date] = [];
    bookingMap[b.date].push(b);
  });

  container.innerHTML = `
    <div class="calendar-header">
      <button class="cal-nav-btn" onclick="adminCalMonth--;if(adminCalMonth<0){adminCalMonth=11;adminCalYear--;}renderAdminCalendar()">‹</button>
      <span class="month-title">${MONTH_NAMES[adminCalMonth]} ${adminCalYear}</span>
      <button class="cal-nav-btn" onclick="adminCalMonth++;if(adminCalMonth>11){adminCalMonth=0;adminCalYear++;}renderAdminCalendar()">›</button>
    </div>
    <div class="calendar-grid">
      ${DAY_NAMES.map(d => `<div class="day-label">${d}</div>`).join('')}
      ${days.map(d => {
        const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
        const isToday = dateStr === today;
        const isSelected = dateStr === selectedCalDate;
        const bList = bookingMap[dateStr] || [];
        const hasBlocked = blocked.some(b => b.date === dateStr);

        return `
          <div class="day-cell ${d.otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
               onclick="selectAdminCalDate('${dateStr}')">
            <span>${d.day}</span>
            <div class="flex gap-1 justify-center mt-1">
              ${bList.slice(0, 3).map(b => `<span class="status-dot ${b.status}"></span>`).join('')}
              ${hasBlocked ? '<span style="font-size:0.6rem">🔒</span>' : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  renderAdminDayDetail(selectedCalDate, specFilter);
}

function renderAdminCalWeek(container, specFilter) {
  const current = new Date(selectedCalDate);
  const first = current.getDate() - ((current.getDay() + 6) % 7);
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const next = new Date(current.getFullYear(), current.getMonth(), first + i);
    weekDays.push(next.toISOString().split('T')[0]);
  }

  container.innerHTML = `
    <div class="calendar-header">
      <button class="cal-nav-btn" onclick="changeAdminWeek(-7)">‹</button>
      <span class="month-title">Неделя: ${formatDateShort(weekDays[0])} – ${formatDateShort(weekDays[6])}</span>
      <button class="cal-nav-btn" onclick="changeAdminWeek(7)">›</button>
    </div>
    <div class="grid grid-4" style="gap:var(--space-2)">
      ${weekDays.map(dateStr => {
        const d = new Date(dateStr);
        const dayBookings = AppState.bookings.filter(b => b.date === dateStr && b.status !== 'cancelled' && (!specFilter || b.specialistId === specFilter));
        return `
          <div class="card p-3" style="cursor:pointer;border-color:${dateStr === selectedCalDate ? 'var(--amber)' : 'var(--border)'}" onclick="selectAdminCalDate('${dateStr}')">
            <div class="font-bold text-sm mb-1">${DAY_NAMES_FULL[(d.getDay() + 6) % 7]}, ${d.getDate()}</div>
            <div class="text-xs text-muted mb-2">${dayBookings.length} записей</div>
            ${dayBookings.map(b => `<div class="badge badge-${b.status} mb-1 w-full text-xs">${b.time} ${b.userName || 'Клиент'}</div>`).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;

  renderAdminDayDetail(selectedCalDate, specFilter);
}

function changeAdminWeek(deltaDays) {
  const d = new Date(selectedCalDate);
  d.setDate(d.getDate() + deltaDays);
  selectedCalDate = d.toISOString().split('T')[0];
  renderAdminCalendar();
}

function renderAdminCalDay(container, specFilter) {
  container.innerHTML = `
    <div class="calendar-header">
      <button class="cal-nav-btn" onclick="changeAdminDay(-1)">‹</button>
      <span class="month-title">${formatDate(selectedCalDate)}</span>
      <button class="cal-nav-btn" onclick="changeAdminDay(1)">›</button>
    </div>
  `;
  renderAdminDayDetail(selectedCalDate, specFilter);
}

function changeAdminDay(deltaDays) {
  const d = new Date(selectedCalDate);
  d.setDate(d.getDate() + deltaDays);
  selectedCalDate = d.toISOString().split('T')[0];
  renderAdminCalendar();
}

function selectAdminCalDate(dateStr) {
  selectedCalDate = dateStr;
  const filterSelect = document.getElementById('cal-specialist-filter');
  const specFilter = filterSelect ? filterSelect.value : '';
  renderAdminCalendar();
}

function renderAdminDayDetail(dateStr, specFilter) {
  const detailEl = document.getElementById('admin-cal-day-detail');
  const titleEl = document.getElementById('admin-cal-day-title');
  const bookingsEl = document.getElementById('admin-cal-day-bookings');
  if (!detailEl || !titleEl || !bookingsEl) return;

  detailEl.style.display = 'block';
  titleEl.textContent = `📋 Расписание на ${formatDate(dateStr)}`;

  const dayBookings = AppState.bookings.filter(b => b.date === dateStr && (!specFilter || b.specialistId === specFilter));
  const blocked = AppState.blockedSlots.filter(b => b.date === dateStr && (!specFilter || b.specialistId === specFilter));
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;

  let html = '';

  // Render hourly schedule from 09:00 to 20:00
  html += '<div style="display:flex;flex-direction:column;gap:var(--space-2)">';
  TIME_SLOTS.forEach(time => {
    const booking = dayBookings.find(b => b.time === time);
    const isBlocked = blocked.some(b => b.time === time);

    if (booking) {
      const prog = courses.find(p => p.id === booking.programId);
      const spec = KrinzhData.specialists.find(s => s.id === booking.specialistId);
      html += `
        <div class="card p-3 flex justify-between items-center" style="border-left:4px solid var(--amber)">
          <div>
            <span class="font-bold text-amber mr-2">${time}</span>
            <strong>${booking.userName || 'Клиент'}</strong> (${formatPhone(booking.userPhone || '')})
            <div class="text-xs text-muted">${prog ? prog.name : ''} • Специалист: ${spec ? spec.name : ''}</div>
          </div>
          <div class="flex gap-2 items-center">
            <span class="badge badge-${booking.status}">${booking.status}</span>
            ${booking.status !== 'cancelled' ? `<button class="btn btn-sm btn-danger" onclick="adminCancelBooking('${booking.id}')">Отменить</button>` : ''}
          </div>
        </div>
      `;
    } else if (isBlocked) {
      html += `
        <div class="card p-3 flex justify-between items-center" style="opacity:0.6;background:var(--bg-tertiary)">
          <div>
            <span class="font-bold mr-2">${time}</span>
            <span>🔒 Заблокировано специалистом</span>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="unblockTimeSlot('${dateStr}', '${time}', '${specFilter}')">Разблокировать</button>
        </div>
      `;
    } else {
      html += `
        <div class="flex justify-between items-center p-2" style="border-bottom:1px solid var(--border)">
          <span class="text-sm text-muted">${time}</span>
          <span class="text-xs text-green">Свободно</span>
          <button class="btn btn-xs btn-secondary" onclick="blockSpecificSlot('${dateStr}', '${time}')">Заблокировать</button>
        </div>
      `;
    }
  });
  html += '</div>';

  bookingsEl.innerHTML = html;
}

function blockSpecificSlot(dateStr, time) {
  const filterSelect = document.getElementById('cal-specialist-filter');
  const specId = (filterSelect && filterSelect.value) ? filterSelect.value : 'spec1';
  AppState.blockedSlots.push({ date: dateStr, time, specialistId: specId });
  AppState.save('blockedSlots');
  showToast(`Слот ${time} заблокирован`, 'info');
  renderAdminCalendar();
}

function unblockTimeSlot(dateStr, time, specFilter) {
  AppState.blockedSlots = AppState.blockedSlots.filter(b => !(b.date === dateStr && b.time === time));
  AppState.save('blockedSlots');
  showToast(`Слот ${time} разблокирован`, 'success');
  renderAdminCalendar();
}

function blockTimeSlotPrompt() {
  const time = prompt('Введите время для блокировки (например, 14:00):', '12:00');
  if (time && TIME_SLOTS.includes(time)) {
    blockSpecificSlot(selectedCalDate, time);
  } else if (time) {
    alert('Неверное время. Доступные часы: ' + TIME_SLOTS.join(', '));
  }
}

// ===== CLIENTS MANAGEMENT =====
function renderClients() {
  const search = (document.getElementById('client-search') ? document.getElementById('client-search').value : '').toLowerCase().trim();
  const table = document.getElementById('clients-table');
  if (!table) return;

  // Aggregate clients from bookings
  const clientMap = {};
  AppState.bookings.forEach(b => {
    const key = b.userPhone || 'unknown';
    if (!clientMap[key]) {
      clientMap[key] = {
        name: b.userName || 'Не указано',
        phone: b.userPhone || '',
        bookingsCount: 0,
        paidTotal: 0,
        lastDate: b.date,
        statuses: []
      };
    }
    clientMap[key].bookingsCount++;
    if (b.status === 'paid' || b.paymentStatus === 'paid') {
      const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
      const prog = courses.find(p => p.id === b.programId);
      if (prog) clientMap[key].paidTotal += prog.price;
    }
    clientMap[key].statuses.push(b.status);
  });

  // Include currentUser if not in bookings
  if (AppState.currentUser && AppState.currentUser.phone && !clientMap[AppState.currentUser.phone]) {
    clientMap[AppState.currentUser.phone] = {
      name: AppState.currentUser.name || 'Клиент',
      phone: AppState.currentUser.phone,
      bookingsCount: 0,
      paidTotal: 0,
      lastDate: new Date().toISOString().split('T')[0],
      statuses: []
    };
  }

  let clients = Object.values(clientMap);
  if (search) {
    clients = clients.filter(c => c.name.toLowerCase().includes(search) || c.phone.includes(search));
  }

  if (clients.length === 0) {
    table.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-muted">Клиенты не найдены</td></tr>';
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Имя</th>
        <th>Телефон</th>
        <th>Записей</th>
        <th>Оплачено</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      ${clients.map(c => `
        <tr>
          <td data-label="Имя"><strong>${c.name}</strong></td>
          <td data-label="Телефон"><a href="tel:${c.phone}" class="text-amber">${formatPhone(c.phone)}</a></td>
          <td data-label="Записей">${c.bookingsCount}</td>
          <td data-label="Оплачено">${formatPrice(c.paidTotal)}</td>
          <td data-label="Действия">
            <button class="btn btn-xs btn-secondary" onclick="viewClientHistory('${c.phone}')">История</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function viewClientHistory(phone) {
  const userBookings = AppState.bookings.filter(b => b.userPhone === phone);
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  const historyText = userBookings.map(b => {
    const prog = courses.find(p => p.id === b.programId);
    return `• ${formatDateShort(b.date)} ${b.time} — ${prog ? prog.name : ''} (${b.status})`;
  }).join('\n');

  alert(`История клиента (${formatPhone(phone)}):\n\n${historyText || 'Записей нет'}`);
}

// ===== BOOKINGS MANAGEMENT =====
function initBookingsFilters() {
  const progSelect = document.getElementById('filter-program');
  const specSelect = document.getElementById('filter-specialist');
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;

  if (progSelect && progSelect.options.length <= 1) {
    progSelect.innerHTML = '<option value="">Все программы</option>' +
      courses.map(p => `<option value="${p.id}">${p.shortName || p.name}</option>`).join('');
  }
  if (specSelect && specSelect.options.length <= 1) {
    specSelect.innerHTML = '<option value="">Все специалисты</option>' +
      KrinzhData.specialists.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }
}

function renderBookings() {
  const table = document.getElementById('bookings-table');
  if (!table) return;

  const statusFilter = document.getElementById('filter-status') ? document.getElementById('filter-status').value : '';
  const progFilter = document.getElementById('filter-program') ? document.getElementById('filter-program').value : '';
  const specFilter = document.getElementById('filter-specialist') ? document.getElementById('filter-specialist').value : '';

  let list = [...AppState.bookings];
  if (statusFilter) list = list.filter(b => b.status === statusFilter);
  if (progFilter) list = list.filter(b => b.programId === progFilter);
  if (specFilter) list = list.filter(b => b.specialistId === specFilter);

  // Sort by date descending
  list.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

  if (list.length === 0) {
    table.innerHTML = '<tr><td colspan="7" class="text-center p-4 text-muted">Записи не найдены</td></tr>';
    return;
  }

  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Дата/Время</th>
        <th>Клиент</th>
        <th>Телефон</th>
        <th>Программа</th>
        <th>Специалист</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      ${list.map(b => {
        const prog = courses.find(p => p.id === b.programId);
        const spec = KrinzhData.specialists.find(s => s.id === b.specialistId);
        return `
          <tr>
            <td data-label="Дата / Время">${formatDateShort(b.date)} <strong>${b.time}</strong></td>
            <td data-label="Клиент">${b.userName || 'Клиент'}</td>
            <td data-label="Телефон"><a href="tel:${b.userPhone || ''}" class="text-amber">${formatPhone(b.userPhone || '')}</a></td>
            <td data-label="Программа">${prog ? prog.shortName || prog.name : ''}</td>
            <td data-label="Специалист">${spec ? spec.name.split(' ').slice(0, 2).join(' ') : '—'}</td>
            <td data-label="Статус"><span class="badge badge-${b.status}">${b.status}</span></td>
            <td data-label="Действия">
              <div class="flex gap-2">
                ${b.status === 'pending' ? `<button class="btn btn-xs btn-success" onclick="adminConfirmBooking('${b.id}')">✓ Принять</button>` : ''}
                ${b.status !== 'cancelled' ? `<button class="btn btn-xs btn-danger" onclick="adminCancelBooking('${b.id}')">✕ Отменить</button>` : ''}
                ${b.status === 'confirmed' || b.status === 'paid' ? `<button class="btn btn-xs btn-primary" onclick="adminCompleteBooking('${b.id}')">Завершить</button>` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;
}

function adminConfirmBooking(id) {
  const b = AppState.bookings.find(item => item.id === id);
  if (b) {
    b.status = 'confirmed';
    AppState.save('bookings');
    showToast('Запись подтверждена', 'success');
    addNotification('✅ Запись подтверждена', `Ваша запись на ${formatDate(b.date)} подтверждена администратором.`, 'info');
    renderBookings();
  }
}

function adminCompleteBooking(id) {
  const b = AppState.bookings.find(item => item.id === id);
  if (b) {
    b.status = 'completed';
    AppState.save('bookings');
    showToast('Сессия отмечена как завершённая', 'success');
    renderBookings();
  }
}

function adminCancelBooking(id) {
  const b = AppState.bookings.find(item => item.id === id);
  if (!b) return;

  openAdminModal(
    'Отмена записи',
    `Вы уверены, что хотите отменить запись клиента ${b.userName || ''} на ${formatDateShort(b.date)}? Если курс оплачен, будет произведён возврат.`,
    () => {
      b.status = 'cancelled';
      if (b.paymentStatus === 'paid') {
        b.paymentStatus = 'refunded';
      }
      AppState.save('bookings');
      showToast('Запись отменена администратором', 'info');
      addNotification('⚠️ Запись отменена', `Запись на ${formatDateShort(b.date)} отменена центром. Если вы вносили оплату, средства возвращены.`, 'warning');
      closeAdminModal();
      renderBookings();
      renderDashboard();
    }
  );
}

function exportBookingsCSV() {
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
  const data = AppState.bookings.map(b => {
    const prog = courses.find(p => p.id === b.programId);
    const spec = KrinzhData.specialists.find(s => s.id === b.specialistId);
    return {
      'ID': b.id,
      'Дата': b.date,
      'Время': b.time,
      'Клиент': b.userName || '',
      'Телефон': b.userPhone || '',
      'Программа': prog ? prog.name : '',
      'Специалист': spec ? spec.name : '',
      'Статус': b.status,
      'Оплата': b.paymentStatus || 'unpaid'
    };
  });
  exportToCSV(data, ['ID', 'Дата', 'Время', 'Клиент', 'Телефон', 'Программа', 'Специалист', 'Статус', 'Оплата'], `krinzh_bookings_${new Date().toISOString().split('T')[0]}.csv`);
}

// ===== PAYMENTS MANAGEMENT =====
function renderPayments() {
  const statsContainer = document.getElementById('payment-stats');
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];

  const succ = AppState.payments.filter(p => p.status === 'success');
  const sumToday = succ.filter(p => p.date >= todayStr).reduce((s, p) => s + p.amount, 0);
  const sumWeek = succ.filter(p => p.date >= weekAgo).reduce((s, p) => s + p.amount, 0);
  const sumMonth = succ.filter(p => p.date >= monthAgo).reduce((s, p) => s + p.amount, 0);
  const sumYear = succ.filter(p => p.date >= yearAgo).reduce((s, p) => s + p.amount, 0);

  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${formatPrice(sumToday)}</div>
        <div class="stat-label">Доход за сегодня</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${formatPrice(sumWeek)}</div>
        <div class="stat-label">Доход за неделю</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${formatPrice(sumMonth)}</div>
        <div class="stat-label">Доход за месяц</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${formatPrice(sumYear)}</div>
        <div class="stat-label">Доход за год</div>
      </div>
    `;
  }

  const table = document.getElementById('payments-table');
  if (!table) return;

  const stFilter = document.getElementById('pay-filter-status') ? document.getElementById('pay-filter-status').value : '';
  const mFilter = document.getElementById('pay-filter-method') ? document.getElementById('pay-filter-method').value : '';

  let list = [...AppState.payments];
  if (stFilter) list = list.filter(p => p.status === stFilter);
  if (mFilter) list = list.filter(p => p.method === mFilter);

  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (list.length === 0) {
    table.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-muted">Оплаты не найдены</td></tr>';
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Чек / ID</th>
        <th>Дата</th>
        <th>Сумма</th>
        <th>Метод</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      ${list.map(p => `
        <tr>
          <td data-label="Чек / ID"><code>${p.receipt || p.id}</code></td>
          <td data-label="Дата">${formatDateTime(p.date)}</td>
          <td data-label="Сумма"><strong>${formatPrice(p.amount)}</strong></td>
          <td data-label="Метод">${p.method === 'card' ? '💳 Карта' : p.method === 'sbp' ? '📱 СБП' : '📊 Рассрочка'}</td>
          <td data-label="Статус"><span class="badge badge-${p.status === 'success' ? 'confirmed' : 'cancelled'}">${p.status}</span></td>
          <td data-label="Действия">
            ${p.status === 'success' ? `<button class="btn btn-xs btn-danger" onclick="refundPayment('${p.id}')">Возврат</button>` : '—'}
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function refundPayment(paymentId) {
  const p = AppState.payments.find(item => item.id === paymentId);
  if (!p) return;
  if (confirm(`Оформить возврат на сумму ${formatPrice(p.amount)}?`)) {
    p.status = 'refunded';
    if (p.bookingId) {
      const b = AppState.bookings.find(item => item.id === p.bookingId);
      if (b) {
        b.paymentStatus = 'refunded';
        b.status = 'cancelled';
      }
    }
    AppState.save('payments');
    AppState.save('bookings');
    showToast('Возврат оформлен', 'success');
    renderPayments();
  }
}

// ===== COURSES MANAGEMENT (CRUD) =====
function renderCourses() {
  const container = document.getElementById('courses-list');
  if (!container) return;
  const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;

  container.innerHTML = courses.map(c => `
    <div class="card mb-4" style="border-left:4px solid var(--amber)">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="mb-1">${c.name}</h3>
          <span class="badge ${c.status === 'inactive' ? 'badge-cancelled' : 'badge-confirmed'}">${c.status === 'inactive' ? 'Неактивен' : 'Активен'}</span>
          <span class="badge badge-pending ml-2">${c.type}</span>
          ${c.badge ? `<span class="badge" style="background:var(--amber-soft);color:var(--amber)">${c.badge}</span>` : ''}
        </div>
        <div class="text-right">
          <div class="text-amber font-bold text-2xl">${formatPrice(c.price)}</div>
          <div class="text-xs text-muted">${c.duration || ''}</div>
        </div>
      </div>
      <p class="text-sm text-secondary mb-3">${c.description}</p>
      ${c.modules && c.modules.length > 0 ? `
        <div class="mb-3">
          <strong class="text-xs text-muted">Модулей: ${c.modules.length}</strong>
        </div>
      ` : ''}
      <div class="flex gap-2">
        <button class="btn btn-sm btn-secondary" onclick="editCourse('${c.id}')">✏️ Редактировать</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCourse('${c.id}')">🗑️ Удалить</button>
      </div>
    </div>
  `).join('');
}

function showCourseForm() {
  document.getElementById('cf-id').value = '';
  document.getElementById('cf-name').value = '';
  document.getElementById('cf-desc').value = '';
  document.getElementById('cf-type').value = 'online';
  document.getElementById('cf-price').value = '';
  document.getElementById('cf-duration').value = '';
  document.getElementById('cf-badge').value = '';
  document.getElementById('cf-installment').checked = true;
  document.getElementById('cf-active').checked = true;
  document.getElementById('cf-modules').innerHTML = '';
  document.getElementById('course-form-title').textContent = 'Новый курс';
  document.getElementById('course-modal').classList.add('active');
}

function closeCourseForm() {
  document.getElementById('course-modal').classList.remove('active');
}

function addModuleField(title = '', desc = '') {
  const container = document.getElementById('cf-modules');
  const num = container.children.length + 1;
  const div = document.createElement('div');
  div.className = 'flex gap-2 mb-2 items-center';
  div.innerHTML = `
    <span class="text-xs text-muted">${num}.</span>
    <input type="text" class="form-input mod-title" placeholder="Название модуля" value="${title}" style="flex:1">
    <button type="button" class="btn btn-xs btn-danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

function editCourse(courseId) {
  const c = AppState.courses.find(item => item.id === courseId);
  if (!c) return;

  document.getElementById('cf-id').value = c.id;
  document.getElementById('cf-name').value = c.name;
  document.getElementById('cf-desc').value = c.description;
  document.getElementById('cf-type').value = c.type;
  document.getElementById('cf-price').value = c.price;
  document.getElementById('cf-duration').value = c.duration || '';
  document.getElementById('cf-badge').value = c.badge || '';
  document.getElementById('cf-installment').checked = !!c.installment;
  document.getElementById('cf-active').checked = c.status !== 'inactive';

  const mContainer = document.getElementById('cf-modules');
  mContainer.innerHTML = '';
  if (c.modules && c.modules.length > 0) {
    c.modules.forEach(m => addModuleField(m.title, m.desc));
  }

  document.getElementById('course-form-title').textContent = 'Редактировать курс';
  document.getElementById('course-modal').classList.add('active');
}

function saveCourse(e) {
  e.preventDefault();
  const id = document.getElementById('cf-id').value || generateId();
  const name = document.getElementById('cf-name').value.trim();
  const desc = document.getElementById('cf-desc').value.trim();
  const type = document.getElementById('cf-type').value;
  const price = parseInt(document.getElementById('cf-price').value, 10);
  const duration = document.getElementById('cf-duration').value.trim();
  const badge = document.getElementById('cf-badge').value.trim();
  const installment = document.getElementById('cf-installment').checked;
  const active = document.getElementById('cf-active').checked;

  const modules = [];
  document.querySelectorAll('#cf-modules .mod-title').forEach((inp, idx) => {
    if (inp.value.trim()) {
      modules.push({ num: idx + 1, title: inp.value.trim(), desc: '' });
    }
  });

  const courseObj = {
    id,
    name,
    shortName: name,
    description: desc,
    type,
    price,
    duration,
    badge,
    installment,
    status: active ? 'active' : 'inactive',
    modules,
    features: [
      `${duration || '3 дня'} интенсивной практики`,
      installment ? 'Доступна рассрочка 0%' : 'Полная оплата',
      'Персональная поддержка сомнолога'
    ]
  };

  const existingIdx = AppState.courses.findIndex(item => item.id === id);
  if (existingIdx >= 0) {
    AppState.courses[existingIdx] = courseObj;
    showToast('Курс обновлён', 'success');
  } else {
    AppState.courses.push(courseObj);
    showToast('Новый курс добавлен в каталог!', 'success');
  }

  AppState.save('courses');
  closeCourseForm();
  renderCourses();
}

function deleteCourse(courseId) {
  if (confirm('Вы уверены, что хотите удалить этот курс?')) {
    AppState.courses = AppState.courses.filter(item => item.id !== courseId);
    AppState.save('courses');
    showToast('Курс удалён', 'info');
    renderCourses();
  }
}

// ===== NOTIFICATIONS MANAGEMENT =====
function renderAdminNotifications() {
  const container = document.getElementById('admin-notif-history');
  if (!container) return;
  const list = [...AppState.notifications].reverse();

  if (list.length === 0) {
    container.innerHTML = '<p class="text-sm text-muted">Уведомлений пока нет</p>';
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="card p-3 mb-2 flex justify-between items-center">
      <div>
        <div class="font-bold text-sm">${n.title}</div>
        <div class="text-xs text-muted">${n.body}</div>
        <div class="text-xs text-muted mt-1">${formatDateTime(n.date)}</div>
      </div>
      <button class="btn btn-xs btn-danger" onclick="deleteNotification('${n.id}')">✕</button>
    </div>
  `).join('');
}

function sendAdminNotification() {
  const title = document.getElementById('notif-title').value.trim();
  const body = document.getElementById('notif-body').value.trim();
  const type = document.getElementById('notif-type').value;

  if (!title || !body) {
    showToast('Заполните заголовок и текст', 'error');
    return;
  }

  addNotification(title, body, type);
  document.getElementById('notif-title').value = '';
  document.getElementById('notif-body').value = '';
  showToast('Уведомление отправлено всем пользователям!', 'success');
  renderAdminNotifications();
}

function deleteNotification(id) {
  AppState.notifications = AppState.notifications.filter(item => item.id !== id);
  AppState.save('notifications');
  renderAdminNotifications();
}

// ===== VK STREAMS MANAGEMENT =====
function renderAdminStreams() {
  const container = document.getElementById('admin-streams-list');
  if (!container) return;

  if (AppState.streams.length === 0) {
    container.innerHTML = '<p class="text-sm text-muted">Трансляции не созданы</p>';
    return;
  }

  container.innerHTML = AppState.streams.map(s => `
    <div class="card p-4 mb-3 flex justify-between items-center">
      <div>
        <div class="font-bold text-base mb-1">${s.title}</div>
        <div class="text-xs text-muted mb-1">${s.description || ''}</div>
        <div class="text-sm text-amber mb-2">${formatDateTime(s.date)}</div>
        <a href="${s.url}" target="_blank" class="text-xs text-blue">🔗 Ссылка на VK: ${s.url}</a>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteStream('${s.id}')">Удалить</button>
    </div>
  `).join('');
}

function addStreamAdmin() {
  const title = document.getElementById('stream-title').value.trim();
  const url = document.getElementById('stream-url').value.trim() || KrinzhData.company.vkLink;
  const desc = document.getElementById('stream-desc').value.trim();
  const dateVal = document.getElementById('stream-date').value;
  const sendPush = document.getElementById('stream-push').checked;
  const addToCal = document.getElementById('stream-cal').checked;

  if (!title || !dateVal) {
    showToast('Укажите название и дату трансляции', 'error');
    return;
  }

  const stream = addStream({
    title,
    url,
    description: desc,
    date: new Date(dateVal).toISOString()
  });

  if (sendPush) {
    const notif = addNotification(
      '📺 Новая трансляция ВКонтакте!',
      `Тема: «${title}». Начало: ${formatDateTime(stream.date)}`,
      'stream'
    );
    notif.streamUrl = url;
    if (addToCal) {
      notif.calendarData = { title, date: stream.date };
    }
    AppState.save('notifications');
  }

  document.getElementById('stream-title').value = '';
  document.getElementById('stream-url').value = '';
  document.getElementById('stream-desc').value = '';
  document.getElementById('stream-date').value = '';

  showToast('Трансляция добавлена!', 'success');
  renderAdminStreams();
}

function deleteStream(id) {
  if (confirm('Удалить эту трансляцию?')) {
    AppState.streams = AppState.streams.filter(item => item.id !== id);
    AppState.save('streams');
    showToast('Трансляция удалена', 'info');
    renderAdminStreams();
  }
}

// ===== CHAT =====
function renderAdminChat() {
  const listEl = document.getElementById('chat-threads-list');
  const headerEl = document.getElementById('admin-chat-header');
  const msgsEl = document.getElementById('admin-chat-messages');
  const inputEl = document.getElementById('admin-chat-input');
  if (!listEl || !msgsEl) return;

  const msgs = AppState.chatMessages[selectedChatThread] || [];
  const unreadCount = msgs.filter(m => m.from === 'user' && !m.read).length;

  listEl.innerHTML = `
    <div class="chat-thread-item active" onclick="selectChatThread('support')">
      <div class="thread-avatar">💬</div>
      <div>
        <div class="thread-name">Клиентская поддержка</div>
        <div class="thread-preview">${msgs.length > 0 ? msgs[msgs.length - 1].text : 'Диалог пуст'}</div>
      </div>
      ${unreadCount > 0 ? `<div class="thread-unread">${unreadCount}</div>` : ''}
    </div>
  `;

  if (headerEl) {
    headerEl.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="online-dot"></span>
        <strong>Чат с пользователем</strong>
      </div>
    `;
  }

  if (inputEl) inputEl.style.display = 'flex';

  msgsEl.innerHTML = msgs.map(m => `
    <div class="chat-message ${m.from === 'support' ? 'outgoing' : 'incoming'}">
      ${m.text.replace(/\n/g, '<br>')}
      <div class="msg-time">${new Date(m.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `).join('');
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

function selectChatThread(threadId) {
  selectedChatThread = threadId;
  // Mark as read
  if (AppState.chatMessages[threadId]) {
    AppState.chatMessages[threadId].forEach(m => { m.read = true; });
    AppState.save('chatMessages');
  }
  renderAdminChat();
}

function sendAdminChat() {
  const input = document.getElementById('admin-chat-text');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  addChatMessage(selectedChatThread, text, 'support');
  input.value = '';
  renderAdminChat();
}

// ===== STATISTICS & ANALYTICS =====
function setStatsPeriod(period, tabEl) {
  currentStatsPeriod = period;
  document.querySelectorAll('#admin-statistics .tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderStatistics();
}

function renderStatistics() {
  const stats = getStatsForPeriod(currentStatsPeriod);
  const cardsContainer = document.getElementById('stats-cards');
  if (cardsContainer) {
    cardsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${stats.totalBookings}</div>
        <div class="stat-label">Всего записей</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.confirmedBookings}</div>
        <div class="stat-label">Подтверждённых</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${formatPrice(stats.totalRevenue)}</div>
        <div class="stat-label">Выручка</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${formatPrice(stats.avgCheck)}</div>
        <div class="stat-label">Средний чек</div>
      </div>
    `;
  }

  // Specialists Chart
  const specEl = document.getElementById('stats-specialists');
  if (specEl) {
    const maxVal = Math.max(...Object.values(stats.bySpecialist), 1);
    specEl.innerHTML = KrinzhData.specialists.map(s => {
      const count = stats.bySpecialist[s.id] || 0;
      const pct = Math.round((count / maxVal) * 100);
      const shortName = s.name.split(' ')[0];
      return `
        <div class="bar" style="height:${Math.max(pct, 4)}%">
          <span class="bar-value">${count}</span>
          <span class="bar-label">${shortName}</span>
        </div>
      `;
    }).join('');
  }

  // Programs Chart
  const progEl = document.getElementById('stats-programs');
  if (progEl) {
    const courses = AppState.courses.length > 0 ? AppState.courses : KrinzhData.programs;
    const maxVal = Math.max(...Object.values(stats.byProgram), 1);
    progEl.innerHTML = courses.map(p => {
      const count = stats.byProgram[p.id] || 0;
      const pct = Math.round((count / maxVal) * 100);
      return `
        <div class="bar" style="height:${Math.max(pct, 4)}%">
          <span class="bar-value">${count}</span>
          <span class="bar-label">${p.shortName || p.name.slice(0, 10)}</span>
        </div>
      `;
    }).join('');
  }

  // Time Heatmap
  const timeEl = document.getElementById('stats-time');
  if (timeEl) {
    timeEl.innerHTML = TIME_SLOTS.map(t => {
      const hour = t.split(':')[0];
      const count = stats.byTime[hour] || 0;
      const lvl = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4;
      return `
        <div class="heatmap-cell level-${lvl}" title="${t}: ${count} записей">
          ${hour}ч
        </div>
      `;
    }).join('');
  }

  // Key Metrics
  const metricsEl = document.getElementById('stats-metrics');
  if (metricsEl) {
    // Determine top specialist
    let topSpec = 'Нет данных';
    let topSpecCount = 0;
    for (const [id, c] of Object.entries(stats.bySpecialist)) {
      if (c > topSpecCount) {
        topSpecCount = c;
        const s = KrinzhData.specialists.find(item => item.id === id);
        if (s) topSpec = `${s.name} (${c})`;
      }
    }

    // Determine top hour
    let topHour = '19:00';
    let topHourCount = 0;
    for (const [h, c] of Object.entries(stats.byTime)) {
      if (c > topHourCount) {
        topHourCount = c;
        topHour = `${h}:00 (${c} записей)`;
      }
    }

    // Conversion test -> booking
    const testCount = AppState.testResults.length;
    const convRate = testCount > 0 ? Math.round((stats.totalBookings / testCount) * 100) : 0;

    metricsEl.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="flex justify-between p-2" style="border-bottom:1px solid var(--border)">
          <span class="text-muted">Самый востребованный специалист:</span>
          <strong>${topSpec}</strong>
        </div>
        <div class="flex justify-between p-2" style="border-bottom:1px solid var(--border)">
          <span class="text-muted">Пиковое время записи:</span>
          <strong>${topHour}</strong>
        </div>
        <div class="flex justify-between p-2" style="border-bottom:1px solid var(--border)">
          <span class="text-muted">Конверсия тестов в записи:</span>
          <strong class="text-green">${convRate}%</strong>
        </div>
        <div class="flex justify-between p-2">
          <span class="text-muted">Процент отмен:</span>
          <strong class="text-red">${stats.totalBookings > 0 ? Math.round((stats.cancelledBookings / stats.totalBookings) * 100) : 0}%</strong>
        </div>
      </div>
    `;
  }
}

// ===== SETTINGS =====
function renderSettings() {
  const specContainer = document.getElementById('settings-specialists');
  if (specContainer) {
    specContainer.innerHTML = KrinzhData.specialists.map(s => `
      <div class="flex justify-between items-center p-2 mb-2" style="background:var(--bg-primary);border-radius:var(--radius-md)">
        <div>
          <div class="font-bold text-sm">${s.name}</div>
          <div class="text-xs text-muted">${s.role} • ${s.education}</div>
        </div>
        <span class="badge badge-confirmed">★ ${s.rating}</span>
      </div>
    `).join('');
  }

  const locContainer = document.getElementById('settings-locations');
  if (locContainer) {
    locContainer.innerHTML = `
      <p class="text-xs text-muted mb-2">12 партнёрских турбаз Волгоградской области:</p>
      <div style="max-height:180px;overflow-y:auto">
        ${KrinzhData.locations.map(l => `
          <div class="p-2 mb-1" style="background:var(--bg-primary);border-radius:var(--radius-sm)">
            <div class="font-medium text-xs">${l.name} (${l.area})</div>
            <div class="text-xs text-muted">${l.distance} • Вместимость: ${l.capacity} чел.</div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ===== ADMIN MODAL UTILITY =====
function openAdminModal(title, text, onConfirm) {
  const modal = document.getElementById('admin-confirm-modal');
  const titleEl = document.getElementById('admin-confirm-title');
  const textEl = document.getElementById('admin-confirm-text');
  const actionBtn = document.getElementById('admin-confirm-action');

  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  if (actionBtn) {
    actionBtn.onclick = onConfirm;
  }
  if (modal) modal.classList.add('active');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-confirm-modal');
  if (modal) modal.classList.remove('active');
}

// ===== HASH CHANGE =====
function handleAdminHash() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  adminNav(hash);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
  handleAdminHash();

  // Listen for storage events for real-time synchronization with client app
  window.addEventListener('krinzh-state-change', (e) => {
    if (currentAdminScreen === 'dashboard') renderDashboard();
    if (currentAdminScreen === 'calendar') renderAdminCalendar();
    if (currentAdminScreen === 'bookings') renderBookings();
    if (currentAdminScreen === 'payments') renderPayments();
    if (currentAdminScreen === 'admin-chat') renderAdminChat();
    if (currentAdminScreen === 'statistics') renderStatistics();
  });

  // Auto-refresh dashboard periodically
  setInterval(() => {
    if (currentAdminScreen === 'dashboard') renderDashboard();
  }, 30000);
});

window.addEventListener('hashchange', handleAdminHash);
