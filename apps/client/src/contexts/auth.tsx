import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { UserInformationResponse } from 'ume-service-openapi'

type AuthProviderType = PropsWithChildren

interface AuthContextData {
  isAuthenticated: boolean
  user: UserInformationResponse | null
  login: (user: UserInformationResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<UserInformationResponse | null>(null)

  async function login(user: UserInformationResponse) {
    setUser(user)
  }

  async function logout() {
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
