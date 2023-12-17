import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import { UserInformationResponse } from 'ume-service-openapi'

type AuthProviderType = PropsWithChildren<{}>

interface AuthContextData {
  isAuthenticated: boolean
  user: UserInformationResponse | null
  login: (user: UserInformationResponse) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderType) => {
  const router = useRouter()
  const [user, setUser] = useState<UserInformationResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const authContextValue = useMemo(() => {
    const login = async (user: UserInformationResponse): Promise<void> => {
      setIsAuthenticated(true)
      setUser(user)
    }

    const logout = async (): Promise<void> => {
      localStorage.removeItem('accessToken')
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'refeshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setUser(null)
      setIsAuthenticated(false)
      // await router.push('/logout')
    }

    return { isAuthenticated, user, login, logout }
  }, [user, isAuthenticated])

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
