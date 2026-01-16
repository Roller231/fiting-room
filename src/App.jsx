import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      await initTelegram()

      const tg = window.Telegram?.WebApp

      // ❗ НЕ Telegram — локальный режим
      if (!tg) {
        if (!cancelled) {
          initUser({
            id: 120,
            username: 'local_user',
            first_name: 'Local',
            last_name: 'Dev',
            photo_url: null,
            language_code: 'ru',
          })
        }
        return
      }

      tg.ready()
      tg.expand()

      tg.onEvent('viewportChanged', () => tg.expand())

      // 🔥 ВАЖНО: берём user ТОЛЬКО ПОСЛЕ ready()
      const tgUser = tg.initDataUnsafe?.user

      if (!cancelled) {
        if (tgUser) {
          console.log('[APP] telegram user', tgUser)

          initUser({
            id: tgUser.id,
            username: tgUser.username || `tg_${tgUser.id}`,
            first_name: tgUser.first_name || 'Guest',
            last_name: tgUser.last_name || '',
            photo_url: tgUser.photo_url || null,
            language_code: tgUser.language_code || 'en',
          })
        } else {
          console.warn('[APP] Telegram detected, but user is empty')

          initUser({
            id: 120,
            username: 'local_user',
            first_name: 'Local',
            last_name: 'Dev',
            photo_url: null,
            language_code: 'ru',
          })
        }
      }

      const onFocus = () => {
        if (!document.hidden) tg.expand()
      }

      document.addEventListener('visibilitychange', onFocus)

      return () => {
        document.removeEventListener('visibilitychange', onFocus)
      }
    }

    start()

    return () => {
      cancelled = true
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
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
