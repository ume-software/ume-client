import { ArrowLeft, Dot } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import Chat from '~/containers/chat/chat.container'

import { useContext, useEffect, useState } from 'react'

import { parse } from 'cookie'
import { isNil } from 'lodash'
import Image from 'next/legacy/image'
import { UserInformationResponse } from 'ume-service-openapi'

import { LoginModal } from '../header/login-modal.component'
import { DrawerContext, SocketContext } from '../layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

export const Sidebar = () => {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  let accessToken
  if (typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem('accessToken')
  }
  const { socketContext, setSocketContext } = useContext(SocketContext)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const utils = trpc.useContext()

  const [userInfo, setUserInfo] = useState<UserInformationResponse>()

  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
    },
    enabled: isNil(userInfo),
  })

  const { data: chattingChannels } = trpc.useQuery(['chatting.getListChattingChannels', { limit: '5', page: '1' }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: !!accessToken || !!userInfo,
  })

  useEffect(() => {
    if (userInfo) {
      setIsModalLoginVisible(false)
    }
  }, [userInfo])

  const handleChatOpen = (channelId?: string) => {
    if (userInfo) {
      setChildrenDrawer(<Chat providerId={channelId} />)
      if (channelId) {
        setSocketContext((prevState) => ({
          ...prevState,
          socketContext: {
            ...prevState,
            socketChattingContext: [],
          },
        }))
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  useEffect(() => {
    if (socketContext.socketChattingContext) {
      utils.invalidateQueries('chatting.getListChattingChannels')
      setShowMessage(true)
      const timeout = setTimeout(() => {
        setShowMessage(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext?.socketChattingContext[0]?.channelId, !!accessToken])

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 px-4 pt-10">
        <CustomDrawer
          customOpenBtn={`p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400`}
          openBtn={
            <div
              onClick={() => handleChatOpen()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleChatOpen()
                }
              }}
            >
              <ArrowLeft theme="outline" size="30" fill="#fff" />
            </div>
          }
          token={!!accessToken}
        >
          {childrenDrawer}
        </CustomDrawer>
        <div className="flex flex-col gap-3">
          {!!accessToken &&
            !!userInfo &&
            chattingChannels?.data.row.map((item) => {
              const images = item.members.filter((member) => {
                return member.userId.toString() != userInfo?.id.toString()
              })

              return (
                <div key={item._id} className="relative">
                  <CustomDrawer
                    openBtn={
                      <div>
                        {item._id === socketContext?.socketChattingContext[0]?.channelId &&
                        socketContext?.socketChattingContext[0]?.senderId !== userInfo?.id ? (
                          <>
                            <div className="relative">
                              <Dot
                                className="absolute top-0 left-0 z-10"
                                theme="filled"
                                size="20"
                                fill="#FF0000"
                                strokeLinejoin="bevel"
                              />
                            </div>
                            {showMessage && (
                              <div className="max-w-xs absolute top-2 bottom-2 right-[60px] p-2 bg-purple-700 rounded-lg text-white">
                                <p className="truncate">{socketContext?.socketChattingContext[0]?.content}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        <div className={`relative w-14 h-14`}>
                          <Image
                            className="absolute rounded-full"
                            layout="fill"
                            objectFit="cover"
                            src={images[0].userInformation.avatarUrl}
                            alt="avatar"
                            onClick={() => handleChatOpen(item._id)}
                          />
                        </div>
                      </div>
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
