/* eslint-disable react-hooks/exhaustive-deps */
import coin from 'public/coin-icon.png'
import { useAuth } from '~/contexts/auth'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import { BalanceHistoryPagingResponse, BalanceHistoryResponseCoinTypeEnum } from 'ume-service-openapi'

import ColumnChart from './column-chart'

import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface TransactionContentProps {
  key: string
  label: string
}

const TransactionContent: TransactionContentProps[] = [
  { key: BalanceHistoryResponseCoinTypeEnum.Admin, label: 'Admin chuyển tiền' },
  { key: BalanceHistoryResponseCoinTypeEnum.Deposit, label: 'Nạp tiền' },
  { key: BalanceHistoryResponseCoinTypeEnum.GetBooking, label: 'Nhận từ đơn hàng' },
  { key: BalanceHistoryResponseCoinTypeEnum.GetDonate, label: 'Quà tặng' },
  { key: BalanceHistoryResponseCoinTypeEnum.GetGift, label: 'Quà tặng' },
  { key: BalanceHistoryResponseCoinTypeEnum.GetMission, label: 'Nhận từ nhiệm vụ' },
  { key: BalanceHistoryResponseCoinTypeEnum.SpendBooking, label: 'Đặt đơn' },
  { key: BalanceHistoryResponseCoinTypeEnum.SpendDonate, label: 'Tặng quà' },
  { key: BalanceHistoryResponseCoinTypeEnum.SpendGift, label: 'Tặng quà' },
  { key: BalanceHistoryResponseCoinTypeEnum.Withdraw, label: 'Rút tiền' },
]

const TransactionHistory = () => {
  const [page, setPage] = useState<string>('1')
  const limit = '10'

  const { user } = useAuth()

  const [transactionHistory, setTransactionHistory] = useState<BalanceHistoryPagingResponse | undefined>(undefined)
  const [transactionHistoryArray, setTransactionHistoryArray] = useState<any[] | undefined>(undefined)
  const [seriesCharts, setSeriesCharts] = useState<any[] | undefined>(undefined)

  const { isLoading: isTransactionHistoryLoading } = trpc.useQuery(
    ['identity.getHistoryTransaction', { page, limit }],
    {
      onSuccess(data) {
        setTransactionHistory(data.data)
      },
    },
  )

  console.log(transactionHistory)

  useEffect(() => {
    const monthYearAmountMap = {}

    transactionHistory?.row?.map((transactionHistory) => {
      const updatedAt = new Date(transactionHistory.updatedAt ?? '')
      const monthYear = `${updatedAt.getFullYear()}-${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}` // Format: YYYY-MM
      const amount = transactionHistory.amount

      if (monthYearAmountMap[monthYear]) {
        monthYearAmountMap[monthYear].push(amount)
      } else {
        monthYearAmountMap[monthYear] = [amount]
      }
    })

    const monthYearAmountArray = Object.keys(monthYearAmountMap).map((monthYear) => ({
      monthYear,
      amount: monthYearAmountMap[monthYear],
    }))

    setSeriesCharts(monthYearAmountArray)

    const resultArray = transactionHistory?.row?.map((transactionHistory) => {
      const transactionArray = Object.values(transactionHistory)
      const newTransactionArray = [
        TransactionContent.find((transContent) => transContent.key == transactionArray[5])?.label,
        <div className="flex items-center justify-center gap-2" key={transactionHistory[0]}>
          {transactionArray[6]} <Image src={coin} width={30} height={30} alt="coin" />
        </div>,
        transactionArray[9] ?? user?.name,
        new Date(transactionArray[1]).toLocaleDateString('en-GB'),
        new Date(transactionArray[2]).toLocaleDateString('en-GB'),
      ]
      return newTransactionArray
    })
    setTransactionHistoryArray(resultArray)
  }, [transactionHistory])

  return (
    <>
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Lịch sử giao dịch</p>
        {!isTransactionHistoryLoading && seriesCharts && transactionHistoryArray ? (
          <>
            <div className="flex flex-col gap-5 pr-5 mt-10 space-y-10">
              <ColumnChart seriesCharts={seriesCharts} />
              <div className="flex flex-col gap-3">
                <p className="text-xl font-bold">Chi tiết giao dịch</p>
                <Table
                  dataHeader={['Loại', 'Số lượng coin', 'Người nhận', 'Ngày tạo giao dịch', 'Ngày hoàn thành']}
                  dataBody={transactionHistoryArray}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  totalItem={Number(transactionHistory?.count ?? 0)}
                  contentItem={'giao dịch'}
                  watchAction={false}
                  onWatch={() => {}}
                  editAction={false}
                  onEdit={() => {}}
                  deleteAction={false}
                  onDelete={() => {}}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full h-[350px] flex justify-center gap-10 mt-20 mb-10">
              <div className="w-full h-[350px] bg-gray-300 rounded-lg animate-pulse">
                <span className="w-full h-full" />
              </div>
            </div>
            <TableSkeletonLoader />
          </>
        )}
      </div>
    </>
  )
}
export default TransactionHistory
