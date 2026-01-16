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

const initUser = async ({ tg_id, username, firstname, photo_url }) => {
  try {
    const { exists } = await userExists(tg_id)

    if (!exists) {
      await createUser({
        tg_id,
        username,
        first_name: firstname,
        photo_url,
        balance: 0,
      })
    }

    const fullUser = await getUser(tg_id)
    setUser(fullUser)
  } catch (e) {
    setError(e.message)
  } finally {
    setLoading(false)
  }
}


  return (
    <UserContext.Provider value={{ user, loading,    initUser,    error, subtractBalance }}>
      {children}
    </UserContext.Provider>
  )
}
