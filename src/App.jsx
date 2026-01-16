import { useEffect, useState } from 'react'
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

// ... (imports unchanged)

/* ================= APP CONTENT ================= */
const AppContent = () => {
  const { isFirstVisit, isDark } = useTheme()
  const { user, loading, error } = useUser()  // NEW: Destructure error
  const [activeTab, setActiveTab] = useState('home')
  const isLocalDev = false

  // IMPROVED: Better state handling
  if (isFirstVisit) return <ThemeSelector />
  if (loading) return <div className="loader">Loading...</div>
  if (error || !user) {
    return (
      <div className="error-screen" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
        background: '#f0f0f0'
      }}>
        <h1>🚫 Unable to Load App</h1>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          {error || 'Unknown error occurred.'}
        </p>
        <p>
          Please open this Mini App from <strong>Telegram</strong> (via bot or menu).
        </p>
        {isLocalDev && (
          <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
            💡 In dev mode? Check console or restart `vite dev`.
          </p>
        )}
      </div>
    )
  }




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
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>

    </ThemeProvider>
  )
}
