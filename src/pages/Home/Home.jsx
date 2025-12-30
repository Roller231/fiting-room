import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Home.css';

const Home = ({ setActiveTab }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      id: 'basic',
      icon: '👗',
      titleKey: 'home.fitting',
      descKey: 'home.fittingDesc',
      price: '10 💎',
      tab: 'fitting'
    },
    {
      id: 'vip',
      icon: '👑',
      titleKey: 'home.vipFitting',
      descKey: 'home.vipDesc',
      price: '25 💎',
      tab: 'vip'
    },
    {
      id: 'marketplace',
      icon: '🛒',
      titleKey: 'home.wbOzon',
      descKey: 'home.wbOzonDesc',
      price: '30 💎',
      tab: 'marketplace'
    },
    {
      id: 'exclusive',
      icon: '⭐',
      titleKey: 'home.exclusive',
      descKey: 'home.exclusiveDesc',
      price: '50 💎',
      tab: 'exclusive'
    }
  ];

  return (
    <div className={`home ${isDark ? 'dark' : 'light'}`}>
      <div className="home-banner">
        <div className="banner-content">
          <h1>{t('home.welcome')}<br/><span>FitRoom</span></h1>
          <p>{t('home.subtitle')}</p>
        </div>
        <div className="banner-decoration">
          {isDark ? '🌌' : '☁️'}
        </div>
      </div>

      <section className="features-section">
        <h2>{t('home.selectMode')}</h2>
        <div className="features-grid">
          {features.map(feature => (
            <button 
              key={feature.id}
              className="feature-card"
              onClick={() => setActiveTab(feature.tab)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descKey)}</p>
              <span className="feature-price">{feature.price}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🎁</span>
          <div>
            <h3>{t('home.firstFree')}</h3>
            <p>{t('home.usePromo')} <strong>WELCOME100</strong></p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <span className="stat-value">50K+</span>
          <span className="stat-label">{t('home.users')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">200K+</span>
          <span className="stat-label">{t('home.tryOns')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">98%</span>
          <span className="stat-label">{t('home.satisfied')}</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
