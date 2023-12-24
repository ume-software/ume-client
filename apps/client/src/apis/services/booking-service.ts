import { TRPCError } from '@trpc/server'
import { getEnv } from '~/env'

import { parse } from 'cookie'
import {
  BookingApi,
  BookingProviderRequest,
  CreateReportUserRequestReasonTypeEnum,
  DonationApi,
  NoticeApi,
  ProviderApi,
  ProviderServiceApi,
  ServiceApi,
  UserApi,
  VoucherApi,
} from 'ume-service-openapi'

import { getTRPCErrorTypeFromErrorStatus } from '~/utils/errors'

export const getListService = async (query?: { where?: string }) => {
  try {
    const response = await new ServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).findAndCountAll('unlimited', '1', '["$all"]', `"name":{"contains":${query?.where}}`)

    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list service',
    })
  }
}

export const getProviders = async (query?: {
  startCost?: number
  endCost?: number
  serviceId?: string
  serviceAttributeValueIds: string[]
  name?: string
  gender?: string
  status?: string
  isOnline?: boolean
  limit?: string
  page?: string
  order?: string
}) => {
  try {
    const response = await new ProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getListProvider(
      query?.startCost,
      query?.endCost,
      query?.serviceId,
      query?.serviceAttributeValueIds,
      query?.name,
      query?.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PRIVATE',
      query?.status as 'ACTIVATED' | 'UN_ACTIVATED' | 'STOPPED_ACCEPTING_BOOKING' | 'BUSY',
      query?.isOnline,
      query?.limit,
      query?.page,
      query?.order,
    )
    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list provider',
    })
  }
}

export const getHotProviders = async () => {
  try {
    const response = await new ProviderApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getListHotProvider(7, '8', '1')
    return {
      data: response.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status) || 500,
      message: error.message || 'Failed to get list hot provider',
    })
  }
}

export const getUserBySlug = async (providerId: string, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getUserBySlug(providerId)
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status) || 500,
      message: error.message || 'Fail to get list service',
    })
  }
}

export const getCurrentBookingForProvider = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getCurrentBookingForProvider()
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}
export const getCurrentBookingForUser = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getCurrentBookingForUser()
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getMyVoucherForBooking = async (
  query: { providerSlug: string; limit: string; page: string; where?: string; order?: string },
  ctx,
) => {
  const cookies = parse(ctx.req.headers.cookie ?? '')
  try {
    const reponse = await new VoucherApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getMyVoucher(query.providerSlug, query.limit, query.page, '["$all"]', query.where, query.order)
    return {
      data: reponse.data,
      success: true,
      message: '',
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get data recharge',
    })
  }
}

export const createBooking = async (provider: BookingProviderRequest, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createBooking(provider)
    return {
      data: respone.data,
      success: true,
      message: respone.status,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.status),
      message: error.response?.data.data.message || 'Fail to create new booking',
    })
  }
}

export const putProviderResponeBooking = async ({ bookingHistoryId, status }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).bookingHandle({
      bookingHistoryId: bookingHistoryId,
      status: status,
    })
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getFeedbackServiceByUserSlug = async (slug: string) => {
  try {
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getFeedbackByUserSlug(slug, 'unlimited', '1', '["$all"]')
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getFeedbackServiceById = async (feedbackServiceId) => {
  try {
    const respone = await new ProviderServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getFeedbackByProviderService(feedbackServiceId, '1', '1', '["$all"]')
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getNoticeAmount = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new NoticeApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).amountNewNotice()
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get notice amount',
    })
  }
}

export const getAllNotice = async (query: { page: string; limit: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new NoticeApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getNotice(query.limit, query.page, '["$all"]', '{}', '[{"updatedAt":"desc"}]')
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create get all notification',
    })
  }
}

export const getAlbumByUserSlug = async (query: { slug: string; page?: string; limit?: string }, ctx) => {
  try {
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getAlbumByUserSlug(query.slug, query.limit, query.page)
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create get album',
    })
  }
}

export const getCanFeedbackProvider = async (slug: string, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getBookingCanFeedbackByUserSlug(slug)
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get user can feedback provider',
    })
  }
}

export const postFeedback = async (
  query: { id: string; feedback?: { content?: string; amountStar?: number } },
  ctx,
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).createFeedbackBooking(query.id, query.feedback)
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create feedback',
    })
  }
}

export const donationForRecipient = async (query: { recipientId: string; amount: number; message?: string }, ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new DonationApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).donationForRecipient({ recipientId: query.recipientId, amount: query.amount, message: query.message })
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to donate',
    })
  }
}

export const getPostByUserSlug = async (query: { userSlug: string; page: string }) => {
  try {
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getPostsByUserSlug(query.userSlug, '8', query.page)
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get post by user slug',
    })
  }
}
export const postReportUser = async (
  query: { slug: string; reasonType: CreateReportUserRequestReasonTypeEnum; content: string },
  ctx,
) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).reportUserBySlug(query.slug, { reasonType: query.reasonType, content: query.content })
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.response?.data.codeNumber),
      message: error.response?.data.message || 'Fail to get post report user',
    })
  }
}

export const getServiceBySlug = async (query: { slug: string }, ctx) => {
  try {
    const respone = await new ServiceApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getServiceBySlug(query.slug, 'unlimited', '1', '["$all"]')
    return {
      data: respone.data,
      success: true,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to get service attribute',
    })
  }
}

export const getPendingBookingForProvider = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getPendingBookingForProvider()
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getPendingBookingForUser = async (ctx) => {
  try {
    const cookies = parse(ctx.req.headers.cookie)
    const respone = await new BookingApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
      accessToken: cookies['accessToken'],
    }).getPendingBookingForUser()
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getFollowerByUserSlug = async (query: { slug: string; page: string }) => {
  try {
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getFollowerByUserSlug(query.slug, '10', query.page, '["$all"]')
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}

export const getFollowingByUserSlug = async (query: { slug: string; page: string }) => {
  try {
    const respone = await new UserApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).getFollowingByUserSlug(query.slug, '10', query.page, '["$all"]')
    return {
      data: respone.data,
    }
  } catch (error) {
    throw new TRPCError({
      code: getTRPCErrorTypeFromErrorStatus(error.respone?.status),
      message: error.message || 'Fail to create new booking',
    })
  }
}
