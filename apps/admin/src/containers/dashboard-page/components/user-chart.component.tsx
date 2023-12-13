import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { trpc } from '~/utils/trpc'

export const UserChart = () => {
  const [userChartData, setUserChartData] = useState<any>()
  trpc.useQuery(['user.statisticTotalUser'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      const verifiedUser = data.totalUserIsVerified
      const bannedUser = data.totalUserIsBanned
      const normalUser = data.totalUserIsNotBannedAndIsNotVerified
      setUserChartData([
        { name: 'Đã xác thực', y: verifiedUser },
        { name: 'Đã bị khóa', y: bannedUser },
        { name: 'Chưa xác thực', y: normalUser },
      ])
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
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    series: [
      {
        name: 'Người dùng',
        colorByPoint: true,
        data: userChartData,
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
    credits: {
      enabled: false,
    },
  }

  return <HighchartsReact highcharts={Highcharts} options={userOptions} />
}
