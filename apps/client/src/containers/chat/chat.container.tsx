import { Search } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'
import { useAuth } from '~/contexts/auth'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import { ChattingChannelResponse, MemberChatChannelResponse, MessageResponse } from 'ume-chatting-service-openapi'

import ChatContent from './chat-content'

import { ChatSkeleton } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const Chat = (props: { providerId?: string }) => {
  const [searchText, setSearchText] = useState<string>('')
  const { user } = useAuth()
  const { data: chattingChannels, isLoading: loadingChattingChannels } = trpc.useQuery([
    'chatting.getListChattingChannels',
    { limit: 'unlimited', page: '1' },
  ])
  const [filterChannel, setFilterChannel] = useState<ChattingChannelResponse[]>([])

  const [channelSelected, setChannelSelected] = useState<ChattingChannelResponse | undefined>({
    _id: props.providerId,
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
    setFilterChannel(filtered ?? [])
  }, [chattingChannels?.data.row, searchText])

  return (
    <>
      {loadingChattingChannels ? (
        <ChatSkeleton />
      ) : (
        <>
          {chattingChannels && chattingChannels?.data.row.length != 0 ? (
            <div className="grid w-full h-full grid-cols-10 pl-5 pr-5">
              <div className="relative col-span-3 overflow-y-auto hide-scrollbar border-r-2 border-[#B9B8CC]">
                <div className="absolute top-0 left-0 right-0 bg-[#15151b] mx-0 z-50">
                  <InputWithAffix
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    type="text"
                    name="messageSearch"
                    onChange={(e) => setSearchText(e.target.value)}
                    className="bg-[#37354F] rounded-xl border my-2"
                    styleInput={`bg-[#37354F] rounded-xl border-none focus:outline-none`}
                    iconStyle="border-none"
                    position="left"
                    component={<Search theme="outline" size="20" fill="#fff" />}
                  />
                </div>
                <div className="flex flex-col h-full mt-16 overflow-x-hidden overflow-y-auto hide-scrollbar">
                  {filterChannel?.map((item, index) => {
                    const latestMeassge: MessageResponse | null = item.messages.length
                      ? item.messages[item.messages.length - 1]
                      : null
                    const otherMemberInfo: Array<MemberChatChannelResponse> = []
                    let seftMemberInfo: MemberChatChannelResponse | null = null

                    for (const member of item.members) {
                      if (member.userId.toString() != user?.id.toString()) {
                        otherMemberInfo.push(member)
                      } else {
                        seftMemberInfo = member
                      }
                    }

                    const isMe = item.messages[0]?.senderId
                      ? item.messages[0]?.senderId.toString() == user?.id.toString()
                      : false

                    const isReadedLatestMessage = latestMeassge && latestMeassge.sentAt < seftMemberInfo?.lastReadAt!

                    return (
                      <div
                        key={index}
                        className={`flex py-2 px-2 my-2 items-center cursor-pointer
                ${
                  channelSelected?._id === item._id ? 'border-l-3 bg-gray-700 rounded-lg' : ''
                }  hover:bg-gray-700 hover:rounded-lg`}
                        onClick={() => handleSelected(item._id)}
                        onKeyDown={() => {}}
                      >
                        <div className="w-1/4">
                          <div className="relative w-12 h-12">
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
                <div className="flex flex-col gap-2 pb-5 pl-5 pr-5">
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
