import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const tabs = [
    { id: 'settings', icon: '⚙️', labelKey: 'settings.title' },
    { id: 'community', icon: '👥', labelKey: 'community.title' },
    { id: 'home', icon: '🏠', labelKey: 'nav.home' },
    { id: 'fitting', icon: '👗', labelKey: 'nav.fitting' },
    { id: 'profile', icon: '👤', labelKey: 'nav.profile' }
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
            <span className="nav-label">{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
