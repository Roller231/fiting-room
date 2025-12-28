import { useTheme } from '../../context/ThemeContext';
import './Community.css';

const Community = () => {
  const { isDark } = useTheme();

  const socialLinks = [
    {
      id: 'telegram',
      icon: '📢',
      title: 'Telegram канал',
      desc: 'Новости и обновления',
      color: '#0088cc',
      url: 'https://t.me/fitroom'
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'Чат комьюнити',
      desc: 'Общайся с участниками',
      color: '#6366f1',
      url: 'https://t.me/fitroom_chat'
    },
    {
      id: 'support',
      icon: '🆘',
      title: 'Поддержка',
      desc: 'Помощь 24/7',
      color: '#22c55e',
      url: 'https://t.me/fitroom_support'
    },
    {
      id: 'instagram',
      icon: '📸',
      title: 'Instagram',
      desc: 'Фото и истории',
      color: '#e4405f',
      url: 'https://instagram.com/fitroom'
    },
    {
      id: 'youtube',
      icon: '🎬',
      title: 'YouTube',
      desc: 'Видео и туториалы',
      color: '#ff0000',
      url: 'https://youtube.com/fitroom'
    },
    {
      id: 'tiktok',
      icon: '🎵',
      title: 'TikTok',
      desc: 'Тренды и челленджи',
      color: '#000000',
      url: 'https://tiktok.com/@fitroom'
    }
  ];

  const news = [
    {
      id: 1,
      title: '🎉 Запуск VIP примерочной!',
      date: '25 декабря 2024',
      preview: 'Теперь доступна одежда из топовых магазинов: ZARA, H&M, Mango и других!'
    },
    {
      id: 2,
      title: '🎁 Новогодняя акция',
      date: '20 декабря 2024',
      preview: 'Получите x2 бонусов за пополнение баланса до 31 декабря!'
    },
    {
      id: 3,
      title: '⭐ Обновление AI',
      date: '15 декабря 2024',
      preview: 'Улучшенное качество примерки благодаря новой версии нейросети'
    }
  ];

  return (
    <div className={`community ${isDark ? 'dark' : 'light'}`}>
      <div className="community-header">
        <h1>👥 Комьюнити</h1>
        <p>Присоединяйся к нашему сообществу</p>
      </div>

      <div className="social-section">
        <h2>🔗 Мы в соцсетях</h2>
        <div className="social-grid">
          {socialLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              style={{ '--accent-color': link.color }}
            >
              <span className="social-icon">{link.icon}</span>
              <div className="social-info">
                <span className="social-title">{link.title}</span>
                <span className="social-desc">{link.desc}</span>
              </div>
              <span className="social-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <div className="stats-banner">
        <div className="stat-block">
          <span className="stat-number">50K+</span>
          <span className="stat-text">Подписчиков</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-number">10K+</span>
          <span className="stat-text">В чате</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-number">24/7</span>
          <span className="stat-text">Поддержка</span>
        </div>
      </div>

      <div className="news-section">
        <h2>📰 Новости</h2>
        <div className="news-list">
          {news.map(item => (
            <div key={item.id} className="news-card">
              <div className="news-header">
                <span className="news-title">{item.title}</span>
                <span className="news-date">{item.date}</span>
              </div>
              <p className="news-preview">{item.preview}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="invite-section">
        <div className="invite-card">
          <span className="invite-icon">🎁</span>
          <div className="invite-content">
            <h3>Пригласи друга</h3>
            <p>Получи 50 💎 за каждого приглашённого друга</p>
          </div>
          <button className="invite-btn">Пригласить</button>
        </div>
      </div>

      <div className="feedback-section">
        <h2>📝 Обратная связь</h2>
        <div className="feedback-card">
          <p>Есть идеи или предложения? Напиши нам!</p>
          <button className="feedback-btn">
            <span>✉️</span>
            <span>Написать</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
