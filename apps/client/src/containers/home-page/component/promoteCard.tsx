import Github from '@icon-park/react/lib/icons/Github'
import PlayOne from '@icon-park/react/lib/icons/PlayOne'
import StarOne from '@icon-park/react/lib/icons/StarOne'
import { Button } from '@ume/ui'
import profile from 'public/profile.jpg'

import * as React from 'react'

import Image from 'next/dist/client/image'

export interface PromoteCardProps {}

export default function PromoteCard({ card }) {
  const cardImg = profile
  const nameCard = 'Look At Me'
  const rating = 5.0
  const totalVote = 100
  return (
    <div className="bg-[#292734] text-white rounded-3xl pl-2">
      <div className="flex flex-row justify-between">
        <Image className="rounded-3xl ps-8 -translate-y-6 w-" src={cardImg} alt="eo thich" width={160} height={160} />
        <button className="bg-[#7463F0] w-14 h-14 rounded-tr-3xl rounded-bl-3xl">
          <PlayOne theme="outline" size="24" fill="#FFFFFF" className="m-auto inline-block" />
        </button>
      </div>

      <h3 className="font-bold text-2xl">{nameCard}</h3>
      <div className="rating">
        <StarOne theme="outline" size="16" fill="#EBFF00" className="inline-block mr-2" />
        <span className="mr-2">{rating}</span>
        <span className="text-slate-700 font-bold">({totalVote})</span>
      </div>
      <p className="font-sans">Yêu anh đi em anh k đòi quà!</p>
      <Github theme="outline" size="16" fill="#7463F0" className="inline-block mr-2" />
      <p className="font-sans inline-block mr-2">
        <span className="font-bold text-2xl">10</span>.00 /1 giờ
      </p>
      <span className="my-4 block"></span>
    </div>
  )
}
