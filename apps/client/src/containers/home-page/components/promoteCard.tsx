import { PlayOne, Star, VoiceOne } from '@icon-park/react'
import DefaultSound from 'public/sounds/default-sound.mp3'

import React, { useEffect, useRef } from 'react'

import Image from 'next/legacy/image'
import { FilterProviderResponse } from 'ume-service-openapi'

const PromoteCard = (props: { data: FilterProviderResponse; filterAttributeValueData?: string[] }) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const audio = audioRef.current
    if (audio?.paused) {
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

  const DisplayAttribute = (serviceAttribute) => {
    if ((serviceAttribute?.length ?? 0) > 0) {
      return (
        <div className="inline-block">
          {serviceAttribute.map((serviceAttr, index) => (
            <div key={serviceAttr.attribute + index} className="inline-block">
              {(serviceAttr?.serviceAttributeValues?.length ?? 0) > 0 && index < 2 && (
                <div className="inline-block">
                  {serviceAttr?.serviceAttributeValues?.map(
                    (serviceAttrValues, indexAttrValue) =>
                      indexAttrValue >= 0 &&
                      indexAttrValue < 1 && (
                        <div
                          key={serviceAttrValues.value + indexAttrValue + index}
                          className="w-fit inline-block px-5 py-2 bg-zinc-500 text-sm font-bold rounded-lg mr-3 mb-3"
                        >
                          {serviceAttrValues.viValue}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="bg-[#292734] text-white rounded-3xl pl-6 my-3 max-w-72 h-full group hover:duration-500 hover:ease-in-out block">
      <div className="flex flex-row justify-between">
        <div className="w-[140px] h-[140px] relative -translate-y-6 group-hover:scale-110 duration-500">
          <Image
            className="absolute ease-in-out rounded-2xl object-cover"
            src={props?.data?.avatarUrl ?? ''}
            alt="image_provider"
            layout="fill"
            loading="lazy"
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
          {props?.data?.voiceUrl ? (
            <audio ref={audioRef} src={props?.data?.voiceUrl} />
          ) : (
            <audio ref={audioRef} src={DefaultSound} />
          )}
        </button>
      </div>
      <div className="h-72 flex flex-col justify-between pr-5">
        <div className="flex flex-col gap-3">
          <div className="w-fit flex items-center gap-3 bg-purple-600 p-2 mb-2 rounded-md text-white">
            <p className="text-md font-semibold">{props?.data?.serviceName}</p>
            {props?.data?.star ? (
              <div className="flex items-center gap-1 text-lg font-bold">
                <Star theme="filled" size="15" fill="#FFBB00" strokeLinejoin="bevel" />
                {Number(props?.data?.star ?? 0).toFixed(1)}
              </div>
            ) : (
              ''
            )}
          </div>
          {DisplayAttribute((props.data as any).serviceAttributeValues)}
          <p className="text-xl font-bold">{props?.data?.name}</p>
          {/* <div className="">
          <Star theme="outline" size="20" fill="#EBFF00" className="inline-block mr-2" />
          <span className="font-bold align-top text-slate-300">{props?.data?.totalVote}</span>
        </div> */}
          <p className="text-lg line-clamp-2">{props?.data?.description}</p>
        </div>
        <div className="flex justify-end items-end mt-10 gap-1">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">
              {props?.data?.cost?.toLocaleString('en-US', {
                currency: 'VND',
              })}
            </p>
            <span className="text-xs italic"> đ</span>
          </div>
          <p className="text-lg font-semibold opacity-30">/ Giờ</p>
        </div>
      </div>
    </div>
  )
}
export default PromoteCard
