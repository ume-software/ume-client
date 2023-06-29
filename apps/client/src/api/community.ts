import { z } from 'zod'

import { createRouter } from './configurations'
import {
  getCommentPostByID,
  getLikePostByID,
  getPostByID,
  getSuggestPost,
  getSuggestPostWithoutCookies,
} from './services/community-service'

export const communityRouter = createRouter()
  .query('getSuggestPostWithoutCookies', {
    resolve: async () => {
      return await getSuggestPostWithoutCookies()
    },
  })
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
