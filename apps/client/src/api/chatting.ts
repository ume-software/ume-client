import { resolve } from 'path'
import { CreateChannelRequest } from 'ume-chatting-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import { createNewChatChannel, getListChattingChannels, getMessagesByChannelId } from './services/chatting-service'

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
