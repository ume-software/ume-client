import { useState } from 'react'

export const useLocalStorage = (key: string, value: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.sessionStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(value))
        return value
      }
    } catch (err) {
      return value
    }
  })
  const setValue = (newValue: any) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(newValue))
    } catch (err) {}
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
