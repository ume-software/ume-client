import React from 'react'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

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
  const [user, setUser] = useState<UserInformationResponse | null>(null)

  const authContextValue = React.useMemo(() => {
    const login = async (user: UserInformationResponse): Promise<void> => {
      setUser(user)
    }

    const logout = async (): Promise<void> => {
      setUser(null)
    }

    return { isAuthenticated: Boolean(user), user, login, logout }
  }, [user])

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
