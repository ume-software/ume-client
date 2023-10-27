import { useEffect, useState } from 'react'

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    function handleResize() {
      setWindowDimensions(() => {
        const { innerWidth: width, innerHeight: height } = window
        return { width, height }
      })
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [typeof window !== 'undefined'])

  return windowDimensions
}
