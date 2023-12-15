import { Lock } from '@icon-park/react'
import { ComplainEnum } from '~/enumVariable/enumVariable'

import { Fragment, ReactElement, useState } from 'react'

import { Tooltip } from 'antd'
import { isNil } from 'lodash'
import { UserInformationResponse } from 'ume-service-openapi'

import ComplainTableHistory from './complain-table'

import { trpc } from '~/utils/trpc'

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
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
    },
    enabled: isNil(userInfo),
  })

  const [selectedTab, setSelectedTab] = useState<TabDataProps>(tabDatas[0])

  const handleChangeTab = (item: TabDataProps) => {
    if (!userInfo?.isProvider) {
      return
    } else {
      setSelectedTab(item)
    }
  }

  return (
    <>
      <div className="w-full px-10">
        <div className="flex flex-row gap-10 pb-5 border-b-2 border-white border-opacity-30" style={{ zIndex: 2 }}>
          {tabDatas.map((item) => (
            <Fragment key={item.key}>
              <span
                className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                  item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                } ${!userInfo?.isProvider && item.key == ComplainEnum.COMPLAIN_TO_ME && 'opacity-30'}`}
                onClick={() => handleChangeTab(item)}
                data-tab={item.label}
                onKeyDown={() => {}}
              >
                {!userInfo?.isProvider && item.key == ComplainEnum.COMPLAIN_TO_ME ? (
                  <Tooltip
                    placement="bottom"
                    title={'Trở thành nhà cung cấp để mở khóa tính năng này'}
                    arrow={true}
                    className="flex items-center justify-between"
                  >
                    {item.label}
                    <Lock className="pl-3 opacity-30" theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                  </Tooltip>
                ) : (
                  <>{item.label}</>
                )}
              </span>
            </Fragment>
          ))}
        </div>
        <ComplainTableHistory typeTable={selectedTab.key} />
      </div>
    </>
  )
}
export default Complain
