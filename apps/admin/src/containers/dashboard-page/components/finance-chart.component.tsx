import { ArrowUp } from '@icon-park/react'

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
      <div className="flex flex-col my-20 md:flex-row justify-evenly">
        <div className="w-[400px] h-[400px] bg-[#7463f0] rounded-[50px] flex justify-center">
          <Statistic
            title={<div className="text-xl font-bold">Tổng số tiền đã nạp</div>}
            value={deposit}
            valueStyle={{ color: '#f4f4f3' }}
            suffix="VND"
            formatter={formatter}
            loading={isLoading || isFetching}
          />
        </div>
        <div className="w-[400px] h-[400px] bg-[#7463f0] rounded-[50px] flex justify-center">
          <Statistic
            title={<div className="text-xl font-bold">Tổng số tiền đã rút</div>}
            value={withdraw}
            valueStyle={{ color: '#f4f4f3' }}
            suffix="VND"
            formatter={formatter}
            loading={isLoading || isFetching}
          />
        </div>
      </div>
    </div>
  )
}
