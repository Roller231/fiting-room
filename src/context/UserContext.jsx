import { createContext, useContext, useState, useRef } from 'react'
import { userExists, createUser, getUser } from '../api/userApi'

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const initializedRef = useRef(false)

  const initUser = async (tgUser) => {
    if (initializedRef.current) {
      console.log('[USER] already initialized')
      return
    }

    initializedRef.current = true
    setLoading(true)

    console.log('[USER] init start', tgUser)

    try {
      const { exists } = await userExists(tgUser.id)

      if (!exists) {
        console.log('[USER] creating user')

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
      console.log('[USER] loaded', fullUser)

      setUser(fullUser)
    } catch (e) {
      console.error('[USER] init failed', e)
      initializedRef.current = false
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
