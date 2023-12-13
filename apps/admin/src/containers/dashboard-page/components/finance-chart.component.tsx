import { ArrowDown, ArrowUp } from '@icon-park/react'

import { useState } from 'react'

import { Statistic } from 'antd'
import CountUp from 'react-countup'

import { UnitQueryTime } from '~/utils/constant'
import { trpc } from '~/utils/trpc'

export const FinanceStatistic = () => {
  const [withdraw, setWithdraw] = useState<number>(0)
  const [deposit, setDeposit] = useState<number>(0)

  const { isFetching, isLoading } = trpc.useQuery(
    ['transaction.statisticTransasction', { time: 12, unit: UnitQueryTime.MONTH }],

    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setWithdraw(data?.data?.totalWithdrawal ?? 0)
        setDeposit(data?.data?.totalDeposit ?? 0)
      },
      onError(error: any) {},
    },
  )

  const formatter = (value: number) => <CountUp end={value} separator="," />

  return (
    <div>
      <div>
        <div className="text-2xl font-medium text-white">Thu nhập hệ thống:</div>
        <div className="text-base font-normal text-gray-400">Tổng số tiền nạp rút trong hệ thống</div>
      </div>
      <div className="flex flex-col my-20 md:flex-row justify-evenly">
        <div className="flex flex-col">
          <div className="mb-4 text-2xl font-bold text-[#f4f4f3]">Thu nhập hệ thống:</div>
          <div className="w-[400px] h-[200px] bg-[#7463f0] rounded-[50px] flex justify-center">
            <ArrowUp size={50} className="my-auto text-3xl font-bold text-[#3fe452]" theme="outline" />
            <Statistic
              className="my-auto text-2xl font-bold"
              value={deposit}
              valueStyle={{ color: '#f4f4f3' }}
              suffix="VND"
              formatter={formatter}
              precision={3}
              loading={isLoading || isFetching}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-4 text-2xl font-bold text-[#f4f4f3]">Số tiền đã rút ra ngoài hệ thống:</div>
          <div className="w-[400px] h-[200px] bg-[#7463f0] rounded-[50px] flex justify-center">
            <ArrowDown size={50} className="my-auto text-3xl font-bold text-[#ff4343]" theme="outline" />
            <Statistic
              className="my-auto text-3xl font-bold"
              value={withdraw}
              valueStyle={{ color: '#f4f4f3' }}
              suffix="VND"
              precision={3}
              formatter={formatter}
              loading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
