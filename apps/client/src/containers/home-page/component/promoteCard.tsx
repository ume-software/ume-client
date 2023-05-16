import Github from '@icon-park/react/lib/icons/Github'
import PlayOne from '@icon-park/react/lib/icons/PlayOne'
import StarOne from '@icon-park/react/lib/icons/StarOne'
import VoiceOne from '@icon-park/react/lib/icons/VoiceOne'
import profile from 'public/profile.jpg'
import * as React from 'react'
import Image from 'next/dist/client/image'
export interface PromoteCardProps {
  image: string,
  name: string,
  rating: number,
  totalVote: number,
  description: string,
  coin: number,
}

export const PromoteCard = () => {
  const [isPlaying, setPlaying] = React.useState(false)

  const cardImg = profile
  const nameCard = 'Look At Me'
  const rating = 5.0
  const totalVote = 100
  const description = 'Yêu anh đi em anh k đòi quà!'
  const coin = 10
  const duration = 1

  const handlePlayAudio = () => {
    setPlaying(!isPlaying);
  }
  React.useEffect(() => {
    if (isPlaying) {
      new Audio('public/static/gaugau.mp3').play()
    }
  }, [isPlaying]);
  return (
    <div className="bg-[#292734] text-white rounded-3xl pl-6 pb-4 mt-6 max-w-[320px] hover:scale-105 duration-500 ease-in-out block">
      <div className="flex flex-row justify-between">
        <Image
          className="-translate-y-6 rounded-3xl"
          src={cardImg}
          alt="image_provider"
          width={160}
          height={160}
        />
        <button className="bg-[#7463F0] w-20 h-12 rounded-tr-3xl rounded-bl-3xl hover:scale-105 duration-500 ease-in-out" onClick={handlePlayAudio}>
          {isPlaying ? (
            <div>
              <VoiceOne theme="outline" size="28" fill="#FFFFFF" className="inline-block m-auto" />
              <audio src="#"></audio>
            </div>
          ) : (
            <PlayOne theme="outline" size="30" fill="#FFFFFF" className="inline-block m-auto" />
          )}
        </button>
      </div>
      <div>
        <h3 className="text-2xl font-bold">{nameCard}</h3>
        {/* TODO: fix rating */}
        <div>
          <StarOne theme="outline" size="16" fill="#EBFF00" className="inline-block mr-2" />
          <span className="mr-2">{rating}</span>
          <span className="font-bold text-slate-500">({totalVote})</span>
        </div>
        <p className="font-sans truncate">{description}</p>
        <Github theme="outline" size="16" fill="#7463F0" className="inline-block mr-2" />
        <p className="inline-block mr-2 font-sans">
          <span className="text-2xl font-bold">{coin}</span>.00 /{duration} giờ
        </p>
      </div>
    </div>
  )
}
