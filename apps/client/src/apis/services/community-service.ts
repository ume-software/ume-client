import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { CommentPostRequest, CreateNewPostRequest, DonationApi, PostApi } from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getSuggestPostWithoutCookies = async () => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).suggestPost('10', '1', '["$all"]')
    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getSuggestPost = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).suggestPost('10', '1', '["$all"]')
    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getSuggestPostFollowing = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).suggestPostFollowing('10', '1', '["$all"]')
    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const watchedPost = async (ctx, input: string) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).watchedByPostId(input)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getPostByID = async (input: string) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getPostById(input, '10', '1', '["$all"]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getLikePostByID = async (query: { postId: string; limit: string; page: string }) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getLikeByPostId(query.postId, query.limit, query.page, '["$all"]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getCommentPostByID = async (query: { postId: string; limit: string; page: string }) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getCommentByPostId(query.postId, query.limit, query.page, '["$all"]', undefined, '[{"updatedAt":"desc"}]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const likeForPostId = async (input: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).likeForPostId(input)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const unlikeForPostId = async (input: string, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).unlikeForPostId(input)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const commentForPostId = async (query: { id: string; commentPostRequest: CommentPostRequest }, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).commentForPostId(query.id, query.commentPostRequest)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const createNewPost = async (input: CreateNewPostRequest, ctx) => {
  const cookies = parse(ctx.req.headers.cookie)
  try {
    const response = await new PostApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createPost(input)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const donateProviderTop = async (input: string) => {
  try {
    const response = await new DonationApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).topDonationRecipient(input as '1Y' | '1M' | '1W', 3)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const donateUserTop = async (input) => {
  try {
    const response = await new DonationApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).topDonationDonor(input as '1Y' | '1M' | '1W', 3)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}
