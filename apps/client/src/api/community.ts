import { z } from 'zod'

import { createRouter } from './configurations'
import {
  commentForPostId,
  getCommentPostByID,
  getLikePostByID,
  getPostByID,
  getSuggestPost,
  getSuggestPostWithoutCookies,
  likeForPostId,
  unlikeForPostId,
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
  .query('likeForPostId', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await likeForPostId(input, ctx)
    },
  })
  .query('unlikeForPostId', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await unlikeForPostId(input, ctx)
    },
  })
  .mutation('commentForPostId', {
    input: z.object({
      id: z.string(),
      commentPostRequest: z.object({ content: z.string(), parentCommentId: z.string() }),
    }),
    resolve: async ({ ctx, input }) => {
      return await commentForPostId(input, ctx)
    },
  })
