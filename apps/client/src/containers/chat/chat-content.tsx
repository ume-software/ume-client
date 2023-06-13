import { GrinningFaceWithOpenMouth, MoreOne, PhoneTelephone, Picture, Videocamera } from '@icon-park/react'

import { ReactNode, useContext, useEffect, useState } from 'react'

import Image from 'next/legacy/image'

import ChatService from './chat-service'
import { trpc } from '~/utils/trpc'
import { ChattingChannelReponse, MemberChatChannelResponse } from 'ume-chatting-service-openapi'
import { UserContext } from '~/components/layouts/app-layout/app-layout'

interface actionButtonProps {
  actionButton: ReactNode
}

const actionButtons: actionButtonProps[] = [
  {
    actionButton: <Videocamera theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
  },
  {
    actionButton: <PhoneTelephone theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
  },
  { actionButton: <MoreOne theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" /> },
]
const convertArrayObjectToObject = (input: Array<any>, key: string = "_id") => {
  return input.reduce((acc, obj) => {
    acc[obj[key]] = obj;
    return acc;
  }, {});
}
const ChatContent = (props: { channel: ChattingChannelReponse }) => {
  const [gameSelected, setGameSelected] = useState(0);
  const { userContext, setUserContext } = useContext(UserContext)

  const {
    data: chattingMessageChannel,
    isLoading: loadingChattingMessageChannel,
    isFetching,
  } = trpc.useQuery(['chatting.getMessagesByChannelId', { channelId: props.channel._id, limit: "unlimited", page: "1" }])
  if (loadingChattingMessageChannel) {
    return <></>
  }
  const mappingMember: { [key: string]: MemberChatChannelResponse } = convertArrayObjectToObject(chattingMessageChannel?.data.members || [], "userId")

  const images = (chattingMessageChannel?.data.members.filter(member => {
    return member.userId.toString() != userContext?.id.toString();
  }))!

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-[60px] h-[60px]">
            <Image
              className="absolute rounded-full"
              layout="fill"
              objectFit="cover"
              src={images[0].userInfomation.avatarUrl!}
              alt="Avatar"
            />
          </div>
          <span className=" font-bold text-white text-3xl">{images[0].userInfomation.name || ""}</span>
        </div>
        <div className="flex gap-2">
          {actionButtons.map((item, index) => (
            <div
              key={index}
              className="p-2 bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400"
            >
              {item.actionButton}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex border-b-2 pb-5 gap-2 overflow-auto hide-scrollbar">
          {/* {props.data?.providerSkills?.map((providerSkill, index) => (
            <div
              key={index}
              className={`px-5 text-center rounded-2xl border-2 cursor-pointer ${gameSelected === index ? 'bg-purple-600 border-indigo-900' : 'bg-[#413F4D]'
                }`}
              onClick={() => setGameSelected(index)}
            >
              <p className=" font-medium text-white text-lg whitespace-nowrap">{providerSkill.skill.name}</p>
            </div>
          ))} */}
        </div>
        <div className="bg-[#413F4D] p-2 rounded-3xl">
          {/* <ChatService serviceData={props.data?.providerSkills[gameSelected]} /> */}
        </div>
        <div className="h-[450px] overflow-y-auto flex flex-col justify-end">

          {/* <!-- message --> */}
          <div className="w-full px-5 flex flex-col justinfy-between">
            <div className="flex flex-col mt-5 ">
              {
                chattingMessageChannel?.data.messages.map(item => {

                  const sender = mappingMember[item.senderId];
                  const isSeftMessage = sender.userId.toString() == userContext?.id.toString() ? true : false
                  return (
                    <div className={`flex justify-end  ${!isSeftMessage ? "flex-row-reverse" : ""} mb-4`}>
                      <div
                        className={`mx-2 py-3 px-4  
                        ${isSeftMessage ? " bg-blue-400  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl" :
                            "bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl"}
                       text-white`}
                      >
                        {item.content}
                      </div>

                      <div className="relative h-8 w-8 ">
                        <Image
                          className="rounded-full"
                          layout="fill"
                          objectFit="cover"
                          height={600}
                          width={600}
                          src={sender.userInfomation.avatarUrl}
                          alt="Avatar"
                        />
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
          {/* <!-- end message --> */}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] p-2 content-center bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
            <Picture theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
          </div>
          <div className="w-[100%] h-[40px] relative">
            <input
              type="text"
              className="h-[40px] w-[100%] bg-[#413F4D] text-white text-lg font-medium px-5 border-1 border-solid border-[#B9B8CC] rounded-full"
              placeholder="Nhập tin nhắn"
            />
            <div className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer z-4 hover:bg-gray-500 active:bg-gray-400 rounded-full">
              <GrinningFaceWithOpenMouth theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ChatContent
