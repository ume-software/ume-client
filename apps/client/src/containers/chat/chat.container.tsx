import { Search } from '@icon-park/react'
import { TextInput } from '@ume/ui'

import { useContext, useState } from 'react'

import Image from 'next/legacy/image'
import { ChattingChannelReponse, MemberChatChannelResponse, MessageResponse } from 'ume-chatting-service-openapi'

import ChatContent from './chat-content'

import { UserContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

interface ChanelProps {
  channelId?: string
}

const Chat = (props: ChanelProps) => {
  const [searchTex, setSearchText] = useState('')
  const { userContext, setUserContext } = useContext(UserContext)
  const [channelSelected, setChannelSelected] = useState<ChattingChannelReponse | undefined>(
    ({ _id: props.channelId } as any) || undefined,
  )
  const {
    data: chattingChannels,
    isLoading: loadingChattingChannels,
    isFetching,
  } = trpc.useQuery(['chatting.getListChattingChannels', { limit: 'unlimited', page: '1' }])
  if (loadingChattingChannels) {
    return <></>
  }

  const handleSelected = (id) => {
    setChannelSelected(chattingChannels?.data.row.find((item) => item._id == id))
  }

  return (
    <>
      <div className="grid w-full grid-cols-10 pl-5 pr-5">
        <div className="h-full col-span-3 border-light-700">
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
              className="w-full text-white"
            />
          </div>
          <div className="flex flex-col h-full overflow-y-auto border-r-2 hide-scrollbar">
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
                  className={`flex flex-row py-4 px-2 items-center border-b-2 border-gray-700 cursor-pointer 
                ${channelSelected?._id == item._id ? 'border-l-3 border-gray-500' : ''}`}
                  onClick={() => handleSelected(item._id)}
                >
                  <div className="w-1/4">
                    <div className="relative w-12 h-12">
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
            FF
          </div>
        </div>
        <div className="col-span-7">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5 pl-5 pr-5">
              {channelSelected?._id && <ChatContent channel={channelSelected} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Chat
