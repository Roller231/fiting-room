import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Settings.css';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Состояние для активной модалки
  const [activeModal, setActiveModal] = useState(null);

  const languages = [
    { id: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w40/ru.png' },
    { id: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { id: 'kz', name: 'Қазақша', flag: 'https://flagcdn.com/w40/kz.png' }
  ];

  return (
    <div className={`settings ${isDark ? 'dark' : 'light'}`}>
      <div className="settings-header">
        <h1>⚙️ {t('settings.title')}</h1>
      </div>

      <div className="settings-section">
        <h2>🎨 {t('settings.appearance')}</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">{isDark ? '🌙' : '☀️'}</span>
            <div className="setting-text">
              <span className="setting-title">{t('settings.theme')}</span>
              <span className="setting-desc">{isDark ? t('settings.darkTheme') : t('settings.lightTheme')}</span>
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
        <h2>🌐 {t('settings.language')}</h2>
        <div className="language-options">
          {languages.map(lang => (
            <button
              key={lang.id}
              className={`language-btn ${language === lang.id ? 'active' : ''}`}
              onClick={() => setLanguage(lang.id)}
            >
              <img className="lang-flag" src={lang.flag} alt={lang.name} />
              <span className="lang-name">{lang.name}</span>
              {language === lang.id && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>🔔 {t('settings.notifications')}</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">📳</span>
            <div className="setting-text">
              <span className="setting-title">{t('settings.vibration')}</span>
              <span className="setting-desc">{t('settings.vibrationDesc')}</span>
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
              <span className="setting-title">{t('settings.push')}</span>
              <span className="setting-desc">{t('settings.pushDesc')}</span>
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
        <h2>ℹ️ {t('settings.about')}</h2>
        <div className="about-card">
          <div className="app-info">
            <span className="app-logo">✨</span>
            <div>
              <span className="app-name">TryOnNow</span>
              <span className="app-version">{t('settings.version')} 1.0.0</span>
            </div>
          </div>
          <div className="about-links">
            <button className="about-link" onClick={() => setActiveModal('terms')}>
              📄 {t('settings.terms')}
            </button>
            <button className="about-link" onClick={() => setActiveModal('privacy')}>
              🔒 {t('settings.privacy')}
            </button>
            <button className="about-link" onClick={() => setActiveModal('licenses')}>
              📝 {t('settings.licenses')}
            </button>
          </div>
        </div>
      </div>

      {/* Модалка с переводами */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{t(`settings.${activeModal}Title`)}</h3>
            <div className="modal-body">
              <p style={{ whiteSpace: 'pre-line' }}>{t(`settings.${activeModal}Content`)}</p>
            </div>
            <button className="modal-btn" onClick={() => setActiveModal(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;