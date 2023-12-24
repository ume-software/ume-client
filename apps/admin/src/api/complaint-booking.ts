import { z } from 'zod'

import { createRouter } from './configurations'
import { getAllComplaint, getComplaintDetails, updateComplaint } from './services/complaint-booking-services'

export const complaintRouter = createRouter()
  .query('getAllComplaint', {
    input: z.object({
      page: z.string(),
      select: z.string(),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getAllComplaint(ctx, input)
    },
  })
  .query('getComplaintDetails', {
    input: z.object({ id: z.string(), select: z.string() }),
    resolve: async ({ ctx, input }) => {
      return await getComplaintDetails(ctx, input)
    },
  })
  .mutation('updateComplaint', {
    input: z.object({
      id: z.string(),
      complaintStatus: z.object({
        bookingComplaintStatus: z.optional(z.string()),
        bookingComplaintResponseRequests: z.optional(
          z.array(
            z.object({
              bookingComplaintResponseType: z.optional(z.string()),
              responseMessage: z.optional(z.string()),
              attachments: z.optional(
                z.array(
                  z.object({
                    url: z.optional(z.string()),
                    type: z.optional(z.string()),
                  }),
                ),
              ),
            }),
          ),
        ),
      }),
    }),
    resolve: async ({ input, ctx }) => {
      return await updateComplaint(input, ctx)
    },
  })

/*
resolveComplaint.mutate(
  {
    id: complaintDetails.id,
    complaintStatus: {
      bookingComplaintStatus: 'REJECTED',
      bookingComplaintResponseRequests: {
        responseMessage: singleInput,
      },
    },
  },
  {
    onSuccess(data) {
      if (data.success) {
        notification.success({
          message: 'Kích hoạt thành công!',
          description: 'Tài khoản đã được kích hoạt.',
        })
        utils.invalidateQueries('admin.getAdminAccountList')
      }
    },
    onError: (err) => {
      notification.error({
        message: 'Hành Động không thành công!',
        description: err.message,
      })
    },
  },
)
*/
