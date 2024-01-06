import { z } from 'zod'

import { createRouter } from './configurations'
import {
  createNewChatChannel,
  getListChattingChannels,
  getMessagesByChannelId,
  getTokenForVideoCall,
} from './services/chatting-service'

export const chattingRouter = createRouter()
  .query('getListChattingChannels', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getListChattingChannels(input, ctx)
    },
  })
  .query('getMessagesByChannelId', {
    input: z.object({
      channelId: z.string(),
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getMessagesByChannelId(input, ctx)
    },
  })
  .mutation('createNewChatChannel', {
    input: z.object({
      receiverId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await createNewChatChannel(input, ctx)
    },
  })
  .query('getTokenForVideoCall', {
    input: z.object({
      channelId: z.string(),
      privilegeExpireTime: z.number(),
    }),
    resolve: async ({ ctx, input }) => {
      return await getTokenForVideoCall(input, ctx)
    },
  })
