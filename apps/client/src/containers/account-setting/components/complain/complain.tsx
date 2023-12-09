import { ComplainEnum } from '~/enumVariable/enumVariable'

import { Fragment, ReactElement, useState } from 'react'

import ComplainTableHistory from './complainTable'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
}

const tabDatas: TabDataProps[] = [
  {
    key: ComplainEnum.COMPLAIN_OF_ME,
    label: `Khiếu nại của tôi`,
  },
  {
    key: ComplainEnum.COMPLAIN_TO_ME,
    label: `Khiếu nại tới tôi`,
  },
]

const Complain = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('user') ?? 'null')

  const [selectedTab, setSelectedTab] = useState<TabDataProps>(tabDatas[0])

  const handleChangeTab = (item: TabDataProps) => {
    setSelectedTab(item)
  }

  return (
    <>
      <div className="w-full px-10">
        <div className="flex flex-row gap-10 border-b-2 border-white border-opacity-30 pb-5" style={{ zIndex: 2 }}>
          {tabDatas.map((item) => (
            <Fragment key={item.key}>
              {userInfo?.isProvider ? (
                <span
                  className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                    item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                  }`}
                  onClick={() => handleChangeTab(item)}
                  data-tab={item.label}
                  onKeyDown={() => {}}
                >
                  {item.label}
                </span>
              ) : (
                item.key != 'Service' && (
                  <span
                    className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                      item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                    }`}
                    onClick={() => handleChangeTab(item)}
                    data-tab={item.label}
                    onKeyDown={() => {}}
                  >
                    {item.label}
                  </span>
                )
              )}
            </Fragment>
          ))}
        </div>
        <ComplainTableHistory typeTable={selectedTab.key} />
      </div>
    </>
  )
}
export default Complain
