import { ArrowLeft, ArrowRight } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import cover from 'public/cover.png'
import { SocketContext } from '~/api/socket'
import Chat from '~/containers/chat/chat.container'

import { useContext, useState } from 'react'

import Image, { StaticImageData } from 'next/legacy/image'

import { drawerContext } from '../layouts/app-layout/app-layout'

interface chatProps {
  imgSrc: string | StaticImageData
  name: string
  message?: {
    player?: { context: any; time: Date }[]
    me?: { context: any; time: Date }[]
  }
}

const chatTest: chatProps[] = [
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
]
export const Sidebar = (props) => {
  const socket = useContext(SocketContext)

  const { childrenDrawer, setChildrenDrawer } = useContext(drawerContext)
  const handleChatOpen = () => {
    setChildrenDrawer(<Chat />)
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 pt-10">
        <CustomDrawer
          customOpenBtn={`p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400`}
          openBtn={<ArrowLeft theme="outline" size="40" fill="#fff" onClick={handleChatOpen} />}
        >
          {childrenDrawer}
        </CustomDrawer>
        <div className="flex flex-col gap-3">
          {chatTest.map((item, index) => (
            <div key={index} className="w-[60px] h-[60px] relative">
              <Image
                className="absolute rounded-full"
                layout="fill"
                objectFit="cover"
                key={index}
                src={item.imgSrc}
                alt="avatar"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
