import { ArrowLeft } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import cover from 'public/cover.png'
import Chat from '~/containers/chat/chat.container'

import { useContext, useEffect, useState } from 'react'

import Image, { StaticImageData } from 'next/legacy/image'

import { LoginModal } from '../header/login-modal.component'
import { SocketTokenContext, UserContext, drawerContext } from '../layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

interface chatProps {
  imgSrc: string | StaticImageData
  name: string
  message?: {
    player?: { context: any; time: Date }[]
    me?: { context: any; time: Date }[]
  }
}

export const Sidebar = (props) => {
  const { childrenDrawer, setChildrenDrawer } = useContext(drawerContext)
  const { userContext, setUserContext } = useContext(UserContext)
  const { socketToken } = useContext(SocketTokenContext)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const {
    data: chattingChannels,
    isLoading: loadingChattingChannels,
    isFetching,
  } = trpc.useQuery(['chatting.getListChattingChannels', { limit: '5', page: '1' }])

  useEffect(() => {
    if (socketToken) {
      setIsModalLoginVisible(false)
    }
  }, [socketToken])

  const handleChatOpen = (id?: string) => {
    if (socketToken) {
      setChildrenDrawer(<Chat playerId={id} />)
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 px-4 pt-10">
        <CustomDrawer
          customOpenBtn={`p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400`}
          openBtn={
            <div onClick={() => handleChatOpen()}>
              <ArrowLeft theme="outline" size="30" fill="#fff" />
            </div>
          }
          token={!!socketToken}
        >
          {childrenDrawer}
        </CustomDrawer>
        <div className="flex flex-col gap-3">
          {socketToken &&
            chattingChannels?.data.row.map((item, index) => {
              const images = item.members.filter((member) => {
                return member.userId.toString() != userContext?.id.toString()
              })
              return (
                <div key={item._id} className="relative w-14 h-14">
                  <CustomDrawer
                    customOpenBtn={`cursor-pointer`}
                    openBtn={
                      <Image
                        className="absolute rounded-full"
                        layout="fill"
                        objectFit="cover"
                        key={item._id}
                        src={images[0].userInfomation.avatarUrl}
                        alt="avatar"
                        onClick={() => handleChatOpen(item._id)}
                      />
                    }
                  >
                    {childrenDrawer}
                  </CustomDrawer>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}
