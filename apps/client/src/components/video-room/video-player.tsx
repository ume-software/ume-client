import React, { useEffect, useRef } from 'react'

export const VideoPlayer = ({ user }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    user.videoTrack.play(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full h-full">
      Uid: {user.uid}
      <div ref={ref} className="w-full h-full min-w-[640px] min-h-[480px]"></div>
    </div>
  )
}
