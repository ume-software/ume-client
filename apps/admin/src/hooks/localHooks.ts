const setItem = (key: string, value: any) => {
  return sessionStorage.setItem(key, JSON.stringify(value))
}
const clearStorage = () => {
  return sessionStorage.clear()
}

const removeItem = (key: string) => {
  return sessionStorage.removeItem(key)
}
const getItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key) || '') : undefined
  }
}

export { setItem, clearStorage, removeItem, getItem }
