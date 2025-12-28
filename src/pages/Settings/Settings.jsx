import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('ru');
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const languages = [
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'kz', name: 'Қазақша', flag: '🇰🇿' }
  ];

  return (
    <div className={`settings ${isDark ? 'dark' : 'light'}`}>
      <div className="settings-header">
        <h1>⚙️ Настройки</h1>
      </div>

      <div className="settings-section">
        <h2>🎨 Внешний вид</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">{isDark ? '🌙' : '☀️'}</span>
            <div className="setting-text">
              <span className="setting-title">Тема</span>
              <span className="setting-desc">{isDark ? 'Галактика (тёмная)' : 'Небо (светлая)'}</span>
            </div>
          </div>
          <button className={`theme-toggle ${isDark ? 'dark' : 'light'}`} onClick={toggleTheme}>
            <div className="toggle-track">
              <span className="toggle-icon dark">🌙</span>
              <span className="toggle-icon light">☀️</span>
            </div>
            <div className="toggle-thumb"></div>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>🌐 Язык</h2>
        <div className="language-options">
          {languages.map(lang => (
            <button
              key={lang.id}
              className={`language-btn ${language === lang.id ? 'active' : ''}`}
              onClick={() => setLanguage(lang.id)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
              {language === lang.id && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>🔔 Уведомления</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">📳</span>
            <div className="setting-text">
              <span className="setting-title">Вибрация</span>
              <span className="setting-desc">Тактильный отклик при нажатии</span>
            </div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={vibration} 
              onChange={() => setVibration(!vibration)} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">🔔</span>
            <div className="setting-text">
              <span className="setting-title">Push-уведомления</span>
              <span className="setting-desc">Уведомления о промоакциях</span>
            </div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>ℹ️ О приложении</h2>
        <div className="about-card">
          <div className="app-info">
            <span className="app-logo">✨</span>
            <div>
              <span className="app-name">FitRoom</span>
              <span className="app-version">Версия 1.0.0</span>
            </div>
          </div>
          <div className="about-links">
            <button className="about-link">📄 Условия использования</button>
            <button className="about-link">🔒 Политика конфиденциальности</button>
            <button className="about-link">📝 Лицензии</button>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h2>⚠️ Опасная зона</h2>
        <button className="danger-btn">🗑️ Очистить кэш</button>
        <button className="danger-btn delete">🚪 Выйти из аккаунта</button>
      </div>
    </div>
  );
};

export default Settings;
