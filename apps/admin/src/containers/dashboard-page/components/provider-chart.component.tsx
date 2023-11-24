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
    },
    title: {
      text: 'Nhà cung cấp',
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
        name: 'Providers',
        data: totalProvider,
      },
    ],
  }

  return <HighchartsReact highcharts={Highcharts} options={providerOptions} />
}
