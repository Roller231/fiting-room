import { useTheme } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { selectTheme } = useTheme();

  return (
    <div className="theme-selector">
      <div className="stars"></div>
      <div className="clouds"></div>
      
      <div className="selector-content">
        <div className="welcome-logo">
          <span className="welcome-icon">✨</span>
          <h1>FitRoom</h1>
          <p>Онлайн примерочная будущего</p>
        </div>

        <h2>Выберите тему</h2>
        
        <div className="theme-options">
          <button 
            className="theme-option dark-theme"
            onClick={() => selectTheme('dark')}
          >
            <div className="theme-preview dark">
              <div className="preview-stars">
                <span>⭐</span>
                <span>✨</span>
                <span>💫</span>
              </div>
              <div className="preview-moon">🌙</div>
            </div>
            <span className="theme-name">Галактика</span>
            <span className="theme-desc">Тёмная тема с космическими эффектами</span>
          </button>

          <button 
            className="theme-option light-theme"
            onClick={() => selectTheme('light')}
          >
            <div className="theme-preview light">
              <div className="preview-clouds">
                <span>☁️</span>
                <span>⛅</span>
                <span>☁️</span>
              </div>
              <div className="preview-sun">☀️</div>
            </div>
            <span className="theme-name">Небо</span>
            <span className="theme-desc">Светлая тема с небесными облаками</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
