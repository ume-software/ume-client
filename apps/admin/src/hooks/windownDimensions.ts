import { useEffect, useState } from 'react'

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 })
  const isWindowDefined = typeof window !== 'undefined'

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(() => {
        const { innerWidth: width, innerHeight: height } = window
        return { width, height }
      })
    }

    if (isWindowDefined) {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [isWindowDefined])

  return windowDimensions
}
