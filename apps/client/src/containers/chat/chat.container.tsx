import { ArrowLeft, FullScreen, Search } from '@icon-park/react'
import { TextInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useContext, useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import {
  ChattingChannelPagingResponse,
  ChattingChannelReponse,
  MemberChatChannelResponse,
  MessageResponse,
} from 'ume-chatting-service-openapi'

import ChatContent from './chat-content'

import { SocketContext, UserContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const Chat = (props: { playerId?: string }) => {
  const [searchTex, setSearchText] = useState('')
  const { userContext, setUserContext } = useContext(UserContext)
  const [channelSelected, setChannelSelected] = useState<ChattingChannelReponse | undefined>(
    ({ _id: props.playerId } as any) || undefined,
  )
  const {
    data: chattingChannels,
    isLoading: loadingChattingChannels,
    isFetching,
  } = trpc.useQuery(['chatting.getListChattingChannels', { limit: 'unlimited', page: '1' }])

  const handleSelected = (id) => {
    setChannelSelected(chattingChannels?.data.row.find((item) => item._id == id))
  }

  return (
    <>
      {chattingChannels && chattingChannels?.data.row.length != 0 ? (
        <div className="w-full h-[90vh] grid grid-cols-10 pl-5 pr-5">
          <div className="h-[90vh] col-span-3 border-light-700">
            <div className="flex items-center justify-center mb-5">
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
            <div className="h-full hide-scrollbar flex flex-col border-r-2 overflow-y-auto">
              {chattingChannels?.data.row.map((item, index) => {
                const latestMeassge: MessageResponse | null = item.messages.length
                  ? item.messages[item.messages.length - 1]
                  : null
                const otherMemberInfo: Array<MemberChatChannelResponse> = []
                let seftMemberInfo: MemberChatChannelResponse | null = null
                for (let index = 0; index < item.members.length; index++) {
                  const member = item.members[index]
                  if (member.userId.toString() != userContext?.id.toString()) {
                    otherMemberInfo.push(member)
                  } else {
                    seftMemberInfo = member
                  }
                }
                const isReadedLatestMessage =
                  latestMeassge && latestMeassge.sentAt < seftMemberInfo?.lastReadAt! ? true : false
                return (
                  <div
                    key={index}
                    className={`flex flex-row py-4 px-2 items-center border-b-2 border-gray-700 cursor-pointer 
                ${channelSelected?._id == item._id ? 'border-l-3 border-gray-500' : ''}`}
                    onClick={() => handleSelected(item._id)}
                  >
                    <div className="w-1/4">
                      <div className="relative h-12 w-12">
                        <Image
                          className="rounded-full"
                          layout="fill"
                          objectFit="cover"
                          height={600}
                          width={600}
                          src={otherMemberInfo[0].userInfomation.avatarUrl}
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="w-full px-2">
                      <div className="text-lg font-semibold">{otherMemberInfo[0].userInfomation.name}</div>
                      <span className={`text-gray-500 ${isReadedLatestMessage ? 'font-medium' : ''}`}>
                        {latestMeassge?.content}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="h-[85vh] col-span-7 overflow-y-auto hide-scrollbar">
            <div className="h-[85vh] flex flex-col pl-5 pr-5 pb-5 gap-2">
              {channelSelected?._id && <ChatContent key={channelSelected?._id} channel={channelSelected} />}
            </div>
          </div>
        </div>
      ) : (
        <div>Chưa có tin nhắn mới</div>
      )}
    </>
  )
}
export default Chat
