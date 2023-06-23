import { z } from 'zod'

import { createRouter } from './configurations'
import { getCommentPostByID, getLikePostByID, getPostByID, getSuggestPost } from './services/community-service'

export const communityRouter = createRouter()
  .query('getSuggestPost', {
    resolve: async ({ ctx }) => {
      return await getSuggestPost(ctx)
    },
  })
  .query('getPostByID', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await getPostByID(input)
    },
  })
  .query('getLikePostByID', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await getLikePostByID(input)
    },
  })
  .query('getCommentPostByID', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await getCommentPostByID(input)
    },
  })
