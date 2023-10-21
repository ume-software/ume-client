const setItem = (key: string, value: any) => {
  return localStorage.setItem(key, JSON.stringify(value))
}
const clearStorage = () => {
  return localStorage.clear()
}

const removeItem = (key: string) => {
  return localStorage.removeItem(key)
}
const getItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : undefined
  }
}

export { setItem, clearStorage, removeItem, getItem }
