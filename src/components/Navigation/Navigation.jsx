import { useTheme } from '../../context/ThemeContext';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { isDark } = useTheme();

  const tabs = [
    { id: 'settings', icon: '⚙️', label: 'Настройки' },
    { id: 'community', icon: '👥', label: 'Комьюнити' },
    { id: 'home', icon: '🏠', label: 'Главная' },
    { id: 'fitting', icon: '👗', label: 'Примерочная' },
    { id: 'profile', icon: '👤', label: 'Профиль' }
  ];

  return (
    <nav className={`navigation ${isDark ? 'dark' : 'light'}`}>
      <div className="nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
