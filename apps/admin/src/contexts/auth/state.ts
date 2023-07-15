export interface AuthState {
  isLoggedIn: false
  role: undefined
  user: null
}

export const initialState: AuthState = {
  isLoggedIn: false,
  role: undefined,
  user: null,
}
