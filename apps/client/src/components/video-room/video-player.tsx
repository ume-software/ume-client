import React, { useEffect, useRef } from 'react'

export const VideoPlayer = ({ user, myUid }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    user.videoTrack.play(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-full">
      {user.uid == myUid && (
        <p className="absolute bottom-2 left-2 px-3 py-2 z-10 bg-black bg-opacity-50 rounded-xl">Tôi</p>
      )}
      <div ref={ref} className="w-full h-full min-w-[640px] min-h-[480px]"></div>
    </div>
  )
}
