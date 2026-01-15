import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const tabs = [
    { id: 'settings', icon: '/icons/nav/settings.png', labelKey: 'settings.title' },
    { id: 'community', icon: '/icons/nav/comunity.png', labelKey: 'community.title' },
    { id: 'home', icon: '/icons/nav/home.png', labelKey: 'nav.home' },
    { id: 'fitting', icon: '/icons/nav/fit.png', labelKey: 'nav.fitting' },
    { id: 'profile', icon: '/icons/nav/profile.png', labelKey: 'nav.profile' }
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
            <span className="nav-icon">
              <img src={tab.icon} alt="" />
            </span>
            <span className="nav-label">{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
