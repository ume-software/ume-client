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
  try {
    return JSON.parse(localStorage.getItem(key) || '')
  } catch (e) {
    console.error(e)
  }
}

export { setItem, clearStorage, removeItem, getItem }
