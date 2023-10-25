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

  const authContextValue = useMemo(() => {
    const login = async (user: UserInformationResponse): Promise<void> => {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }

    const logout = async (): Promise<void> => {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      router.push('/logout')
      setUser(null)
    }

    return { isAuthenticated: Boolean(user), user, login, logout }
  }, [router, user])

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
