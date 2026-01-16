import { useEffect, useState,useRef } from 'react'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import { ThemeProvider, useTheme } from './context/ThemeContext'
import { UserProvider, useUser } from './context/UserContext'
import { LanguageProvider } from './context/LanguageContext'
import { initTelegram } from './telegram/initTelegram'

import ThemeSelector from './components/ThemeSelector/ThemeSelector'
import Header from './components/Header/Header'
import Navigation from './components/Navigation/Navigation'

import Home from './pages/Home/Home'
import Fitting from './pages/Fitting/Fitting'
import VipFitting from './pages/VipFitting/VipFitting'
import Marketplace from './pages/Marketplace/Marketplace'
import Exclusive from './pages/Exclusive/Exclusive'
import Profile from './pages/Profile/Profile'
import Settings from './pages/Settings/Settings'
import Community from './pages/Community/Community'

import './App.css'

/* ================= APP CONTENT ================= */



const AppContent = () => {
  const { isFirstVisit, isDark } = useTheme()
  const { initUser, user, loading } = useUser()
  const [activeTab, setActiveTab] = useState('home')
  
  // Добавляем реф для защиты от повторной инициализации
  const initedRef = useRef(false)

  useEffect(() => {
    // Если уже инициализировали — выходим
    if (initedRef.current) return
    initedRef.current = true

    const tg = window.Telegram?.WebApp
    
    if (tg && tg.initDataUnsafe?.user) {
      tg.ready()
      tg.expand()
      
      initUser({
        tg_id: String(tg.initDataUnsafe.user.id),
        username: tg.initDataUnsafe.user.username || `user_${tg.initDataUnsafe.user.id}`,
        firstname: tg.initDataUnsafe.user.first_name || 'Guest',
        photo_url: tg.initDataUnsafe.user.photo_url || null,
      })
    } else {
      console.warn("Telegram WebApp not found, loading local user")
      initUser({
        tg_id: '9999',
        username: 'localuser',
        firstname: 'Local Dev',
        photo_url: null,
      })
    }
  }, [initUser]) // initUser из контекста обычно стабилен

  // 1. Сначала проверяем первый визит (выбор темы)
  if (isFirstVisit) return <ThemeSelector />
  
  // 2. Затем проверяем загрузку
  if (loading) return <div className="loader">Loading user data...</div>
  
  // 3. Если загрузка завершена, но данных нет
  if (!user) return <div className="error">Error: User not found in database</div>
  

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />
      case 'fitting': return <Fitting />
      case 'vip': return <VipFitting />
      case 'marketplace': return <Marketplace />
      case 'exclusive': return <Exclusive />
      case 'profile': return <Profile />
      case 'settings': return <Settings />
      case 'community': return <Community />
      default: return <Home setActiveTab={setActiveTab} />
    }
  }

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
  )
}

/* ================= ROOT ================= */

export default function App() {
  return <AppContent />
}
