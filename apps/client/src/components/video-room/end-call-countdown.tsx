import { useEffect, useState } from 'react'

export const EndCallCountDown = ({ remainingTimeLeft }) => {
  const [remainingTime, setRemainingTime] = useState(remainingTimeLeft)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTime = remainingTime - 1
      setRemainingTime(newRemainingTime)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [remainingTime])

  return <div className="text-center text-lg font-semibold">Tự động chuyển hướng {remainingTime}s...</div>
}
