import { Lock } from '@icon-park/react'
import { useAuth } from '~/contexts/auth'

import { Fragment, ReactElement, useState } from 'react'

import { Tooltip } from 'antd'
import { isNil } from 'lodash'
import { UserInformationResponse } from 'ume-service-openapi'

import BookingTableHistory from './booking-history-table'

import { BookingHistoryEnum } from '~/utils/enumVariable'
import { trpc } from '~/utils/trpc'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
}

const tabDatas: TabDataProps[] = [
  {
    key: BookingHistoryEnum.BOOKING_FOR_USER,
    label: `Đơn đặt`,
  },
  {
    key: BookingHistoryEnum.BOOKING_FOR_PROVIDER,
    label: `Đơn nhận`,
  },
]

const BookingHistory = () => {
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  const [selectedTab, setSelectedTab] = useState<TabDataProps>(tabDatas[0])
  const { isAuthenticated, logout } = useAuth()

  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      logout()
    },
    enabled: isAuthenticated,
  })

  const handleChangeTab = (item: TabDataProps) => {
    if (!userInfo?.isProvider && item.key == BookingHistoryEnum.BOOKING_FOR_PROVIDER) {
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
                } ${!userInfo?.isProvider && item.key == BookingHistoryEnum.BOOKING_FOR_PROVIDER && 'opacity-30'}`}
                onClick={() => handleChangeTab(item)}
                data-tab={item.label}
                onKeyDown={() => {}}
              >
                {!userInfo?.isProvider && item.key == BookingHistoryEnum.BOOKING_FOR_PROVIDER ? (
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
        <BookingTableHistory typeTable={selectedTab.key} />
      </div>
    </>
  )
}
export default BookingHistory
