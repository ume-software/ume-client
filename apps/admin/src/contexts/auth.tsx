import React from 'react'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { AdminInformationResponse } from 'ume-service-openapi'

type AuthProviderType = PropsWithChildren<{}>

interface AuthContextData {
  isAuthenticated: boolean
  user: AdminInformationResponse | null
  role: Array<string>
  login: (user: AdminInformationResponse) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<AdminInformationResponse | null>(null)
  const [role, setRole] = useState<Array<string>>([])

  const authContextValue = React.useMemo(() => {
    const login = async (user: AdminInformationResponse): Promise<void> => {
      setUser(user)
      if (user.adminRoles) {
        for (const role of user?.adminRoles) {
          setRole((prev) => [...prev, role.roleType])
        }
      }
    }

    const logout = async (): Promise<void> => {
      setUser(null)
      setRole([])
    }

    return { isAuthenticated: Boolean(user), user, login, logout, role }
  }, [role, user])

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
