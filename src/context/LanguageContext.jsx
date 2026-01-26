import { createContext, useContext, useState } from 'react';

const translations = {
  ru: {
    // Header
    balance: 'Баланс',
    
    // Navigation
    nav: {
      home: 'Главная',
      fitting: 'Примерочная',
      vip: 'VIP',
      marketplace: 'Маркет',
      profile: 'Профиль'
    },
    
    // Home page
    home: {
      welcome: 'Добро пожаловать в',
      subtitle: 'Примеряй одежду онлайн с помощью AI',
      selectMode: 'Выберите режим',
      fitting: 'Примерочная',
      fittingDesc: 'Примерь одежду из каталога',
      vipFitting: 'VIP Примерочная',
      vipDesc: 'Выбери одежду из топ-магазинов',
      wbOzon: 'WB / Ozon',
      wbOzonDesc: 'Примерь товар по ссылке',
      exclusive: 'Эксклюзив',
      exclusiveDesc: 'Загрузи свою одежду + промт AI',
      firstFree: 'Первая примерка бесплатно!',
      usePromo: 'Используй промокод:',
      users: 'Пользователей',
      tryOns: 'Примерок',
      satisfied: 'Довольны'
    },
    
    // Fitting page
    fitting: {
      title: 'Примерочная',
      subtitle: 'Загрузите фото и выберите одежду',
      uploadPhoto: 'Загрузить фото',
      categories: {
        all: 'Все',
        tops: 'Верх',
        bottoms: 'Низ',
        dresses: 'Платья',
        outerwear: 'Верхняя',
        shoes: 'Обувь'
      },
      tryOn: 'Примерить',
      processing: 'Обработка...',
      result: 'Результат примерки',
      close: 'Закрыть'
    },
    
    // VIP Fitting
    vip: {
      title: 'VIP Примерочная',
      subtitle: 'Одежда из топовых магазинов',
      selectStore: 'Выберите магазин',
      collection: 'Коллекция',
      processing: 'Обработка VIP...',
      tryOn: 'Примерить'
    },
    
    // Marketplace
    marketplace: {
      title: 'WB / Ozon',
      subtitle: 'Примерь товар по ссылке с маркетплейса',
      yourPhoto: 'Ваше фото',
      pasteLink: 'Вставьте ссылку на товар',
      placeholder: 'https://wildberries.ru/... или https://ozon.ru/...',
      perTryOn: 'за примерку',
      tryOn: 'Примерить',
      howItWorks: 'Как это работает?',
      howItWorksDesc: 'Скопируйте ссылку на товар с WB или Ozon, мы автоматически загрузим фото товара и примерим его на вас с помощью AI',
      result: 'Результат примерки',
      openIn: 'Открыть в',
      copyLink: 'Скопировать ссылку',
      close: 'Закрыть'
    },
    
    // Profile
    profile: {
      editProfile: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      currentBalance: 'Текущий баланс',
      referral: 'Реферальная программа',
      yourCode: 'Ваш код',
      invited: 'Приглашено',
      earned: 'Заработано',
      inviteHint: 'Приглашайте друзей и получайте 50 💎 за каждого!',
      balance: 'Баланс',
      topUp: 'Пополнить баланс',
      history: 'История операций',
      topUpHistory: 'Пополнение баланса',
      vipTryOn: 'VIP Примерка',
      referralBonus: 'Реферальный бонус',
      today: 'Сегодня',
      yesterday: 'Вчера'
    },
    
    // Settings
    settings: {
      title: 'Настройки',
      appearance: 'Внешний вид',
      theme: 'Тема',
      darkTheme: 'Галактика (тёмная)',
      lightTheme: 'Небо (светлая)',
      language: 'Язык',
      notifications: 'Уведомления',
      vibration: 'Вибрация',
      vibrationDesc: 'Тактильный отклик при нажатии',
      push: 'Push-уведомления',
      pushDesc: 'Уведомления о промоакциях',
      about: 'О приложении',
      version: 'Версия',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      licenses: 'Лицензии',
      termsTitle: 'Условия использования',
termsContent: '1. AI-генерация: Результаты могут быть неточными.\n2. Платежи: Алмазы не подлежат возврату.\n3. Контент: Не загружайте запрещенные фото.',
privacyTitle: 'Политика конфиденциальности',
privacyContent: '1. Фото: Удаляются через 24 часа.\n2. Данные: Мы не передаем личную информацию третьим лицам.\n3. Безопасность: Данные зашифрованы.',
licensesTitle: 'Лицензии',
licensesContent: 'Используется ПО с лицензиями MIT, Apache 2.0 и CreativeML Open RAIL-M для нейросетей.',
    },
    
    // Community
    community: {
      title: 'Комьюнити',
      subtitle: 'Присоединяйся к нашему сообществу',
      social: 'Мы в соцсетях',
      telegram: 'Telegram канал',
      telegramDesc: 'Новости и обновления',
      chat: 'Чат комьюнити',
      chatDesc: 'Общайся с участниками',
      support: 'Поддержка',
      supportDesc: 'Помощь 24/7',
      instagram: 'Instagram',
      instagramDesc: 'Фото и истории',
      youtube: 'YouTube',
      youtubeDesc: 'Видео и туториалы',
      tiktok: 'TikTok',
      tiktokDesc: 'Тренды и челленджи',
      subscribers: 'Подписчиков',
      inChat: 'В чате',
      news: 'Новости',
      inviteFriend: 'Пригласи друга',
      inviteReward: 'Получи 50 💎 за каждого приглашённого друга',
      invite: 'Пригласить',
      feedback: 'Обратная связь',
      feedbackText: 'Есть идеи или предложения? Напиши нам!',
      write: 'Написать'
    },
    
    // Top Up Modal
    topUp: {
      title: 'Пополнение баланса',
      currentBalance: 'Текущий баланс:',
      customAmount: 'Своя сумма',
      topUpBtn: 'Пополнить',
      promo: 'Промокод',
      enterPromo: 'Введите промокод',
      apply: 'Применить',
      success: 'Баланс пополнен на',
      promoSuccess: 'Промокод активирован!',
      promoError: 'Промокод недействителен'
    },
    
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      insufficientFunds: 'Недостаточно средств! Пополните баланс.',
      uploadPhotoFirst: 'Сначала загрузите ваше фото!',
      linkCopied: 'Ссылка скопирована!'
    }
  },
  
  en: {
    // Header
    balance: 'Balance',
    
    // Navigation
    nav: {
      home: 'Home',
      fitting: 'Fitting',
      vip: 'VIP',
      marketplace: 'Market',
      profile: 'Profile'
    },
    
    // Home page
    home: {
      welcome: 'Welcome to',
      subtitle: 'Try on clothes online with AI',
      selectMode: 'Select mode',
      fitting: 'Fitting Room',
      fittingDesc: 'Try on clothes from catalog',
      vipFitting: 'VIP Fitting Room',
      vipDesc: 'Choose clothes from top stores',
      wbOzon: 'WB / Ozon',
      wbOzonDesc: 'Try on item by link',
      exclusive: 'Exclusive',
      exclusiveDesc: 'Upload your clothes + AI prompt',
      firstFree: 'First try-on is free!',
      usePromo: 'Use promo code:',
      users: 'Users',
      tryOns: 'Try-ons',
      satisfied: 'Satisfied'
    },
    
    // Fitting page
    fitting: {
      title: 'Fitting Room',
      subtitle: 'Upload photo and select clothes',
      uploadPhoto: 'Upload photo',
      categories: {
        all: 'All',
        tops: 'Tops',
        bottoms: 'Bottoms',
        dresses: 'Dresses',
        outerwear: 'Outerwear',
        shoes: 'Shoes'
      },
      tryOn: 'Try on',
      processing: 'Processing...',
      result: 'Try-on result',
      close: 'Close'
    },
    
    // VIP Fitting
    vip: {
      title: 'VIP Fitting Room',
      subtitle: 'Clothes from top stores',
      selectStore: 'Select store',
      collection: 'Collection',
      processing: 'VIP Processing...',
      tryOn: 'Try on'
    },
    
    // Marketplace
    marketplace: {
      title: 'WB / Ozon',
      subtitle: 'Try on item by marketplace link',
      yourPhoto: 'Your photo',
      pasteLink: 'Paste product link',
      placeholder: 'https://wildberries.ru/... or https://ozon.ru/...',
      perTryOn: 'per try-on',
      tryOn: 'Try on',
      howItWorks: 'How it works?',
      howItWorksDesc: 'Copy the product link from WB or Ozon, we will automatically load the product photo and try it on you using AI',
      result: 'Try-on result',
      openIn: 'Open in',
      copyLink: 'Copy link',
      close: 'Close'
    },
    
    // Profile
    profile: {
      editProfile: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      currentBalance: 'Current balance',
      referral: 'Referral program',
      yourCode: 'Your code',
      invited: 'Invited',
      earned: 'Earned',
      inviteHint: 'Invite friends and get 50 💎 for each!',
      balance: 'Balance',
      topUp: 'Top up balance',
      history: 'Transaction history',
      topUpHistory: 'Balance top-up',
      vipTryOn: 'VIP Try-on',
      referralBonus: 'Referral bonus',
      today: 'Today',
      yesterday: 'Yesterday'
    },
    
    // Settings
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      darkTheme: 'Galaxy (dark)',
      lightTheme: 'Sky (light)',
      language: 'Language',
      notifications: 'Notifications',
      vibration: 'Vibration',
      vibrationDesc: 'Haptic feedback on tap',
      push: 'Push notifications',
      pushDesc: 'Promo notifications',
      about: 'About app',
      version: 'Version',
      terms: 'Terms of use',
      privacy: 'Privacy policy',
      licenses: 'Licenses',
      termsTitle: 'Terms of Use',
termsContent: '1. AI Generation: Results may vary.\n2. Payments: Diamonds are non-refundable.\n3. Content: No illegal uploads.',
privacyTitle: 'Privacy Policy',
privacyContent: '1. Photos: Deleted after 24 hours.\n2. Data: No third-party sharing.\n3. Security: Encrypted storage.',
licensesTitle: 'Licenses',
licensesContent: 'Uses MIT, Apache 2.0, and CreativeML Open RAIL-M licensed software.'
    },
    
    // Community
    community: {
      title: 'Community',
      subtitle: 'Join our community',
      social: 'Social media',
      telegram: 'Telegram channel',
      telegramDesc: 'News and updates',
      chat: 'Community chat',
      chatDesc: 'Chat with members',
      support: 'Support',
      supportDesc: 'Help 24/7',
      instagram: 'Instagram',
      instagramDesc: 'Photos and stories',
      youtube: 'YouTube',
      youtubeDesc: 'Videos and tutorials',
      tiktok: 'TikTok',
      tiktokDesc: 'Trends and challenges',
      subscribers: 'Subscribers',
      inChat: 'In chat',
      news: 'News',
      inviteFriend: 'Invite a friend',
      inviteReward: 'Get 50 💎 for each invited friend',
      invite: 'Invite',
      feedback: 'Feedback',
      feedbackText: 'Have ideas or suggestions? Write to us!',
      write: 'Write'
    },
    
    // Top Up Modal
    topUp: {
      title: 'Top up balance',
      currentBalance: 'Current balance:',
      customAmount: 'Custom amount',
      topUpBtn: 'Top up',
      promo: 'Promo code',
      enterPromo: 'Enter promo code',
      apply: 'Apply',
      success: 'Balance topped up by',
      promoSuccess: 'Promo code activated!',
      promoError: 'Invalid promo code'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      insufficientFunds: 'Insufficient funds! Top up your balance.',
      uploadPhotoFirst: 'Upload your photo first!',
      linkCopied: 'Link copied!'
    }
  },
  
  kz: {
    // Header
    balance: 'Баланс',
    
    // Navigation
    nav: {
      home: 'Басты',
      fitting: 'Киім үйі',
      vip: 'VIP',
      marketplace: 'Маркет',
      profile: 'Профиль'
    },
    
    // Home page
    home: {
      welcome: 'Қош келдіңіз',
      subtitle: 'AI көмегімен киімді онлайн киіп көріңіз',
      selectMode: 'Режимді таңдаңыз',
      fitting: 'Киім киіп көру',
      fittingDesc: 'Каталогтан киім киіп көру',
      vipFitting: 'VIP Киім киіп көру',
      vipDesc: 'Үздік дүкендерден киім таңдаңыз',
      wbOzon: 'WB / Ozon',
      wbOzonDesc: 'Сілтеме бойынша тауарды киіп көру',
      exclusive: 'Эксклюзив',
      exclusiveDesc: 'Өз киіміңізді жүктеңіз + AI промт',
      firstFree: 'Бірінші киіп көру тегін!',
      usePromo: 'Промокодты пайдаланыңыз:',
      users: 'Пайдаланушылар',
      tryOns: 'Киіп көрулер',
      satisfied: 'Қанағаттанған'
    },
    
    // Fitting page
    fitting: {
      title: 'Киім киіп көру',
      subtitle: 'Фото жүктеп, киім таңдаңыз',
      uploadPhoto: 'Фото жүктеу',
      categories: {
        all: 'Барлығы',
        tops: 'Үсті',
        bottoms: 'Асты',
        dresses: 'Көйлектер',
        outerwear: 'Сыртқы киім',
        shoes: 'Аяқ киім'
      },
      tryOn: 'Киіп көру',
      processing: 'Өңдеу...',
      result: 'Киіп көру нәтижесі',
      close: 'Жабу'
    },
    
    // VIP Fitting
    vip: {
      title: 'VIP Киім киіп көру',
      subtitle: 'Үздік дүкендерден киімдер',
      selectStore: 'Дүкенді таңдаңыз',
      collection: 'Коллекция',
      processing: 'VIP өңдеу...',
      tryOn: 'Киіп көру'
    },
    
    // Marketplace
    marketplace: {
      title: 'WB / Ozon',
      subtitle: 'Маркетплейс сілтемесі бойынша киіп көру',
      yourPhoto: 'Сіздің фото',
      pasteLink: 'Тауар сілтемесін қойыңыз',
      placeholder: 'https://wildberries.ru/... немесе https://ozon.ru/...',
      perTryOn: 'киіп көру үшін',
      tryOn: 'Киіп көру',
      howItWorks: 'Бұл қалай жұмыс істейді?',
      howItWorksDesc: 'WB немесе Ozon-дан тауар сілтемесін көшіріңіз, біз тауар фотосын автоматты түрде жүктеп, AI көмегімен сізге киіп көреміз',
      result: 'Киіп көру нәтижесі',
      openIn: 'Ашу',
      copyLink: 'Сілтемені көшіру',
      close: 'Жабу'
    },
    
    // Profile
    profile: {
      editProfile: 'Өзгерту',
      save: 'Сақтау',
      cancel: 'Бас тарту',
      currentBalance: 'Ағымдағы баланс',
      referral: 'Реферал бағдарламасы',
      yourCode: 'Сіздің код',
      invited: 'Шақырылған',
      earned: 'Табылған',
      inviteHint: 'Достарыңызды шақырыңыз және әрқайсысы үшін 50 💎 алыңыз!',
      balance: 'Баланс',
      topUp: 'Балансты толтыру',
      history: 'Операциялар тарихы',
      topUpHistory: 'Балансты толтыру',
      vipTryOn: 'VIP киіп көру',
      referralBonus: 'Реферал бонусы',
      today: 'Бүгін',
      yesterday: 'Кеше'
    },
    
    // Settings
    settings: {
      title: 'Баптаулар',
      appearance: 'Сыртқы түрі',
      theme: 'Тема',
      darkTheme: 'Ғаламшар (қараңғы)',
      lightTheme: 'Аспан (жарық)',
      language: 'Тіл',
      notifications: 'Хабарландырулар',
      vibration: 'Дірілдеу',
      vibrationDesc: 'Басқанда тактильді жауап',
      push: 'Push-хабарландырулар',
      pushDesc: 'Акциялар туралы хабарландырулар',
      about: 'Қолданба туралы',
      version: 'Нұсқа',
      terms: 'Пайдалану шарттары',
      privacy: 'Құпиялылық саясаты',
      licenses: 'Лицензиялар',
      termsTitle: 'Пайдалану шарттары',
termsContent: '1. AI генерациясы: Нәтижелер әртүрлі болуы мүмкін.\n2. Төлемдер: Алмаздар қайтарылмайды.\n3. Контент: Заңсыз фотоларға тыйым салынады.',
privacyTitle: 'Құпиялылық саясаты',
privacyContent: '1. Фото: 24 сағаттан кейін өшіріледі.\n2. Мәліметтер: Үшінші тұлғаларға берілмейді.\n3. Қауіпсіздік: Деректер шифрланған.',
licensesTitle: 'Лицензиялар',
licensesContent: 'MIT, Apache 2.0 және CreativeML Open RAIL-M лицензиялары қолданылады.',
    },
    
    // Community
    community: {
      title: 'Қауымдастық',
      subtitle: 'Біздің қауымдастыққа қосылыңыз',
      social: 'Біз әлеуметтік желілерде',
      telegram: 'Telegram арнасы',
      telegramDesc: 'Жаңалықтар мен жаңартулар',
      chat: 'Қауымдастық чаты',
      chatDesc: 'Мүшелермен сөйлесіңіз',
      support: 'Қолдау',
      supportDesc: 'Көмек 24/7',
      instagram: 'Instagram',
      instagramDesc: 'Фото және сторилер',
      youtube: 'YouTube',
      youtubeDesc: 'Бейне және нұсқаулықтар',
      tiktok: 'TikTok',
      tiktokDesc: 'Трендтер мен челлендждер',
      subscribers: 'Жазылушылар',
      inChat: 'Чатта',
      news: 'Жаңалықтар',
      inviteFriend: 'Досыңызды шақырыңыз',
      inviteReward: 'Әр шақырылған дос үшін 50 💎 алыңыз',
      invite: 'Шақыру',
      feedback: 'Кері байланыс',
      feedbackText: 'Идеяларыңыз бар ма? Бізге жазыңыз!',
      write: 'Жазу'
    },
    
    // Top Up Modal
    topUp: {
      title: 'Балансты толтыру',
      currentBalance: 'Ағымдағы баланс:',
      customAmount: 'Өз сомасы',
      topUpBtn: 'Толтыру',
      promo: 'Промокод',
      enterPromo: 'Промокодты енгізіңіз',
      apply: 'Қолдану',
      success: 'Баланс толтырылды',
      promoSuccess: 'Промокод іске қосылды!',
      promoError: 'Промокод жарамсыз'
    },
    
    // Common
    common: {
      loading: 'Жүктелуде...',
      error: 'Қате',
      success: 'Сәтті',
      insufficientFunds: 'Қаражат жеткіліксіз! Балансты толтырыңыз.',
      uploadPhotoFirst: 'Алдымен фотоңызды жүктеңіз!',
      linkCopied: 'Сілтеме көшірілді!'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
