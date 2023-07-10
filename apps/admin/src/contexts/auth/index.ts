import { User } from '~/types/user'

import { Dispatch, createContext } from 'react'

import { AuthState } from './state'

export interface AuthContextProps {
  state: AuthState
  // dispatch: Dispatch<ActionType<AuthState>>
}

const AdminContext = createContext<AuthContextProps>(undefined!)

export default AdminContext
