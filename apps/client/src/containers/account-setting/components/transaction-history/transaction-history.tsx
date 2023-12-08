/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '~/contexts/auth'

import { useEffect, useState } from 'react'

import { BalanceHistoryPagingResponse, BalanceHistoryResponseBalanceTypeEnum } from 'ume-service-openapi'

import ColumnChart from './column-chart'
import ComplainTicketModal from './complain-ticket-modal'

import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const TransactionContent: IEnumType[] = [
  { key: BalanceHistoryResponseBalanceTypeEnum.Admin, label: 'Admin chuyển tiền' },
  { key: BalanceHistoryResponseBalanceTypeEnum.Deposit, label: 'Nạp tiền' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetBooking, label: 'Nhận từ đơn hàng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetDonate, label: 'Quà tặng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetGift, label: 'Quà tặng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetMission, label: 'Nhận từ nhiệm vụ' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendBooking, label: 'Đặt đơn' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendDonate, label: 'Tặng quà' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendGift, label: 'Tặng quà' },
  { key: BalanceHistoryResponseBalanceTypeEnum.Withdrawal, label: 'Rút tiền' },
]

const TransactionHistory = () => {
  const [transactionPage, setTransactionPage] = useState<string>('1')
  const limit = '10'

  const { user } = useAuth()

  const [isModalComplainVisible, setIsModalComplainVisible] = useState<boolean>(false)
  const [transactionHistory, setTransactionHistory] = useState<BalanceHistoryPagingResponse | undefined>(undefined)
  const [transactionHistoryArray, setTransactionHistoryArray] = useState<any[] | undefined>(undefined)
  const [seriesCharts, setSeriesCharts] = useState<any[] | undefined>(undefined)
  const { isLoading: isTransactionHistoryLoading } = trpc.useQuery(
    ['identity.getHistoryTransaction', { page: transactionPage, limit, order: '{"updatedAt":"desc"}' }],
    {
      onSuccess(data) {
        setTransactionHistory(data.data)
      },
    },
  )

  useEffect(() => {
    const monthYearAmountMap = {}

    transactionHistory?.row?.map((transactionHistory) => {
      const updatedAt = new Date(transactionHistory.updatedAt ?? '')
      const monthYear = `${updatedAt.getFullYear()}-${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}`
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

    const transactionHistoryResultArray = transactionHistory?.row?.map((transactionHistory) => {
      const transactionArray = Object.values(transactionHistory)

      const newTransactionArray = [
        TransactionContent.find((transContent) => transContent.key == transactionArray[5])?.label,
        <div className="flex items-center justify-center gap-2" key={transactionHistory[0]}>
          {(transactionArray[6] ?? 0).toLocaleString()} <span className="text-xs italic"> đ</span>
        </div>,
        transactionArray[12]?.recipient?.name ?? user?.name,
        new Date(transactionArray[1]).toLocaleDateString('en-GB'),
        new Date(transactionArray[2]).toLocaleDateString('en-GB'),
      ]
      return newTransactionArray
    })
    setTransactionHistoryArray(transactionHistoryResultArray)
  }, [transactionHistory])

  return (
    <>
      <ComplainTicketModal
        isModalComplainVisible={isModalComplainVisible}
        setIsModalComplainVisible={setIsModalComplainVisible}
      />
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Lịch sử giao dịch</p>

        <div className="flex flex-col gap-5 mt-10 space-y-10">
          {!isTransactionHistoryLoading && seriesCharts ? (
            <ColumnChart seriesCharts={seriesCharts} />
          ) : (
            <div className="w-full h-[350px] flex justify-center gap-10 mt-20 mb-10">
              <div className="w-full h-[350px] bg-gray-300 rounded-lg animate-pulse">
                <span className="w-full h-full" />
              </div>
            </div>
          )}

          {!isTransactionHistoryLoading && transactionHistoryArray ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-bold">Chi tiết giao dịch</p>
              <Table
                dataHeader={['Loại', 'Số tiền', 'Người nhận', 'Ngày tạo giao dịch', 'Ngày hoàn thành']}
                dataBody={transactionHistoryArray}
                page={transactionPage}
                setPage={setTransactionPage}
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
          ) : (
            <TableSkeletonLoader />
          )}
        </div>
      </div>
    </>
  )
}
export default TransactionHistory
