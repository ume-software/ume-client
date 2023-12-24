import { z } from 'zod'

import { createRouter } from './configurations'
import { statsticWidrawalAndDeposit } from './services/services-service'
import {
  approveWithdrawal,
  getBookingTransactions,
  getDepositDetail,
  getDepositTransactions,
  getDonationTransactions,
  getWaitingTransactions,
  getWithdrawalDetails,
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
  .query('getWithdrawalDetails', {
    input: z.object({
      id: z.string(),
      limit: z.optional(z.string()),
      page: z.optional(z.string()),
      select: z.optional(z.string()),
      where: z.optional(z.string()),
      order: z.optional(z.string()),
    }),
    resolve: async ({ ctx, input }) => {
      return await getWithdrawalDetails(ctx, input)
    },
  })
  .mutation('approveWithdrawRequest', {
    input: z.object({
      id: z.string(),
      action: z.object({
        billImageUrl: z.string(),
        feedback: z.string(),
        status: z.string(),
      }),
    }),
    resolve: async ({ ctx, input }) => {
      return await approveWithdrawal(input.id, input.action, ctx)
    },
  })
  .query('statisticTransasction', {
    input: z.object({
      time: z.number(),
      unit: z.enum([UnitQueryTime.MONTH, UnitQueryTime.YEAR]),
    }),
    resolve: async ({ ctx, input }) => {
      return await statisticTransasction(ctx, { time: input.time, unit: input.unit })
    },
  })
  .query('statisticWithdrawalDepositTransaction', {
    input: z.object({
      time: z.number(),
      unit: z.enum([UnitQueryTime.MONTH, UnitQueryTime.YEAR]),
    }),
    resolve: async ({ ctx, input }) => {
      return await statsticWidrawalAndDeposit(ctx, {
        time: input.time,
        unit: input.unit,
      })
    },
  })
