import { createContext, useContext, useEffect, useState } from 'react'
import { userExists, createUser, getUser, updateUser } from '../api/userApi'

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
        let tgUser
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
        } else {
          throw new Error('No telegram user')
        }

        const { exists } = await userExists(tgUser.id)

        if (!exists) {
          await createUser({
            tg_id: tgUser.id,
            username: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            photo_url: tgUser.photo_url,
            language_code: tgUser.language_code,
            balance: 0,
          })
        }

        const fullUser = await getUser(tgUser.id)
        setUser(fullUser)
      } catch (e) {
        console.error('[USER INIT FAILED]', e)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, subtractBalance }}>
      {children}
    </UserContext.Provider>
  )
}
