import { useTheme } from '../../context/ThemeContext';
import './Home.css';

const Home = ({ setActiveTab }) => {
  const { isDark } = useTheme();

  const features = [
    {
      id: 'basic',
      icon: '👗',
      title: 'Примерочная',
      desc: 'Примерь одежду из каталога',
      price: '10 💎',
      tab: 'fitting'
    },
    {
      id: 'vip',
      icon: '👑',
      title: 'VIP Примерочная',
      desc: 'Выбери одежду из топ-магазинов',
      price: '25 💎',
      tab: 'vip'
    },
    {
      id: 'marketplace',
      icon: '🛒',
      title: 'WB / Ozon',
      desc: 'Примерь товар по ссылке',
      price: '30 💎',
      tab: 'marketplace'
    },
    {
      id: 'exclusive',
      icon: '⭐',
      title: 'Эксклюзив',
      desc: 'Загрузи свою одежду + промт AI',
      price: '50 💎',
      tab: 'exclusive'
    }
  ];

  return (
    <div className={`home ${isDark ? 'dark' : 'light'}`}>
      <div className="home-banner">
        <div className="banner-content">
          <h1>Добро пожаловать в<br/><span>FitRoom</span></h1>
          <p>Примеряй одежду онлайн с помощью AI</p>
        </div>
        <div className="banner-decoration">
          {isDark ? '🌌' : '☁️'}
        </div>
      </div>

      <section className="features-section">
        <h2>Выберите режим</h2>
        <div className="features-grid">
          {features.map(feature => (
            <button 
              key={feature.id}
              className="feature-card"
              onClick={() => setActiveTab(feature.tab)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <span className="feature-price">{feature.price}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🎁</span>
          <div>
            <h3>Первая примерка бесплатно!</h3>
            <p>Используй промокод: <strong>WELCOME100</strong></p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <span className="stat-value">50K+</span>
          <span className="stat-label">Пользователей</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">200K+</span>
          <span className="stat-label">Примерок</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">98%</span>
          <span className="stat-label">Довольны</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
