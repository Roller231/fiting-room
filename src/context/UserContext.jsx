import { createContext, useContext, useEffect, useState } from 'react'
import { userExists, createUser, getUser, updateUser } from '../api/userApi'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'  // Use SDK for safer access

const UserContext = createContext(null)

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

const isLocalDev = import.meta.env.DEV

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  // NEW: Error state

  const subtractBalance = async (amount) => {
    if (!user || user.balance < amount) return false

    const newBalance = user.balance - amount
    setUser(prev => ({ ...prev, balance: newBalance }))

    try {
      const updatedUser = await updateUser(user.tg_id, { balance: newBalance })
      setUser(updatedUser)
      return true
    } catch (e) {
      console.error('Balance update failed', e)
      setUser(prev => ({ ...prev, balance: prev.balance + amount }))
      return false
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        setError(null)  // Reset error
        let tgUser = null

        // IMPROVED: Use SDK first (safer), fallback to window.Telegram
        const launchParams = retrieveLaunchParams()
        if (launchParams.user) {
          // SDK provides structured user
          tgUser = launchParams.user
          const tg = window.Telegram?.WebApp
          if (tg) {
            tg.ready()
            tg.expand()
          }
        } else {
          const tg = window.Telegram?.WebApp
          if (tg?.initDataUnsafe?.user) {
            tg.ready()
            tg.expand()
            tgUser = tg.initDataUnsafe.user
          } else if (isLocalDev) {
            tgUser = {
              id: 120,
              username: 'local_user',
              first_name: 'Local',
              last_name: 'Dev',
              language_code: 'ru',
              photo_url: null,
            }
          }
        }

        if (!tgUser) {
          throw new Error('Telegram Mini App must be opened within Telegram')
        }

        const { exists } = await userExists(tgUser.id)

        if (!exists) {
          await createUser({
            tg_id: tgUser.id,
            username: tgUser.username || tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name || '',
            photo_url: tgUser.photo_url || null,
            language_code: tgUser.language_code || 'en',
            balance: 0,
          })
        }

        const fullUser = await getUser(tgUser.id)
        setUser(fullUser)
      } catch (e) {
        // console.error('[USER INIT FAILED]', e)  // OPTIONAL: Comment to suppress console spam
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, error, subtractBalance }}>
      {children}
    </UserContext.Provider>
  )
}
