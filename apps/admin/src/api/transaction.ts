import { z } from 'zod'

import { createRouter } from './configurations'
import {
  approveWithdrawal,
  getBookingTransactions,
  getDepositDetail,
  getDepositTransactions,
  getDonationTransactions,
  getWaitingTransactions,
  statisticTransasction,
} from './services/transactions-service'

import { TransactionType, UnitQueryTime } from '~/utils/constant'

export const transactionRouter = createRouter()
  .query('getDepositTransactions', {
    input: z.object({
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositTransactions(ctx, input)
    },
  })
  .query('getDepositDetail', {
    input: z.object({
      id: z.string(),
      select: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDepositDetail(ctx, input)
    },
  })
  .query('getDonationTransactions', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getDonationTransactions(ctx, input)
    },
  })
  .query('getBookingTransactions', {
    input: z.object({
      limit: z.string(),
      page: z.string(),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getBookingTransactions(ctx, input)
    },
  })
  .query('getWithdrawRequest', {
    input: z.object({
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getWaitingTransactions(ctx, input)
    },
  })
  .mutation('approveWithdrawRequest', {
    input: z.object({
      id: z.string(),
      action: z.any(),
    }),
    resolve: async ({ ctx, input }) => {
      return await approveWithdrawal(input.id, input.action, ctx)
    },
  })
  .query('statisticTransasction', {
    input: z.object({
      time: z.number(),
      type: z.enum([TransactionType.DEPOSIT, TransactionType.WITHDRAW]),
      unit: z.enum([UnitQueryTime.MONTH, UnitQueryTime.YEAR]),
    }),
    resolve: async ({ ctx, input }) => {
      return await statisticTransasction(ctx, input.type, { time: input.time, unit: input.unit })
    },
  })
