import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { trpc } from '~/utils/trpc'

export const UserChart = () => {
  const [totalUser, setTotalUser] = useState<any>()
  trpc.useQuery(['user.statisticTotalUser'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setTotalUser(data.data)
    },
    onError(error: any) {},
  })
  const userOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Người dùng',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}',
        },
      },
    },
    series: [
      {
        name: 'Users',
        data: totalUser,
      },
    ],
  }
  return <HighchartsReact highcharts={Highcharts} options={userOptions} />
}
