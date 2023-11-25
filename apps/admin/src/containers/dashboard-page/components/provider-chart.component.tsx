import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { trpc } from '~/utils/trpc'

export const ProviderChart = () => {
  const [totalProvider, setTotalProvider] = useState<any>()

  trpc.useQuery(['user.statisticTotalProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setTotalProvider(data.data)
    },
    onError(error: any) {},
  })

  const providerOptions = {
    chart: {
      type: 'pie',
      backgroundColor: '#292734',
      borderRadius: 20,
    },
    title: {
      text: 'Nhà cung cấp',
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
        name: 'Providers',
        data: totalProvider,
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

  return <HighchartsReact highcharts={Highcharts} options={providerOptions} />
}
