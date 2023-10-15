import { CreateServiceRequest, HandleServiceAttributeRequestHandleTypeEnum } from 'ume-service-openapi'
import { z } from 'zod'

import { createRouter } from './configurations'
import { createService, getServiceDetails, getServiceList, updateService } from './services/services-service'

export const servicesRouter = createRouter()
  .query('getServiceList', {
    input: z.object({
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getServiceList(ctx, input)
    },
  })
  .query('getServiceDetails', {
    input: z.object({ id: z.string(), select: z.string() }),
    resolve: async ({ ctx, input }) => {
      return await getServiceDetails(ctx, input)
    },
  })
  .mutation('createService', {
    input: z.object({
      name: z.string(),
      viName: z.optional(z.string()),
      imageUrl: z.string(),
      isActivated: z.optional(z.boolean()),
      serviceAttributes: z.optional(
        z.array(
          z.object({
            attribute: z.string(),
            viAttribute: z.optional(z.string()),
            isActivated: z.optional(z.boolean()),
            serviceAttributeValues: z.optional(
              z.array(
                z.object({
                  value: z.string(),
                  viValue: z.optional(z.string()),
                  isActivated: z.optional(z.boolean()),
                }),
              ),
            ),
          }),
        ),
      ),
    }),
    resolve: async ({ ctx, input }) => {
      return await createService(input as CreateServiceRequest, ctx)
    },
  })
// .mutation('updateService', {
//   input: z.object({
//     id: z.string(),
//     updateServiceRequest: z.object({
//       name: z.string(),
//       viName: z.optional(z.string()),
//       imageUrl: z.string(),
//       isActivated: z.optional(z.boolean()),
//       serviceAttributes: z.optional(
//         z.array(
//           z.object({
//             id: z.optional(z.string()),
//             attribute: z.optional(z.string()),
//             viAttribute: z.optional(z.string()),
//             isActivated: z.optional(z.boolean()),
//             handleType: z.nativeEnum(HandleServiceAttributeRequestHandleTypeEnum),
//             serviceAttributeValues: z.optional(
//               z.array(
//                 z.object({
//                   id: z.optional(z.string()),
//                   value: z.string(),
//                   viValue: z.optional(z.string()),
//                   isActivated: z.optional(z.boolean()),
//                 }),
//               ),
//             ),
//           }),
//         ),
//       ),
//     }),
//   }),
//   resolve: async ({ input, ctx }) => {
//     return await updateService(input, ctx)
//   },
// })
