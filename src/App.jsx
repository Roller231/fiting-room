import { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { initTelegram } from './telegram/initTelegram';

import ThemeSelector from './components/ThemeSelector/ThemeSelector';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';

import Home from './pages/Home/Home';
import Fitting from './pages/Fitting/Fitting';
import VipFitting from './pages/VipFitting/VipFitting';
import Marketplace from './pages/Marketplace/Marketplace';
import Exclusive from './pages/Exclusive/Exclusive';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Community from './pages/Community/Community';

import './App.css';

const AppContent = () => {
  const { isFirstVisit, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return
  
    tg.ready()
  
    // 🔥 ВСЕГДА пытаемся раскрыть
    tg.expand()
  
    // 🔁 повтор при изменении viewport
    tg.onEvent('viewportChanged', () => {
      tg.expand()
    })
  
    // 🔁 повтор при возврате в фокус
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        tg.expand()
      }
    })
  
    if (tg.initDataUnsafe?.user) {
      const tgUser = tg.initDataUnsafe.user
  
      initUser({
        tg_id: String(tgUser.id),
        username: tgUser.username || `tg_${tgUser.id}`,
        firstname: tgUser.first_name || 'Guest',
        photo_url: tgUser.photo_url || null,
      })
    } else {
      initUser({
        tg_id: 'local',
        username: 'localuser',
        firstname: 'Guest',
        photo_url: null,
      })
    }
  }, [])

  if (isFirstVisit) {
    return <ThemeSelector />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'fitting':
        return <Fitting />;
      case 'vip':
        return <VipFitting />;
      case 'marketplace':
        return <Marketplace />;
      case 'exclusive':
        return <Exclusive />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'community':
        return <Community />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <div className="background-effects">
        {isDark ? (
          <>
            <div className="stars-bg"></div>
            <div className="galaxy-bg"></div>
          </>
        ) : (
          <>
            <div className="sky-bg"></div>
            <div className="clouds-bg"></div>
          </>
        )}
      </div>

      <div className="center-bg">
  {isDark ? (
    <img src="/icons/bg-dark.png" alt="" />
  ) : (
    <img src="/icons/bg-light.png" alt="" />
  )}
</div>


      <Header />
      <main className="main-content">{renderPage()}</main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
