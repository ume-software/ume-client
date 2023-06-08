import { Github, PlayOne, Star, VoiceOne } from '@icon-park/react'

import React from 'react'

import Image from 'next/image'

export interface IPromoteCardProps {
  id: string
  image: string
  name: string
  rating: number
  totalVote: number
  description: string
  coin: number
}

export const PromoteCard = (props: IPromoteCardProps) => {
  const [isPlaying, setPlaying] = React.useState(false)

  const handlePlayAudio = (e) => {
    e.preventDefault()
    setPlaying(!isPlaying)
  }
  React.useEffect(() => {
    if (isPlaying) {
      new Audio('public/static/gaugau.mp3').play()
    }
  }, [isPlaying])
  return (
    <div
      id={props.id}
      className="bg-[#292734] text-white rounded-3xl pl-6 pb-4 mt-6 max-w-72 h-70 group hover:duration-500 hover:ease-in-out block"
    >
      <div className="flex flex-row justify-between">
        <Image
          className="object-fill duration-500 ease-in-out -translate-y-6 rounded-3xl group-hover:scale-110"
          src={props.image}
          alt="image_provider"
          width={140}
          height={140}
        />
        <button
          className="bg-[#7463F0] w-16 h-10 rounded-tr-3xl rounded-bl-3xl hover:scale-105 hover:duration-500 hover:ease-in-out"
          onClick={(e) => {
            handlePlayAudio(e)
          }}
        >
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
        <h3 className="text-lg font-semibold">{props?.name}</h3>
        {/* TODO: fix rating */}
        <div className="">
          <Star theme="outline" size="20" fill="#EBFF00" className="inline-block mr-2" />
          <span className="font-bold align-top text-slate-300">{props?.totalVote}</span>
        </div>
        <div className="font-sans truncate">{props?.description}</div>
        <Github theme="outline" size="16" fill="#7463F0" className="inline-block mr-2" />
        <div className="inline-block mr-2 font-sans">
          <span className="text-2xl font-bold">{Math.round(props.coin)}</span>.00 /{1} giờ
        </div>
      </div>
    </div>
  )
}
