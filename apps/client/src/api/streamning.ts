import { z } from 'zod'

import { createRouter } from './configurations'
import { createNewstreamChannel, getListStreamChannels, getLiveStreamChannelById } from './services/streaming-service'

export const streamingRouter = createRouter()
    .query('getListStreamChannels', {
        input: z.object({
            limit: z.string(),
            page: z.string(),
        }),
        resolve: async ({ ctx, input }) => {
            return await getListStreamChannels(input, ctx)
        },
    })
    .query('getLiveStreamChannelById', {
        input: z.object({
            channelId: z.string(),
            limit: z.string(),
            page: z.string(),
        }),
        resolve: async ({ ctx, input }) => {
            return await getLiveStreamChannelById(input, ctx)
        },
    })
    .mutation('createNewstreamChannel', {
        input: z.object({
            title: z.string(),
            description: z.string(),
            thumbnailUrl: z.string(),
        }),
        resolve: async ({ ctx, input }) => {
            return await createNewstreamChannel(input, ctx)
        },
    })
