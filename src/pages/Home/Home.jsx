import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Home.css';

const Home = ({ setActiveTab }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      id: 'basic',
      iconDark: '/icons/fitingDark.png',
      iconLight: '/icons/fitting.jpg',
      titleKey: 'home.fitting',
      descKey: 'home.fittingDesc',
      price: '10 💎',
      tab: 'fitting'
    },
    {
      id: 'vip',
      iconDark: '../../icons/vipDark.png',
      iconLight: '../../icons/vip.jpg',
      titleKey: 'home.vipFitting',
      descKey: 'home.vipDesc',
      price: '25 💎',
      tab: 'vip'
    },
    {
      id: 'marketplace',
      iconDark: '/icons/marketDark.png',
      iconLight: '/icons/marketplace.jpg',
      titleKey: 'home.wbOzon',
      descKey: 'home.wbOzonDesc',
      price: '30 💎',
      tab: 'marketplace'
    },
    {
      id: 'exclusive',
      iconDark: '/icons/exclusiveDark.png',
      iconLight: '/icons/exclusive.jpg',
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
          <h1>{t('home.welcome')}<br/><span>TryOnNow</span></h1>
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
<span className="feature-icon">
  {isDark ? (
    <img src={feature.iconDark} alt="" />
  ) : (
    <img src={feature.iconLight} alt="" />
  )}
</span>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descKey)}</p>
            </button>
          ))}
        </div>
      </section>

      {/* <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🎁</span>
          <div>
            <h3>{t('home.firstFree')}</h3>
            <p>{t('home.usePromo')} <strong>WELCOME100</strong></p>
          </div>
        </div>
      </section> */}

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
