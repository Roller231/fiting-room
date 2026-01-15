import { createContext, useContext, useState } from 'react'
import { userExists, createUser, getUser, updateUser } from '../api/userApi'

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const initUser = async (tgUser) => {
    setLoading(true)
    try {
      const { exists } = await userExists(tgUser.id)

      if (!exists) {
        await createUser({
          tg_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          photo_url: tgUser.photo_url,
          language_code: tgUser.language_code || 'en',
          balance: 0,
        })
      }

      const fullUser = await getUser(tgUser.id)
      setUser(fullUser)
    } catch (e) {
      console.error('User init failed', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, initUser }}>
      {children}
    </UserContext.Provider>
  )
}
