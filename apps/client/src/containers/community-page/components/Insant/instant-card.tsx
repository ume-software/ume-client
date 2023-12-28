import { CustomDrawer } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import Chat from '~/containers/chat/chat.container'
import { useAuth } from '~/contexts/auth'

import { useContext, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { InstantCardResponse } from 'ume-service-openapi'

import { backgroundColors } from './bg-color-instant-card'

import { LoginModal } from '~/components/header/login-modal.component'
import { DrawerContext } from '~/components/layouts/app-layout/app-layout'
import { ChatSkeleton } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const InstantCard = (props: { data: InstantCardResponse }) => {
  const { user } = useAuth()
  const accessToken = localStorage.getItem('accessToken')

  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  const createNewChatChannel = trpc.useMutation(['chatting.createNewChatChannel'])

  const handleChatOpen = async (channelId: string) => {
    if (user) {
      setChildrenDrawer(<ChatSkeleton />)
      try {
        createNewChatChannel.mutate(
          {
            receiverId: channelId,
          },
          {
            onSuccess: (data) => {
              setChildrenDrawer(<Chat providerId={data.data._id} />)
            },
            onError: (error) => {
              notification.error({
                message: 'Create New Channel Fail',
                description: 'Create New Channel Fail. Please try again!',
                placement: 'bottomLeft',
              })
            },
          },
        )
      } catch (error) {
        notification.error({
          message: 'Create New Channel Fail',
          description: 'Create New Channel Fail. Please try again!',
          placement: 'bottomLeft',
        })
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      <div
        className={`${
          backgroundColors.find((bgColor) => bgColor.key == props.data.gradientColors)?.color
        } min-h-72 h-full p-5 rounded-xl flex flex-col justify-between`}
      >
        <div className="flex flex-col space-y-3">
          <Link
            href={`/profile/${props.data.user?.slug ?? props.data.user?.id}`}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Image
              src={props.data?.user?.avatarUrl ?? ImgForEmpty}
              width={30}
              height={30}
              className="rounded-full"
              alt="avatar-url"
            />
            <p className="text-lg font-semibold group-hover:underline">{props.data?.user?.name}</p>
          </Link>
          <span>{props.data.content}</span>
        </div>
        <div>
          {props.data?.instantCardHashTags?.map((hashtag) => (
            <div
              key={hashtag.hashTagId}
              className="inline-block text-white text-sm font-semibold mr-3 mb-3 p-2 rounded-lg bg-white bg-opacity-20"
            >
              {hashtag.hashTag.content}
            </div>
          ))}
        </div>
        {props.data.userId != user?.id && (
          <CustomDrawer
            customOpenBtn={`rounded-full text-white bg-white bg-opacity-30 border-2 border-white border-opacity-20 font-semibold text-lg cursor-pointer hover:scale-105 text-center`}
            openBtn={
              <button
                className="w-full h-full flex items-center justify-center bg-transparent focus:outline-none"
                type="button"
                onClick={() => handleChatOpen(props.data?.userId ?? '')}
              >
                {createNewChatChannel.isLoading && (
                  <div
                    className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent dark:border-navy-300 dark:border-r-transparent border-white`}
                  />
                )}
                Chat
              </button>
            }
            token={!!accessToken}
          >
            {childrenDrawer}
          </CustomDrawer>
        )}
      </div>
    </>
  )
}
export default InstantCard
