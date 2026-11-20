/* ============================================
   Кринж & Co — Shared Data, State & Utilities
   ============================================ */

// ===== DATA CONSTANTS =====
const KrinzhData = {
  company: {
    name: 'Кринж & Co',
    fullName: 'Центр восстановления здорового сна',
    slogan: 'Восстановите естественный сон за 3 дня — без снотворных и таблеток',
    years: 15,
    city: 'Волгоград',
    phone: '+7 (8442) 50-25-00',
    email: 'info@krinzh-sleep.ru',
    address: 'г. Волгоград, ул. Мира, д. 15, офис 301',
    workingHours: 'Пн–Пт: 9:00–20:00, Сб: 10:00–17:00',
    vkLink: 'https://vk.ru/club241842043',
    vkGroupId: 'club241842043',
    legal: 'Услуги носят информационно-консультационный и образовательно-оздоровительный характер и не являются медицинской помощью.',
    inn: '3444267890',
    ogrn: '1203400051234'
  },

  programs: [
    {
      id: 'online',
      name: 'Онлайн-курс «Здоровый сон»',
      shortName: 'Онлайн-курс',
      type: 'online',
      price: 14000,
      duration: '8 модулей, бессрочный доступ',
      description: 'Пошаговая программа восстановления здорового сна в домашних условиях. 8 видео-модулей с практическими упражнениями, рабочие тетради и поддержка куратора.',
      features: [
        '8 видео-модулей по 40–60 минут',
        'Бессрочный доступ к материалам',
        'Рабочие тетради и чек-листы',
        'Поддержка куратора в чате',
        'Дыхательные практики и медитации',
        'Гарантия результата или возврат'
      ],
      modules: [
        { num: 1, title: 'Физиология сна: циклы, фазы и хронотипы', desc: 'Как устроен сон и почему он нарушается' },
        { num: 2, title: 'Гигиена сна: среда, ритуалы и триггеры', desc: 'Создание идеальных условий для засыпания' },
        { num: 3, title: 'Когнитивная перестройка: работа с руминацией', desc: 'Как остановить навязчивые мысли перед сном' },
        { num: 4, title: 'Дыхательные техники и телесная релаксация', desc: 'Метод 4-7-8, прогрессивная мышечная релаксация' },
        { num: 5, title: 'Хронобиология: настройка циркадных ритмов', desc: 'Свет, мелатонин и режим дня' },
        { num: 6, title: 'Питание и движение для качественного сна', desc: 'Что есть и когда тренироваться' },
        { num: 7, title: 'Стресс-менеджмент и эмоциональная разрядка', desc: 'Техники управления тревогой' },
        { num: 8, title: 'Закрепление привычек и профилактика рецидивов', desc: 'Как сохранить здоровый сон на всю жизнь' }
      ],
      installment: true,
      badge: 'Популярный'
    },
    {
      id: 'group',
      name: 'Групповой выездной интенсив',
      shortName: 'Выездной интенсив',
      type: 'group',
      price: 28000,
      duration: '3 дня на турбазе',
      description: 'Погружение в природу Волгоградской области. Групповые занятия с сомнологом, дыхательные практики на свежем воздухе, цифровой детокс.',
      features: [
        '3 дня/2 ночи на турбазе',
        'Группа до 12 человек',
        'Занятия с сертифицированным сомнологом',
        'Дыхательные практики на природе',
        'Цифровой детокс',
        'Питание включено',
        '12 турбаз на выбор'
      ],
      modules: [],
      installment: true,
      badge: 'На природе',
      requiresLocation: true
    },
    {
      id: 'vip',
      name: 'Индивидуальный VIP-интенсив',
      shortName: 'VIP-интенсив',
      type: 'vip',
      price: 48000,
      duration: '3 дня индивидуально',
      description: 'Персональная программа со специалистом с медицинским образованием. Индивидуальный план, ежедневные сессии, поддержка 24/7.',
      features: [
        '3 дня индивидуальной работы',
        'Специалист с медобразованием',
        'Персональный план восстановления',
        'Ежедневные 2-часовые сессии',
        'Поддержка 24/7 во время программы',
        'Контрольная сессия через 2 недели',
        'Возможность на турбазе или онлайн'
      ],
      modules: [],
      installment: true,
      badge: 'Премиум',
      requiresLocation: true
    }
  ],

  locations: [
    { id: 'loc1', name: 'Турбаза «Волжские зори»', area: 'Среднеахтубинский район', desc: 'На берегу Волги, сосновый бор, тишина и чистый воздух. Идеально для полного отключения.', amenities: ['Wi-Fi', 'Баня', 'Пляж', 'Питание'], distance: '45 км от города', capacity: 20, rating: 4.8 },
    { id: 'loc2', name: 'База отдыха «Дон-батюшка»', area: 'Калачёвский район', desc: 'Живописные донские берега, уютные домики, рыбалка и природные тропы.', amenities: ['Баня', 'Рыбалка', 'Мангал', 'Питание'], distance: '80 км от города', capacity: 15, rating: 4.6 },
    { id: 'loc3', name: 'Эко-отель «Лотос»', area: 'Волго-Ахтубинская пойма', desc: 'Экологически чистая зона в пойме. Деревянные эко-дома, органическое питание.', amenities: ['Эко-дома', 'Йога-зал', 'Органическое питание', 'SPA'], distance: '50 км от города', capacity: 12, rating: 4.9 },
    { id: 'loc4', name: 'Турбаза «Сарпинские озёра»', area: 'Светлоярский район', desc: 'Степные озёра с целебной водой, потрясающие закаты и абсолютная тишина.', amenities: ['Озеро', 'Баня', 'Беседки', 'Питание'], distance: '35 км от города', capacity: 18, rating: 4.5 },
    { id: 'loc5', name: 'Комплекс «Эльтон-Вита»', area: 'Эльтонский район', desc: 'Рядом с солёным озером Эльтон. Грязелечение, минеральные источники, степной воздух.', amenities: ['Грязелечение', 'Минеральная вода', 'Питание', 'Трансфер'], distance: '330 км от города', capacity: 10, rating: 4.7 },
    { id: 'loc6', name: 'Турбаза «Медведица»', area: 'Жирновский район', desc: 'Лесная территория на реке Медведица. Хвойный воздух, пешие маршруты.', amenities: ['Лес', 'Река', 'Баня', 'Мангал', 'Питание'], distance: '250 км от города', capacity: 14, rating: 4.4 },
    { id: 'loc7', name: 'Пансионат «Тихая заводь»', area: 'Дубовский район', desc: 'Пансионат на Волгоградском водохранилище. Комфортные номера, медицинское сопровождение.', amenities: ['Бассейн', 'Мед. кабинет', 'Питание', 'Парковка'], distance: '70 км от города', capacity: 25, rating: 4.3 },
    { id: 'loc8', name: 'Глэмпинг «Звёздное небо»', area: 'Иловлинский район', desc: 'Роскошные шатры с прозрачной крышей для наблюдения за звёздами. Новый формат отдыха.', amenities: ['Глэмпинг', 'Костёр', 'Телескоп', 'Завтрак'], distance: '100 км от города', capacity: 8, rating: 4.9 },
    { id: 'loc9', name: 'Казачья усадьба «Станица»', area: 'Клетский район', desc: 'Традиционная казачья усадьба у природного парка «Донской». Погружение в историю и природу.', amenities: ['Конные прогулки', 'Баня', 'Казачья кухня', 'Экскурсии'], distance: '200 км от города', capacity: 12, rating: 4.6 },
    { id: 'loc10', name: 'База «Хопёрский берег»', area: 'Урюпинский район', desc: 'На берегу чистейшей реки Хопёр. Идеально для медитативных практик и единения с природой.', amenities: ['Река', 'Лес', 'Баня', 'Питание', 'Каноэ'], distance: '300 км от города', capacity: 10, rating: 4.7 },
    { id: 'loc11', name: 'Санаторий «Волгоградский»', area: 'Городищенский район', desc: 'Санаторий с лечебной базой. Комфортное размещение, диетическое питание, врачебный контроль.', amenities: ['Мед. база', 'Бассейн', 'Лечебное питание', 'Физиотерапия'], distance: '25 км от города', capacity: 30, rating: 4.2 },
    { id: 'loc12', name: 'Дом отдыха «Ахтуба-парк»', area: 'Ленинский район', desc: 'Современный комплекс в пойме реки Ахтуба. Игровые площадки, детские программы, семейный отдых.', amenities: ['Детская площадка', 'Бассейн', 'Питание', 'Анимация'], distance: '55 км от города', capacity: 22, rating: 4.5 }
  ],

  specialists: [
    { id: 'spec1', name: 'Елена Владимировна Соколова', role: 'Сомнолог, клинический психолог', education: 'ВолгГМУ, специализация «Клиническая психология»', experience: '12 лет', specialization: 'Когнитивно-поведенческая терапия инсомнии (КПТ-И)', rating: 4.9, reviews: 156, avatar: '👩‍⚕️', bio: 'Ведущий специалист центра. Автор методики восстановления сна за 3 дня.' },
    { id: 'spec2', name: 'Андрей Петрович Морозов', role: 'Невролог, специалист по сну', education: 'Первый МГМУ им. Сеченова, ординатура по неврологии', experience: '15 лет', specialization: 'Неврология сна, полисомнография', rating: 4.8, reviews: 128, avatar: '👨‍⚕️', bio: 'Кандидат медицинских наук, автор 23 научных публикаций о расстройствах сна.' },
    { id: 'spec3', name: 'Ольга Сергеевна Лунёва', role: 'Психотерапевт, дыхательный терапевт', education: 'СПбГУ, факультет психологии', experience: '8 лет', specialization: 'Дыхательные практики, майндфулнесс, релаксация', rating: 4.7, reviews: 94, avatar: '🧘‍♀️', bio: 'Сертифицированный инструктор по дыхательной терапии и медитации.' },
    { id: 'spec4', name: 'Игорь Николаевич Звездин', role: 'Физиотерапевт, реабилитолог', education: 'ВолгГМУ, специализация «Физиотерапия»', experience: '10 лет', specialization: 'Физическая реабилитация, природные факторы', rating: 4.6, reviews: 72, avatar: '👨‍💼', bio: 'Специалист по восстановлению через природные факторы и физические практики.' },
    { id: 'spec5', name: 'Марина Александровна Тихонова', role: 'Нутрициолог, специалист по ЗОЖ', education: 'РАНХиГС, программа «Нутрициология»', experience: '6 лет', specialization: 'Питание для сна, биохакинг, циркадные ритмы', rating: 4.8, reviews: 88, avatar: '👩‍🔬', bio: 'Эксперт по связи питания и качества сна. Автор курса «Еда для сна».' }
  ],

  testQuestions: [
    {
      id: 1,
      question: 'Как быстро вы обычно засыпаете?',
      options: [
        { text: 'За 10–15 минут', score: 1 },
        { text: 'За 20–30 минут', score: 2 },
        { text: 'За 30–60 минут', score: 3 },
        { text: 'Больше часа или не могу заснуть', score: 4 }
      ]
    },
    {
      id: 2,
      question: 'Как часто вы просыпаетесь среди ночи?',
      options: [
        { text: 'Крайне редко или никогда', score: 1 },
        { text: '1–2 раза, быстро засыпаю обратно', score: 2 },
        { text: '2–3 раза, сложно заснуть обратно', score: 3 },
        { text: 'Более 3 раз, сон поверхностный', score: 4 }
      ]
    },
    {
      id: 3,
      question: 'Как вы чувствуете себя утром после сна?',
      options: [
        { text: 'Отдохнувшим и бодрым', score: 1 },
        { text: 'Немного усталым, но работоспособным', score: 2 },
        { text: 'Разбитым, нужно время прийти в себя', score: 3 },
        { text: 'Совершенно измотанным, как не спал', score: 4 }
      ]
    },
    {
      id: 4,
      question: 'Испытываете ли вы дневную сонливость?',
      options: [
        { text: 'Нет, бодр весь день', score: 1 },
        { text: 'Иногда после обеда', score: 2 },
        { text: 'Часто, трудно сконцентрироваться', score: 3 },
        { text: 'Постоянно, засыпаю на ходу', score: 4 }
      ]
    },
    {
      id: 5,
      question: 'Используете ли вы экран (телефон/ТВ) перед сном?',
      options: [
        { text: 'Откладываю за 1+ час до сна', score: 1 },
        { text: 'Иногда, за 30 минут до сна', score: 2 },
        { text: 'Часто, до самого засыпания', score: 3 },
        { text: 'Всегда, засыпаю с телефоном в руках', score: 4 }
      ]
    }
  ],

  diaryItems: [
    { id: 'screen', label: 'Отказ от экрана за 1 час до сна', icon: '📵' },
    { id: 'ventilate', label: 'Проветривание спальни', icon: '🪟' },
    { id: 'schedule', label: 'Соблюдение режима подъёма', icon: '⏰' },
    { id: 'stretch', label: 'Лёгкая растяжка или медитация', icon: '🧘' },
    { id: 'caffeine', label: 'Отказ от кофеина после 14:00', icon: '☕' },
    { id: 'bath', label: 'Тёплый душ или ванна', icon: '🚿' },
    { id: 'breathing', label: 'Дыхательная гимнастика 4-7-8', icon: '🌬️' }
  ],

  reviews: [
    { id: 1, name: 'Наталья К.', age: 52, rating: 5, text: 'После 10 лет бессонницы я наконец-то сплю! Три дня на турбазе «Волжские зори» изменили мою жизнь. Елена Владимировна — волшебница.', date: '2026-10-15', avatar: '👩' },
    { id: 2, name: 'Сергей М.', age: 45, rating: 5, text: 'Скептически относился к программе, но после VIP-интенсива засыпаю за 10 минут. Метод 4-7-8 реально работает. Рекомендую!', date: '2026-09-22', avatar: '👨' },
    { id: 3, name: 'Людмила Петровна', age: 63, rating: 5, text: 'В моём возрасте проблемы со сном казались неизбежными. Онлайн-курс помог за 2 недели. Крупный шрифт и понятные объяснения — огромный плюс.', date: '2026-11-01', avatar: '👵' },
    { id: 4, name: 'Алексей Д.', age: 34, rating: 4, text: 'Как программист, я годами жил в режиме «ещё 5 минут». Курс помог перестроить привычки. Дневник сна — гениальная штука.', date: '2026-08-18', avatar: '👨‍💻' },
    { id: 5, name: 'Елена В.', age: 48, rating: 5, text: 'Глэмпинг «Звёздное небо» + программа восстановления = лучший отпуск в жизни. Засыпала под звёздами за 5 минут. Невероятно!', date: '2026-10-30', avatar: '👩‍🦰' },
    { id: 6, name: 'Владимир Иванович', age: 67, rating: 5, text: 'Врачи выписывали снотворные, а здесь научили засыпать без таблеток. Дыхательные практики теперь делаю каждый вечер. Спасибо!', date: '2026-11-10', avatar: '👴' }
  ],

  streams: [
    {
      id: 'stream_1',
      title: 'Прямой эфир: Как победить прокрастинацию сна',
      description: 'Разбираем психологические триггеры вечернего залипания в экран и 3 шага к легкому засыпанию с сомнологом Еленой Соколовой.',
      url: 'https://vk.ru/club241842043',
      date: '2026-11-25T19:00:00'
    },
    {
      id: 'stream_2',
      title: 'Практикум: Дыхание 4-7-8 и вечерний детокс',
      description: 'Совместное выполнение дыхательной гимнастики и подготовка нервной системы ко сну в прямом эфире.',
      url: 'https://vk.ru/club241842043',
      date: '2026-11-28T20:30:00'
    }
  ],

  vkProducts: [
    { id: 'vkp1', name: 'Подушка ортопедическая «Сладкий сон»', price: 3500, desc: 'Анатомическая подушка с эффектом памяти' },
    { id: 'vkp2', name: 'Маска для сна премиум', price: 1200, desc: 'Шёлковая маска с наполнителем из лаванды' },
    { id: 'vkp3', name: 'Аромадиффузор «Ночь»', price: 2800, desc: 'С набором эфирных масел для сна' },
    { id: 'vkp4', name: 'Утяжелённое одеяло 7 кг', price: 5900, desc: 'Снижает тревожность, улучшает засыпание' },
    { id: 'vkp5', name: 'Набор «Вечерний ритуал»', price: 2200, desc: 'Травяной чай, аромасвеча, маска для сна' },
    { id: 'vkp6', name: 'Книга «Наука сна»', price: 890, desc: 'Научно-популярное руководство по здоровому сну' }
  ]
};

// ===== APP STATE MANAGEMENT =====
const AppState = {
  _prefix: 'krinzh_',
  
  _defaults: {
    currentUser: null,
    bookings: [],
    diary: {},
    testResults: [],
    notifications: [
      { id: 'n1', type: 'info', title: 'Добро пожаловать!', body: 'Пройдите экспресс-тест и узнайте уровень истощения нервной системы.', read: false, date: new Date().toISOString() },
      { id: 'n2', type: 'promo', title: 'Скидка 15% на первый курс', body: 'Используйте промокод SLEEP15 при оплате.', read: false, date: new Date().toISOString() }
    ],
    reviews: [],
    chatMessages: {},
    payments: [],
    courses: [],
    streams: [
    {
      id: 'stream_1',
      title: 'Прямой эфир: Как победить прокрастинацию сна',
      description: 'Разбираем психологические триггеры вечернего залипания в экран и 3 шага к легкому засыпанию с сомнологом Еленой Соколовой.',
      url: 'https://vk.ru/club241842043',
      date: '2026-11-25T19:00:00'
    },
    {
      id: 'stream_2',
      title: 'Практикум: Дыхание 4-7-8 и вечерний детокс',
      description: 'Совместное выполнение дыхательной гимнастики и подготовка нервной системы ко сну в прямом эфире.',
      url: 'https://vk.ru/club241842043',
      date: '2026-11-28T20:30:00'
    }
  ],
    adminNotifications: [],
    specialists: [],
    blockedSlots: [],
    statistics: {
      pageVisits: {},
      specialistViews: {},
      programViews: {},
      bookingAttempts: 0,
      bookingCompletions: 0,
      dailyStats: {}
    },
    settings: {
      theme: 'dark',
      fontSize: 1,
      notificationsEnabled: true
    }
  },

  init() {
    // Load from localStorage or use defaults
    for (const [key, defaultVal] of Object.entries(this._defaults)) {
      const stored = localStorage.getItem(this._prefix + key);
      if (stored !== null) {
        try {
          this[key] = JSON.parse(stored);
        } catch {
          this[key] = defaultVal;
        }
      } else {
        this[key] = JSON.parse(JSON.stringify(defaultVal));
      }
    }
    // Seed courses from KrinzhData if empty
    if (this.courses.length === 0) {
      this.courses = JSON.parse(JSON.stringify(KrinzhData.programs));
      this.save('courses');
    }
    // Seed streams from KrinzhData if empty
    if (!this.streams || this.streams.length === 0) {
      this.streams = JSON.parse(JSON.stringify(KrinzhData.streams));
      this.save('streams');
    }
    // Apply saved settings
    this.applySettings();
  },

  save(key) {
    localStorage.setItem(this._prefix + key, JSON.stringify(this[key]));
    // Dispatch event for cross-tab sync
    window.dispatchEvent(new CustomEvent('krinzh-state-change', { detail: { key } }));
  },

  saveAll() {
    for (const key of Object.keys(this._defaults)) {
      this.save(key);
    }
  },

  reset() {
    for (const key of Object.keys(this._defaults)) {
      localStorage.removeItem(this._prefix + key);
    }
    this.init();
  },

  applySettings() {
    document.documentElement.setAttribute('data-theme', this.settings.theme);
    document.documentElement.style.setProperty('--font-scale', this.settings.fontSize);
  }
};

// ===== UTILITY FUNCTIONS =====
function generateId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(timeStr) {
  return timeStr;
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин. назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч. назад`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн. назад`;
  return formatDateShort(dateStr);
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return /^[78]\d{10}$/.test(cleaned);
}

function validateName(name) {
  return name.trim().length >= 2;
}

function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

// ===== TEST SCORING =====
function calculateTestScore(answers) {
  const score = answers.reduce((sum, a) => sum + a, 0);
  let level, description, recommended, color;

  if (score <= 8) {
    level = 'Лёгкое напряжение';
    description = 'Ваша нервная система в относительно хорошем состоянии. Небольшая коррекция привычек поможет улучшить сон.';
    recommended = 'online';
    color = 'green';
  } else if (score <= 13) {
    level = 'Среднее истощение';
    description = 'Нервная система перегружена. Рекомендуем комплексный подход — онлайн-курс или групповой интенсив.';
    recommended = 'online';
    color = 'amber';
  } else if (score <= 17) {
    level = 'Выраженное истощение';
    description = 'Серьёзное истощение нервной системы. Выездной интенсив на природе поможет перезагрузиться.';
    recommended = 'group';
    color = 'amber';
  } else {
    level = 'Сильное истощение';
    description = 'Критический уровень истощения. Необходима индивидуальная работа со специалистом.';
    recommended = 'vip';
    color = 'red';
  }

  return { score, level, description, recommended, color };
}

// ===== BOOKING & CALENDAR UTILITIES =====
function canCancelBooking(booking) {
  if (booking.status === 'cancelled') return false;
  const bookingTime = new Date(booking.date + 'T' + booking.time);
  const now = new Date();
  const diff = bookingTime.getTime() - now.getTime();
  return diff > 24 * 60 * 60 * 1000; // > 24 hours
}

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const days = [];

  // Previous month
  const prevLast = new Date(year, month, 0);
  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ day: prevLast.getDate() - i, month: month - 1, year, otherMonth: true });
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ day: d, month, year, otherMonth: false });
  }

  // Next month
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, month: month + 1, year, otherMonth: true });
  }

  return days;
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

function getAvailableSlots(dateStr, specialistId) {
  const bookings = AppState.bookings.filter(
    b => b.date === dateStr && b.specialistId === specialistId && b.status !== 'cancelled'
  );
  const blocked = AppState.blockedSlots.filter(
    b => b.date === dateStr && b.specialistId === specialistId
  );
  const bookedTimes = bookings.map(b => b.time);
  const blockedTimes = blocked.map(b => b.time);
  const now = new Date();
  const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return TIME_SLOTS.map(slot => {
    const slotDate = new Date(dateStr + 'T' + slot);
    return {
      time: slot,
      available: !bookedTimes.includes(slot) && !blockedTimes.includes(slot) && slotDate > minTime,
      booked: bookedTimes.includes(slot),
      blocked: blockedTimes.includes(slot),
      tooSoon: slotDate <= minTime
    };
  });
}

function isSlotAvailable(dateStr, time, specialistId) {
  const slots = getAvailableSlots(dateStr, specialistId);
  const slot = slots.find(s => s.time === time);
  return slot ? slot.available : false;
}

function bookSlot(bookingData) {
  const booking = {
    id: generateId(),
    ...bookingData,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString()
  };
  AppState.bookings.push(booking);
  AppState.save('bookings');
  trackEvent('booking_created', { programId: bookingData.programId });
  return booking;
}

function cancelBooking(bookingId) {
  const booking = AppState.bookings.find(b => b.id === bookingId);
  if (booking && canCancelBooking(booking)) {
    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
      addNotification('💰 Возврат средств', `Возврат по записи от ${formatDateShort(booking.date)} оформлен.`, 'info');
    }
    AppState.save('bookings');
    return true;
  }
  return false;
}

// ===== PAYMENT SYSTEM (Simulation) =====
function processPayment(amount, method, bookingId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      const payment = {
        id: generateId(),
        bookingId,
        amount,
        method,
        status: success ? 'success' : 'failed',
        date: new Date().toISOString(),
        receipt: success ? 'RCP-' + Date.now().toString().slice(-8) : null
      };
      AppState.payments.push(payment);
      AppState.save('payments');

      if (success && bookingId) {
        const booking = AppState.bookings.find(b => b.id === bookingId);
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          AppState.save('bookings');
        }
        addNotification('✅ Оплата прошла', `Оплата ${formatPrice(amount)} успешно проведена. Чек: ${payment.receipt}`, 'info');
      }

      resolve(payment);
    }, 2500);
  });
}

function calculateInstallment(amount, months) {
  return {
    monthly: Math.ceil(amount / months),
    total: amount,
    months,
    overpayment: 0
  };
}

// ===== NOTIFICATIONS =====
function addNotification(title, body, type = 'info') {
  const notif = {
    id: generateId(),
    type,
    title,
    body,
    read: false,
    date: new Date().toISOString()
  };
  AppState.notifications.push(notif);
  AppState.save('notifications');

  // Browser notification
  if (AppState.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body, icon: 'assets/logo.svg' }); } catch (e) {}
  }

  showToast(title, type);
  return notif;
}

function markNotificationRead(notifId) {
  const notif = AppState.notifications.find(n => n.id === notifId);
  if (notif) {
    notif.read = true;
    AppState.save('notifications');
  }
}

function getUnreadCount() {
  return AppState.notifications.filter(n => !n.read).length;
}

async function requestNotificationPermission() {
  if ('Notification' in window) {
    const result = await Notification.requestPermission();
    AppState.settings.notificationsEnabled = result === 'granted';
    AppState.save('settings');
    return result === 'granted';
  }
  return false;
}

// ===== TOAST SYSTEM =====
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${getToastIcon(type)}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getToastIcon(type) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  return icons[type] || 'ℹ️';
}

// ===== THEME & ACCESSIBILITY =====
function toggleTheme() {
  AppState.settings.theme = AppState.settings.theme === 'dark' ? 'light' : 'dark';
  AppState.save('settings');
  AppState.applySettings();
}

function setFontScale(scale) {
  AppState.settings.fontSize = scale;
  AppState.save('settings');
  AppState.applySettings();
}

function getCurrentTheme() {
  return AppState.settings.theme;
}

// ===== STATISTICS TRACKING =====
function trackEvent(eventName, data = {}) {
  const today = new Date().toISOString().split('T')[0];
  if (!AppState.statistics.dailyStats[today]) {
    AppState.statistics.dailyStats[today] = { visits: 0, bookings: 0, payments: 0, events: [] };
  }
  AppState.statistics.dailyStats[today].events.push({
    event: eventName,
    data,
    time: new Date().toISOString()
  });
  AppState.save('statistics');
}

function trackPageVisit(page) {
  if (!AppState.statistics.pageVisits[page]) {
    AppState.statistics.pageVisits[page] = 0;
  }
  AppState.statistics.pageVisits[page]++;
  trackEvent('page_visit', { page });
}

function trackSpecialistView(specialistId) {
  if (!AppState.statistics.specialistViews[specialistId]) {
    AppState.statistics.specialistViews[specialistId] = 0;
  }
  AppState.statistics.specialistViews[specialistId]++;
  trackEvent('specialist_view', { specialistId });
}

function trackProgramView(programId) {
  if (!AppState.statistics.programViews[programId]) {
    AppState.statistics.programViews[programId] = 0;
  }
  AppState.statistics.programViews[programId]++;
  trackEvent('program_view', { programId });
}

function getStatsForPeriod(period) {
  const now = new Date();
  let startDate;
  if (period === 'week') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  } else {
    startDate = new Date(0);
  }

  const startStr = startDate.toISOString().split('T')[0];
  const bookings = AppState.bookings.filter(b => b.createdAt >= startStr);
  const payments = AppState.payments.filter(p => p.date >= startStr && p.status === 'success');

  const bySpecialist = {};
  const byProgram = {};
  const byTime = {};
  const byDay = {};

  bookings.forEach(b => {
    // By specialist
    if (b.specialistId) {
      bySpecialist[b.specialistId] = (bySpecialist[b.specialistId] || 0) + 1;
    }
    // By program
    if (b.programId) {
      byProgram[b.programId] = (byProgram[b.programId] || 0) + 1;
    }
    // By time
    if (b.time) {
      const hour = b.time.split(':')[0];
      byTime[hour] = (byTime[hour] || 0) + 1;
    }
    // By day
    const day = b.date;
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length,
    bySpecialist,
    byProgram,
    byTime,
    byDay,
    avgCheck: payments.length > 0 ? Math.round(payments.reduce((s, p) => s + p.amount, 0) / payments.length) : 0
  };
}

// ===== CHAT SYSTEM =====
const CHAT_AUTO_RESPONSES = {
  'запис': 'Для записи перейдите в раздел «Программы», выберите подходящую программу и нажмите «Записаться». Наш специалист свяжется с вами для подтверждения.',
  'цен': 'Наши программы:\n• Онлайн-курс — 14 000 ₽\n• Групповой интенсив — 28 000 ₽\n• VIP-интенсив — 48 000 ₽\nВсе программы доступны в рассрочку 0%.',
  'стоимост': 'Наши программы:\n• Онлайн-курс — 14 000 ₽\n• Групповой интенсив — 28 000 ₽\n• VIP-интенсив — 48 000 ₽\nВсе программы доступны в рассрочку 0%.',
  'отмен': 'Отмена записи возможна не позднее чем за 24 часа до начала сессии. Перейдите в раздел «Календарь» → выберите запись → «Отменить».',
  'турбаз': 'У нас 12 партнёрских турбаз в Волгоградской области. Вы можете выбрать подходящую при бронировании группового или VIP-интенсива.',
  'рассрочк': 'Все наши программы доступны в рассрочку 0% на 3, 6 или 12 месяцев. Выберите рассрочку при оплате.',
  'врем': 'Мы работаем Пн–Пт: 9:00–20:00, Сб: 10:00–17:00. Вы можете записаться на любое доступное время через календарь.',
  'адрес': `Наш адрес: ${KrinzhData.company.address}. Тел: ${KrinzhData.company.phone}`,
  'контакт': `Тел: ${KrinzhData.company.phone}\nEmail: ${KrinzhData.company.email}\nVK: ${KrinzhData.company.vkLink}`,
  'привет': 'Здравствуйте! 👋 Чем могу помочь? Задайте вопрос или выберите тему.',
  'здравствуйте': 'Здравствуйте! 👋 Рад вас видеть. Чем могу помочь?',
  'добрый': 'Добрый день! 👋 Как я могу вам помочь?',
  'спасибо': 'Пожалуйста! 😊 Если возникнут ещё вопросы — обращайтесь.',
  'спи': 'Наш центр специализируется на восстановлении здорового сна за 3 дня. Пройдите экспресс-тест, чтобы узнать вашу программу!'
};

function getChatAutoResponse(message) {
  const lowerMsg = message.toLowerCase();
  for (const [key, response] of Object.entries(CHAT_AUTO_RESPONSES)) {
    if (lowerMsg.includes(key)) return response;
  }
  return 'Спасибо за обращение! Специалист поддержки ответит в течение 15 минут. Вы также можете:\n• Пройти экспресс-тест\n• Посмотреть каталог программ\n• Позвонить: ' + KrinzhData.company.phone;
}

function addChatMessage(threadId, text, from, type = 'text') {
  if (!AppState.chatMessages[threadId]) {
    AppState.chatMessages[threadId] = [];
  }
  const msg = {
    id: generateId(),
    text,
    from,
    type,
    time: new Date().toISOString(),
    read: from === 'user'
  };
  AppState.chatMessages[threadId].push(msg);
  AppState.save('chatMessages');
  return msg;
}

// ===== STREAMS & CALENDAR EXPORT =====
function addStream(streamData) {
  const stream = {
    id: generateId(),
    ...streamData,
    createdAt: new Date().toISOString()
  };
  AppState.streams.push(stream);
  AppState.save('streams');
  return stream;
}

function generateICS(title, description, startDate, endDate, url) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Кринж & Co//NONSGML v1.0//RU
BEGIN:VEVENT
UID:${generateId()}@krinzh-sleep.ru
DTSTART:${fmt(startDate)}
DTEND:${fmt(endDate || new Date(new Date(startDate).getTime() + 3600000))}
SUMMARY:${title}
DESCRIPTION:${description}
URL:${url || ''}
END:VEVENT
END:VCALENDAR`;
}

function downloadICS(title, description, startDate, endDate, url) {
  const ics = generateICS(title, description, startDate, endDate, url);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/[^a-zA-Zа-яА-ЯёЁ0-9]/g, '_')}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ===== DATA EXPORT (Admin) =====
function exportToCSV(data, headers, filename) {
  const csvContent = [
    headers.join(';'),
    ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(';'))
  ].join('\n');
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ===== MONTH NAMES =====
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAY_NAMES_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

// ===== FEEDBACK =====
function submitFeedback(feedbackData) {
  const feedback = {
    id: generateId(),
    ...feedbackData,
    date: new Date().toISOString()
  };
  AppState.reviews.push(feedback);
  AppState.save('reviews');
  addNotification('📝 Спасибо за отзыв!', 'Ваш отзыв успешно отправлен.', 'success');
  return feedback;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
});

// Listen for localStorage changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith('krinzh_')) {
    const stateKey = e.key.replace('krinzh_', '');
    try {
      AppState[stateKey] = JSON.parse(e.newValue);
    } catch {}
    window.dispatchEvent(new CustomEvent('krinzh-state-change', { detail: { key: stateKey, fromOtherTab: true } }));
  }
});
