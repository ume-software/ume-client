import { ArrowLeft, FullScreen, Search } from '@icon-park/react'
import { InputWithAffix, TextInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { useAuth } from '~/contexts/auth'

import { useContext, useEffect, useId, useState } from 'react'

import Image from 'next/legacy/image'
import { ChattingChannelResponse, MemberChatChannelResponse, MessageResponse } from 'ume-chatting-service-openapi'

import ChatContent from './chat-content'

import { ChatSkeleton } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const Chat = (props: { playerId?: string }) => {
  // const index = useId()
  const [searchText, setSearchTextt] = useState('')
  const { user } = useAuth()
  const {
    data: chattingChannels,
    isLoading: loadingChattingChannels,
    isFetching,
  } = trpc.useQuery(['chatting.getListChattingChannels', { limit: 'unlimited', page: '1' }])
  const [filterChannel, setFilterChannel] = useState<ChattingChannelResponse[] | undefined>([])

  const [channelSelected, setChannelSelected] = useState<ChattingChannelResponse | undefined>({
    _id: props.playerId,
  } as any)

  const handleSelected = (id: string) => {
    setChannelSelected(chattingChannels?.data.row.find((item) => item._id == id))
  }

  useEffect(() => {
    const filtered = chattingChannels?.data.row.filter((data) => {
      return data.members.some((member) => {
        return member.userInformation.name.toLowerCase().includes(searchText.toLowerCase())
      })
    })
    setFilterChannel(filtered)
  }, [chattingChannels?.data.row, searchText])

  return (
    <>
      {loadingChattingChannels ? (
        <ChatSkeleton />
      ) : (
        <>
          {chattingChannels && chattingChannels?.data.row.length != 0 ? (
            <div className="w-full h-full grid grid-cols-10 pl-5 pr-5">
              <div className="relative col-span-3 overflow-y-auto hide-scrollbar border-r-2 border-[#B9B8CC]">
                <div className="absolute top-0 left-0 right-0 bg-[#15151b] mx-0 z-50">
                  <InputWithAffix
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    type="text"
                    name="messageSearch"
                    onChange={(e) => setSearchTextt(e.target.value)}
                    className="bg-[#37354F] rounded-xl border my-2"
                    styleInput={`bg-[#37354F] rounded-xl border-none focus:outline-none`}
                    iconStyle="border-none"
                    position="left"
                    component={<Search theme="outline" size="20" fill="#fff" />}
                  />
                </div>
                <div className="h-full mt-16 hide-scrollbar flex flex-col overflow-y-auto overflow-x-hidden">
                  {filterChannel?.map((item, index) => {
                    const latestMeassge: MessageResponse | null = item.messages.length
                      ? item.messages[item.messages.length - 1]
                      : null
                    const otherMemberInfo: Array<MemberChatChannelResponse> = []
                    let seftMemberInfo: MemberChatChannelResponse | null = null
                    for (let index = 0; index < item.members.length; index++) {
                      const member = item.members[index]
                      if (member.userId.toString() != user?.id.toString()) {
                        otherMemberInfo.push(member)
                      } else {
                        seftMemberInfo = member
                      }
                    }

                    const isMe = item.messages[0]?.senderId
                      ? item.messages[0]?.senderId.toString() == user?.id.toString()
                      : false

                    const isReadedLatestMessage =
                      latestMeassge && latestMeassge.sentAt < seftMemberInfo?.lastReadAt! ? true : false

                    return (
                      <div
                        key={index}
                        className={`flex py-2 px-2 my-2 items-center cursor-pointer
                ${
                  channelSelected?._id === item._id ? 'border-l-3 bg-gray-700 rounded-lg' : ''
                }  hover:bg-gray-700 hover:rounded-lg`}
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
                              src={otherMemberInfo[0].userInformation.avatarUrl}
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <div className="w-full px-2">
                          <p className="w-4/5 text-lg font-semibold truncate">
                            {otherMemberInfo[0].userInformation.name}
                          </p>
                          <p className={`text-gray-500 truncate ${isReadedLatestMessage ? 'font-medium' : ''}`}>
                            {latestMeassge && isMe && 'Bạn: '} {latestMeassge?.content}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="col-span-7 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col pl-5 pr-5 pb-5 gap-2">
                  {channelSelected?._id && <ChatContent key={channelSelected?._id} channel={channelSelected} />}
                </div>
              </div>
            </div>
          ) : (
            <div>Chưa có tin nhắn mới</div>
          )}
        </>
      )}
    </>
  )
}
export default Chat
