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

  const initedRef = useRef(false)

  useEffect(() => {
    if (initedRef.current) return
    initedRef.current = true

    const tg = window.Telegram?.WebApp

    if (!tg) {
      initUser({
        tg_id: '99999',
        username: 'local_user',
        firstname: 'Guest',
        photo_url: null,
      })
      return
    }

    tg.ready()
    tg.expand()

    const onViewport = () => tg.expand()
    const onVisibility = () => !document.hidden && tg.expand()

    tg.onEvent('viewportChanged', onViewport)
    document.addEventListener('visibilitychange', onVisibility)

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
        tg_id: '99999',
        username: 'local_user',
        firstname: 'Guest',
        photo_url: null,
      })
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [initUser])

  if (isFirstVisit) return <ThemeSelector />
  if (loading || !user) return <div className="loader">Loading user...</div>
  

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
