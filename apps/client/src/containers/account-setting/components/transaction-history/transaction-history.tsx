import coin from 'public/coin-icon.png'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import { CoinHistoryPagingResponse, CoinHistoryResponseCoinTypeEnum } from 'ume-service-openapi'

import ColumnChart from './column-chart'

import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface TransactionContentProps {
  key: string
  label: string
}

const TransactionContent: TransactionContentProps[] = [
  { key: CoinHistoryResponseCoinTypeEnum.Admin, label: 'Admin chuyển cho bạn' },
  { key: CoinHistoryResponseCoinTypeEnum.BuyCoin, label: 'Mua coin' },
  { key: CoinHistoryResponseCoinTypeEnum.GetBooking, label: 'Nhận từ đơn hàng' },
  { key: CoinHistoryResponseCoinTypeEnum.GetDonate, label: 'Quà tặng' },
  { key: CoinHistoryResponseCoinTypeEnum.GetGift, label: 'Quà tặng' },
  { key: CoinHistoryResponseCoinTypeEnum.GetMission, label: 'Nhận từ nhiệm vụ' },
  { key: CoinHistoryResponseCoinTypeEnum.SpendBooking, label: 'Đặt đơn' },
  { key: CoinHistoryResponseCoinTypeEnum.SpendDonate, label: 'Tặng quà' },
  { key: CoinHistoryResponseCoinTypeEnum.SpendGift, label: 'Tặng quà' },
  { key: CoinHistoryResponseCoinTypeEnum.Withdraw, label: 'Rút tiền' },
]

const TransactionHistory = () => {
  const [page, setPage] = useState<string>('1')
  const limit = '10'

  const [transactionHistory, setTransactionHistory] = useState<CoinHistoryPagingResponse | undefined>(undefined)
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
        transactionArray[5],
        <div className="flex items-center justify-center gap-2" key={transactionHistory[0]}>
          {transactionArray[6]} <Image src={coin} width={30} height={30} alt="coin" />
        </div>,
        transactionArray[9] ?? 'Không có',
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
            <div className="flex flex-col gap-5 mt-10 pr-5 space-y-10">
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
