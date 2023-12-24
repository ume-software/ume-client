import { Socket, io } from 'socket.io-client'
import { getEnv } from '~/env'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useAuth } from './auth'

import { getSocket } from '~/utils/constants'

interface MesageProps {
  content: string
  sentAt: string
  channelId: string
  senderId: string
}

interface ChattingContext {
  socket: Socket
  channelId?: string
  setChannelId: (newChannelId: string) => void
  messages?: MesageProps[]
  setMessages: (newMessages: MesageProps[]) => void
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
})

export const SocketChattingProvider = (props: any) => {
  const { user } = useAuth()
  let token

  const [channelId, setChannelId] = useState<string>('')
  const [messages, setMessages] = useState<MesageProps[]>([])

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
    }),
    [channelId, messages, socket],
  )

  useEffect(() => {
    socket.on(
      getSocket().SOCKER_CHATTING_SERVER_EMIT.MESSAGE_FROM_CHANNEL,
      ({ content, channelId, sentAt, senderId }) => {
        setMessages((messages) => [...messages, { content, channelId, sentAt, senderId }])
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

export const useSockets = () => useContext(SocketChattingContext)
