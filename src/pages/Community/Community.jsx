import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Community.css';

const Community = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const socialLinks = [
    {
      id: 'telegram',
      icon: '📢',
      titleKey: 'community.telegram',
      descKey: 'community.telegramDesc',
      color: '#0088cc',
      url: 'https://t.me/fitroom'
    },
    {
      id: 'chat',
      icon: '💬',
      titleKey: 'community.chat',
      descKey: 'community.chatDesc',
      color: '#6366f1',
      url: 'https://t.me/fitroom_chat'
    },
    {
      id: 'support',
      icon: '🆘',
      titleKey: 'community.support',
      descKey: 'community.supportDesc',
      color: '#22c55e',
      url: 'https://t.me/fitroom_support'
    },
    {
      id: 'instagram',
      icon: '📸',
      titleKey: 'community.instagram',
      descKey: 'community.instagramDesc',
      color: '#e4405f',
      url: 'https://instagram.com/fitroom'
    },
    {
      id: 'youtube',
      icon: '🎬',
      titleKey: 'community.youtube',
      descKey: 'community.youtubeDesc',
      color: '#ff0000',
      url: 'https://youtube.com/@ton-d8k?si=SCHdVDKP_Rzj3qPM'
    },
    {
      id: 'tiktok',
      icon: '🎵',
      titleKey: 'community.tiktok',
      descKey: 'community.tiktokDesc',
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
        <h1>👥 {t('community.title')}</h1>
        <p>{t('community.subtitle')}</p>
      </div>

      <div className="social-section">
        <h2>🔗 {t('community.social')}</h2>
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
                <span className="social-title">{t(link.titleKey)}</span>
                <span className="social-desc">{t(link.descKey)}</span>
              </div>
              <span className="social-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <div className="stats-banner">
        <div className="stat-block">
          <span className="stat-number">50K+</span>
          <span className="stat-text">{t('community.subscribers')}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-number">10K+</span>
          <span className="stat-text">{t('community.inChat')}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-block">
          <span className="stat-number">24/7</span>
          <span className="stat-text">{t('community.support')}</span>
        </div>
      </div>

      <div className="news-section">
        <h2>📰 {t('community.news')}</h2>
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
{/* 
      <div className="invite-section">
        <div className="invite-card">
          <span className="invite-icon">🎁</span>
          <div className="invite-content">
            <h3>{t('community.inviteFriend')}</h3>
            <p>{t('community.inviteReward')}</p>
          </div>
          <button className="invite-btn">{t('community.invite')}</button>
        </div>
      </div> */}

      <div className="feedback-section">
        <h2>📝 {t('community.feedback')}</h2>
        <div className="feedback-card">
          <p>{t('community.feedbackText')}</p>
          <button className="feedback-btn">
            <span>✉️</span>
            <span>{t('community.write')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
