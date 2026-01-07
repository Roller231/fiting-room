import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import TopUpModal from '../Modals/TopUpModal';
import './Header.css';

const Header = () => {
  const { isDark } = useTheme();
  const { user, loading } = useUser();
  const [showTopUp, setShowTopUp] = useState(false);

  if (loading || !user) {
    return (
      <header className={`header ${isDark ? 'dark' : 'light'}`}>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">FitRoom</span>
          </div>
          <div className="balance-skeleton">...</div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`header ${isDark ? 'dark' : 'light'}`}>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">FitRoom</span>
          </div>

          <button className="balance-btn" onClick={() => setShowTopUp(true)}>
            <span className="balance-icon">💎</span>
            <span className="balance-amount">{user.balance}</span>
            <span className="balance-plus">+</span>
          </button>
        </div>
      </header>

      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} />}
    </>
  );
};


export default Header;
