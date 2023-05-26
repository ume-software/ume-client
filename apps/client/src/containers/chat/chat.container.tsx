import { ArrowLeft, FullScreen, Search } from '@icon-park/react'
import { TextInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useState } from 'react'

import Image from 'next/legacy/image'

import ChatContent from './chat-content'

interface channelProps {
  id: number
  imgSrc?: any
  nameChannel?: string
  name?: string
  channelType: string
  members: { id: number; name: string; joinAt: Date; lastRead: Date }[]
  messages: { id: number; content: string; sendAt: Date }[]
  services?: { gameImg: any; name: string; cost: number }[]
}

const channelData: channelProps[] = [
  {
    id: 1,
    nameChannel: 'Channel 1',
    channelType: 'public',
    imgSrc: ImgForEmpty,
    members: [
      {
        id: 1,
        name: 'John',
        joinAt: new Date('2023-04-15T10:30:00Z'),
        lastRead: new Date('2023-04-16T15:45:00Z'),
      },
      {
        id: 2,
        name: 'Alice',
        joinAt: new Date('2023-04-15T10:30:00Z'),
        lastRead: new Date('2023-04-17T08:20:00Z'),
      },
      {
        id: 3,
        name: 'Bob',
        joinAt: new Date('2023-04-16T09:15:00Z'),
        lastRead: new Date('2023-04-17T12:10:00Z'),
      },
    ],
    messages: [
      {
        id: 1,
        content: 'Hello everyone!',
        sendAt: new Date('2023-04-15T11:05:00Z'),
      },
      {
        id: 2,
        content: 'How are you all?',
        sendAt: new Date('2023-04-15T11:25:00Z'),
      },
      {
        id: 3,
        content: 'Any plans for the weekend?',
        sendAt: new Date('2023-04-16T14:30:00Z'),
      },
    ],
    services: [
      { gameImg: ImgForEmpty, name: 'Valorant', cost: 2 },
      { gameImg: ImgForEmpty, name: 'Valorant', cost: 3 },
      { gameImg: ImgForEmpty, name: 'Valorant', cost: 4 },
    ],
  },
  {
    id: 2,
    nameChannel: 'Channel 2',
    channelType: 'public',
    imgSrc: ImgForEmpty,
    members: [
      {
        id: 1,
        name: 'John',
        joinAt: new Date('2023-04-17T09:40:00Z'),
        lastRead: new Date('2023-04-17T11:55:00Z'),
      },
      {
        id: 4,
        name: 'Sarah',
        joinAt: new Date('2023-04-17T09:40:00Z'),
        lastRead: new Date('2023-04-17T13:30:00Z'),
      },
      {
        id: 5,
        name: 'Michael',
        joinAt: new Date('2023-04-18T14:20:00Z'),
        lastRead: new Date('2023-04-18T16:45:00Z'),
      },
    ],
    messages: [
      {
        id: 1,
        content: 'Welcome to Channel 2!',
        sendAt: new Date('2023-04-17T10:05:00Z'),
      },
      {
        id: 2,
        content: "Let's discuss the new project.",
        sendAt: new Date('2023-04-17T11:30:00Z'),
      },
      {
        id: 3,
        content: 'Any suggestions?',
        sendAt: new Date('2023-04-18T15:10:00Z'),
      },
    ],
    services: [
      { gameImg: ImgForEmpty, name: 'Valorant', cost: 6 },
      { gameImg: ImgForEmpty, name: 'Valorant', cost: 1 },
      // { gameImg: ImgForEmpty, name: 'Valorant', cost: 5 },
    ],
  },
]
const Chat = () => {
  const [searchTex, setSearchText] = useState('')
  const [channelSelected, setChannelSelected] = useState(0)

  const handleSelected = (index) => {
    setChannelSelected(index)
  }
  return (
    <>
      <div className="w-full grid grid-cols-10">
        <div className="bg-zinc-800 h-screen col-span-3 border-r-2 border-light-700">
          <div className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
            <ArrowLeft theme="outline" size="24" fill="#fff" />
          </div>
          <div className="flex items-center justify-center">
            <Search
              theme="outline"
              size="32"
              fill="#fff"
              className="p-2 mt-2 mr-2 rounded-full hover:bg-gray-700 active:bg-gray-500"
            />
            <TextInput
              placeholder="Tìm kiếm..."
              value={searchTex}
              type="text"
              name="categorySearch"
              onChange={(e) => setSearchText(e.target.value)}
              className="text-white w-full"
            />
          </div>
          <div className="transition-transform -translate-x-full sm:translate-x-0">
            {channelData.map((item, index) => (
              <div
                key={index}
                className={`flex flex-row items-center gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                  channelSelected == index ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleSelected(index)}
              >
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    className="absolute rounded-full"
                    layout="fill"
                    objectFit="cover"
                    src={item.imgSrc}
                    alt="Avatar"
                  />
                </div>
                <p className="w-[200px] h-[28px] font-nunito font-semibold text-xl truncate text-white z-[4]">
                  {item.nameChannel ? item.nameChannel : item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-7">
          <div className="flex flex-col gap-8">
            <div className="bg-zinc-800 p-10">
              <div className="flex flex-col gap-10">
                <ChatContent datas={channelData[channelSelected]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Chat
