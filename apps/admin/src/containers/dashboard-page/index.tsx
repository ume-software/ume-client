import { ReactNode, useMemo } from 'react'

import { Tabs } from 'antd'
import Head from 'next/head'

import { ServiceStatistic } from './components/service-statistic.component'
import { UserStatistic } from './components/user-statistic.component'

type TabType = {
  key: string
  label: ReactNode
  children: ReactNode
}
const DasboardPage = () => {
  const tabs: Array<TabType> = useMemo(
    () => [
      {
        key: '1',
        label: <div className="flex justify-center w-20 font-medium ">Người dùng</div>,
        children: <UserStatistic />,
      },
      {
        key: '2',
        label: <div className="flex justify-center w-20 font-medium">Dịch vụ</div>,
        children: <ServiceStatistic />,
      },
    ],
    [],
  )
  return (
    <div>
      <Head>
        <title>Admin | DASHBOARD</title>
      </Head>
      <div className="h-full pb-10">
        <Tabs defaultActiveKey="1" type="card" size="middle" animated items={tabs} />
      </div>
    </div>
  )
}
export default DasboardPage
