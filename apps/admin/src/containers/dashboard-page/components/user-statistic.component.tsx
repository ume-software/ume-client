import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

import { ProviderChart } from './provider-chart.component'
import { TimeUnit } from './time-unit.component'
import { UserChart } from './user-chart.component'

import { StatisticNewUserType, UnitQueryTime } from '~/utils/constant'
import { trpc } from '~/utils/trpc'

export const UserStatistic = () => {
  const [timeMember, setTimeMember] = useState(12)
  const [unitMember, setUnitMember] = useState<UnitQueryTime>()
  const [timeProvider, setTimeProvider] = useState(12)
  const [unitProvider, setUnitProvider] = useState<UnitQueryTime>()
  const [userChartData, setUserChartData] = useState<any[]>([])
  const [providerChartData, setProviderChartData] = useState<any[]>([])

  const { isLoading: loadingUser, isFetching: fetchingUser } = trpc.useQuery(
    [
      'user.statisticNewUser',
      { time: timeMember, unit: unitMember || UnitQueryTime.MONTH, type: StatisticNewUserType.NEW_USER },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setUserChartData(data.data.data)
      },
      onError(error: any) {},
    },
  )

  const { isLoading: loadingProivder, isFetching: fetchingProvider } = trpc.useQuery(
    [
      'user.statisticNewUser',
      { time: timeProvider, unit: unitProvider || UnitQueryTime.MONTH, type: StatisticNewUserType.NEW_PROVIDER },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setProviderChartData(data.data.data)
        console.log(providerChartData)
      },
      onError(error: any) {},
    },
  )

  const newMemberOptions = {
    chart: {
      type: 'line',
      backgroundColor: '#292734',
      borderRadius: 20,
    },
    title: {
      text: 'Thành viên mới',
      style: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    xAxis: {
      categories: userChartData.map((item) => moment(item.time).format('DD MMM')),
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng',
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
    },
    series: [
      {
        name: 'Thành viên mới',
        data: userChartData.map((item) => [moment(item.time).format('DD MMM'), item.value]),
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
        color: '#62bce6',
      },
    },
    credits: {
      enabled: false,
    },
    loading: {
      showDuration: 0,
      hideDuration: 0,
      labelStyle: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        opacity: 0.5,
      },
    },
  }

  const newProviderOptions = {
    chart: {
      type: 'line',
      backgroundColor: '#292734',
      borderRadius: 20,
    },
    title: {
      text: 'Nhà cung cấp mới',
      style: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    xAxis: {
      categories: providerChartData.map((item) => moment(item.time).format('DD MMM')),
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng',
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
      labels: {
        style: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontFamily: 'Roboto',
          fontSize: '12px',
          lineHeight: '20px',
        },
      },
    },
    series: [
      {
        name: 'Nhà cung cấp mới',
        data: providerChartData.map((item) => [moment(item.time).format('DD MMM'), item.value]),
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
        color: '#62bce6',
      },
    },
    credits: {
      enabled: false,
    },
    loading: {
      showDuration: 0,
      hideDuration: 0,
      labelStyle: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
      },
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        opacity: 0.5,
      },
    },
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <div className="text-2xl font-medium text-white">Tổng số người dùng</div>
        <div className="text-base font-normal text-gray-400">Tổng số người dùng trong hệ thống</div>
      </div>
      <div className="flex justify-around">
        <div>
          <UserChart />
        </div>
        <div>
          <ProviderChart />
        </div>
      </div>
      <div className="flex flex-row justify-between mx-20 mt-8">
        <div>
          <TimeUnit unit={timeMember} setUnit={setTimeMember} />
        </div>
        <div>
          <TimeUnit unit={timeProvider} setUnit={setTimeProvider} />
        </div>
      </div>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          <HighchartsReact highcharts={Highcharts} options={newMemberOptions} />
        </div>
        <div className="flex flex-col">
          <HighchartsReact highcharts={Highcharts} options={newProviderOptions} />
        </div>
      </div>
    </div>
  )
}
