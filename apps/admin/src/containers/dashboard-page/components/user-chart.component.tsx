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
      backgroundColor: '#292734',
      borderRadius: 20,
    },
    title: {
      text: 'Người dùng',
      style: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}',
        },
        allowPointSelect: true,
        cursor: 'pointer',
        showInLegend: true,
      },
    },
    series: [
      {
        name: 'Users',
        data: totalUser,
      },
    ],
    legend: {
      itemStyle: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
      itemHoverStyle: {
        color: '#628ee6',
      },
    },
  }
  return <HighchartsReact highcharts={Highcharts} options={userOptions} />
}
