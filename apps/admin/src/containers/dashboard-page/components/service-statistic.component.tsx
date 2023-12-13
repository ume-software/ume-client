import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { trpc } from '~/utils/trpc'

export const ServiceStatistic = () => {
  const [chartData, setChartData] = useState<any>()
  const [amount, setAmount] = useState(10)
  const { isLoading, isFetching } = trpc.useQuery(['services.getStatisticService', { amount: amount }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    queryKey: ['services.getStatisticService', { amount: amount }],
    onSuccess(data) {
      setChartData(data.data)
    },
    onError(error: any) {},
  })

  const serviceChartOptions = {
    chart: {
      type: 'column',
      backgroundColor: '#292734',
      borderRadius: 20,
    },
    title: {
      text: 'Top dịch vụ được sử dụng',
      style: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '18px',
        lineHeight: '24px',
      },
    },
    xAxis: {
      categories: chartData?.map((item) => item.name),
      crosshair: true,
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Số lượng (lượt)',
      },
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
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
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} lượt</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Loại dịch vụ',
        data: chartData?.map((item) => item.value),
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <div>
      <div>
        <div className="text-2xl font-medium text-white">Số lượng dịch vụ</div>
        <div className="text-base font-normal text-gray-400">Số lượng dịch vụ được sử dụng nhiều nhất</div>
      </div>
      <div className="flex flex-row gap-10 my-4">
        <div
          onClick={() => setAmount(5)}
          className={`rounded-[20px] w-16 h-16  text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            amount === 5 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          5
        </div>
        <div
          onClick={() => setAmount(10)}
          className={`rounded-[20px] w-16 h-16  text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            amount === 10 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          10
        </div>
        <div
          onClick={() => setAmount(15)}
          className={`rounded-[20px] w-16 h-16  text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            amount === 15 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          15
        </div>
        <div
          onClick={() => setAmount(20)}
          className={`rounded-[20px] w-16 h-16  text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            amount === 20 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          20
        </div>
      </div>
      {isLoading || isFetching ? (
        <div>Loading...</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={serviceChartOptions} />
      )}
    </div>
  )
}
