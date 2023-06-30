import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import { PostApi } from 'ume-booking-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getSuggestPostWithoutCookies = async () => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).suggestPost('10', '1', '["$all"]')
    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
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
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).suggestPost('10', '1', '["$all"]')
    return {
      data: response.data,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getPostByID = async (input: string) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).getPostById(input, '10', '1', '["$all"]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getLikePostByID = async (input: string) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).getLikeByPostId(input, '10', '1', '["$all"]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

export const getCommentPostByID = async (input: string) => {
  try {
    const response = await new PostApi({
      basePath: getEnv().baseBookingURL,
      isJsonMime: () => true,
    }).getCommentByPostId(input, '10', '1', '["$all"]')
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    console.log('error at catch', error)
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list post',
    })
  }
}

// export const likePost = async (input: string, ctx) => {
//   const cookies = parse(ctx.req.headers.cookie)
//   try {
//     const response = await new PostApi({
//       basePath: getEnv().baseBookingURL,
//       isJsonMime: () => true,
//       accessToken: cookies['accessToken'],
//     })
//     return {
//       data: response.data,
//       success: true,
//     }
//   } catch (error) {
//     console.log('error at catch', error)
//     throw new TRPCError({
//       code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
//       message: error.message || 'Failed to get list post',
//     })
//   }
// }
