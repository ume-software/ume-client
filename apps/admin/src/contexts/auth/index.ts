import { createContext } from 'react'

import { AuthState } from './state'

export interface AuthContextProps {
  state: AuthState
}

const AdminContext = createContext<AuthContextProps>(undefined!)

export default AdminContext
