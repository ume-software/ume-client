import { CreateNewPostRequest, ThumbnailResponse } from 'ume-booking-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import {
  commentForPostId,
  createNewPost,
  donateProviderTop,
  donateUserTop,
  getCommentPostByID,
  getLikePostByID,
  getPostByID,
  getSuggestPost,
  getSuggestPostWithoutCookies,
  likeForPostId,
  unlikeForPostId,
  watchedPost,
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
  .mutation('watchedPost', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await watchedPost(ctx, input)
    },
  })
  .query('getPostByID', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await getPostByID(input)
    },
  })
  .query('getLikePostByID', {
    input: z.object({
      postId: z.string(),
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ input }) => {
      return await getLikePostByID(input)
    },
  })
  .query('getCommentPostByID', {
    input: z.object({
      postId: z.string(),
      limit: z.string(),
      page: z.string(),
    }),
    resolve: async ({ input }) => {
      return await getCommentPostByID(input)
    },
  })
  .mutation('likeForPostId', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await likeForPostId(input, ctx)
    },
  })
  .mutation('unlikeForPostId', {
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
  .mutation('createNewPost', {
    input: z.object({
      content: z.string(),
      thumbnails: z.array(
        z.object({
          url: z.string().optional(),
          type: z.string().optional(),
        }),
      ),
    }),
    resolve: async ({ ctx, input }) => {
      return await createNewPost(input as CreateNewPostRequest, ctx)
    },
  })
  .query('donateProviderTop', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await donateProviderTop(input)
    },
  })
  .query('donateUserTop', {
    input: z.string(),
    resolve: async ({ input }) => {
      return await donateUserTop(input)
    },
  })
