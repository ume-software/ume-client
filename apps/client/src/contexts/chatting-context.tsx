import { Socket, io } from 'socket.io-client'
import { getEnv } from '~/env'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { UserInformationResponse } from 'ume-chatting-service-openapi/dist/api'

import { useAuth } from './auth'

import { getSocket } from '~/utils/constants'
import { CallEnum } from '~/utils/enumVariable'

interface MesageProps {
  content: string
  sentAt: string
  channelId: string
  senderId: string
}

interface EndCallProps {
  type: string
  channelId: string
  senderId: string
  socketId: string
}

interface CallProps {
  channelName: string
  rtcToken: string
  uid: number
  userInformation: UserInformationResponse
}

interface ChattingContext {
  socket: Socket
  channelId?: string
  setChannelId: (newChannelId: string) => void
  messages?: MesageProps[]
  setMessages: (newMessages: MesageProps[]) => void
  newCall?: CallProps
  setNewCall: (newCalling?: CallProps) => void
  endCallType?: EndCallProps
  setEndCallType: (cancel?: EndCallProps) => void
}

const createSocket = (token: string): Socket =>
  io(getEnv().baseSocketChattingURL, {
    reconnection: false,
    secure: true,
    rejectUnauthorized: false,
    auth: {
      authorization: `Bearer ${token}`,
    },
    path: '/chatting-service/socket/',
  })

const SocketChattingContext = createContext<ChattingContext>({
  socket: {} as Socket,
  setChannelId: () => false,
  setMessages: () => false,
  setNewCall: () => false,
  setEndCallType: () => false,
})

export const SocketChattingProvider = (props: any) => {
  const { user } = useAuth()
  let token

  const [channelId, setChannelId] = useState<string>('')
  const [messages, setMessages] = useState<MesageProps[]>([])
  const [newCall, setNewCall] = useState<CallProps | undefined>(undefined)
  const [endCallType, setEndCallType] = useState<any>(undefined)

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken')
  }

  const socket = createSocket(token)

  const contextValue = useMemo(
    () => ({
      socket,
      channelId,
      setChannelId: (newChannelId: string) => setChannelId(newChannelId),
      messages,
      setMessages: (newMessages: MesageProps[]) => setMessages(newMessages),
      newCall,
      setNewCall: (newCalling: CallProps) => setNewCall(newCalling),
      endCallType,
      setEndCallType: (cancel: any) => setEndCallType(cancel),
    }),
    [endCallType, channelId, messages, newCall, socket],
  )

  useEffect(() => {
    socket.on(
      getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL,
      ({ content, channelId, sentAt, senderId }) => {
        setMessages((messages) => [...messages, { content, channelId, sentAt, senderId }])
      },
    )
    socket.on(
      getSocket().SOCKER_CHATTING_SERVER_EMIT.CALL_FROM_CHANNEL,
      ({ channelName, rtcToken, uid, userInformation }) => {
        setNewCall({ channelName, rtcToken, uid, userInformation })
      },
    )
    socket.on(
      getSocket().SOCKER_CHATTING_SERVER_EMIT.SOMEONE_CANCEL_CALL_CHANNEL,
      ({ channelId, senderId, socketId }) => {
        setEndCallType({ type: CallEnum.CANCEL, channelId, senderId, socketId })
      },
    )
    socket.on(
      getSocket().SOCKER_CHATTING_SERVER_EMIT.SOMEONE_LEAVE_CALL_CHANNEL,
      ({ channelId, senderId, socketId }) => {
        setEndCallType({ type: CallEnum.LEAVE, channelId, senderId, socketId })
      },
    )
  }, [socket, user])

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [socket])

  return <SocketChattingContext.Provider value={contextValue}>{props.children}</SocketChattingContext.Provider>
}

export const useChattingSockets = () => useContext(SocketChattingContext)
