import { PlayOne, Star, VoiceOne } from '@icon-park/react'
import coin from 'public/coin-icon.png'

import React, { useEffect, useRef } from 'react'

import Image from 'next/image'
import { FilterProviderResponse } from 'ume-booking-service-openapi'

const PromoteCard = (props: { data: FilterProviderResponse }) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  console.log(props.data)

  const handlePlayAudio = (e) => {
    e.preventDefault()
    const audio = audioRef.current
    if (audio && audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('ended', handleAudioEnded)
    }
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnded)
      }
    }
  }, [])

  return (
    <div className="bg-[#292734] text-white rounded-3xl pl-6 pb-4 mt-6 max-w-72 h-70 group hover:duration-500 hover:ease-in-out block">
      <div className="flex flex-row justify-between">
        <div className="w-[140px] h-[140px] relative">
          <Image
            className="absolute object-fill duration-500 ease-in-out -translate-y-6 rounded-3xl group-hover:scale-110"
            src={props?.data?.avatarurl}
            alt="image_provider"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <button
          className="bg-purple-600 w-[100px] h-[60px] rounded-tr-3xl rounded-bl-3xl hover:scale-105 hover:duration-500 hover:ease-in-out"
          onClick={(e) => handlePlayAudio(e)}
        >
          {isPlaying ? (
            <VoiceOne theme="outline" size="28" fill="#FFFFFF" className="inline-block m-auto" />
          ) : (
            <PlayOne theme="outline" size="30" fill="#FFFFFF" className="inline-block m-auto" />
          )}
          <audio ref={audioRef} src={props?.data?.voiceurl} />
        </button>
      </div>
      <div className="flex flex-col gap-3 pr-5">
        <p className="w-fit bg-purple-600 p-2 mb-2 rounded-md text-white text-md font-semibold">
          {props?.data?.skillname}
        </p>
        <p className="text-xl font-bold">{props?.data?.name}</p>
        {/* <div className="">
          <Star theme="outline" size="20" fill="#EBFF00" className="inline-block mr-2" />
          <span className="font-bold align-top text-slate-300">{props?.data?.totalVote}</span>
        </div> */}
        <p className="font-sans truncate">{props?.data?.description}</p>

        <div className="flex items-end mt-5 gap-1">
          <div className="flex items-end">
            <Image src={coin} width={25} height={25} alt="coin" />
            <p className="text-2xl font-semibold">{props?.data?.cost.toFixed(0)}</p>
          </div>
          <p className="text-lg font-semibold opacity-30">.00/ Giờ</p>
        </div>
      </div>
    </div>
  )
}
export default PromoteCard
