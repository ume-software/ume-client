import { Left, Right } from '@icon-park/react'
import { Button } from '@ume/ui'

import * as React from 'react'

import { Avatar, Pagination } from 'antd'
import Image from 'next/image'
import { AdminGetProviderServicePagingResponse, BookingHistoryPagingResponse } from 'ume-service-openapi'

import ProviderServiceTable from './provider-service-table'
import TransactionTable from './transaction-table'

import { trpc } from '~/utils/trpc'

export interface IProviderInfoProps {
  providerId: any
  providerInfo: any
}

export default function ProviderInfo({ providerInfo, providerId }: IProviderInfoProps) {
  const [providerSkills, setProviderSkills] = React.useState<AdminGetProviderServicePagingResponse | undefined>()
  const [providerTransHistory, setProviderTransHistory] = React.useState<BookingHistoryPagingResponse | undefined>()
  const [pageService, setPageService] = React.useState(1)
  const [pageTrans, setPageTrans] = React.useState(1)
  const PAGE_SIZE_SERVICE = 5
  const PAGE_SIZE_TRANS = 10
  const SELECT_SKILL = [
    '$all',
    {
      service: ['$all'],
    },
  ]
  const SELECT_TRANS = [
    '$all',
    {
      booker: ['$all'],
    },
    { providerService: ['$all', { service: ['$all'] }] },
  ]
  const { isLoading: isListSkillLoading, isFetching: isListSkillFetching } = trpc.useQuery(
    [
      'provider.getProviderSkill',
      {
        slug: providerId,
        select: JSON.stringify(SELECT_SKILL),
        limit: PAGE_SIZE_SERVICE.toString(),
        page: pageService.toString(),
      },
    ],
    {
      onSuccess(data) {
        setProviderSkills(data.data)
      },
    },
  )

  const dataProviderSkills = providerSkills?.row?.map((row: any) => {
    return {
      key: row.id,
      id: row.id,
      imageUrl: row.service.imageUrl,
      name: row.service.name,
      createDate: row.createdAt,
      totalBookingPeriod: row.totalBookingPeriod,
      totalBooking: row.totalBooking,
      // rating: 'chua co',
      totalRevenue: row.totalRevenue,
      ...row,
    }
  })

  const { isLoading: isListTransLoading, isFetching: isListTransFetching } = trpc.useQuery(
    [
      'provider.getProviderBookingHistory',
      {
        slug: providerId,
        select: JSON.stringify(SELECT_TRANS),
        limit: PAGE_SIZE_TRANS.toString(),
        page: pageTrans.toString(),
        order: JSON.stringify([{ createdAt: 'desc' }]),
      },
    ],
    {
      onSuccess(data) {
        setProviderTransHistory(data.data)
      },
    },
  )

  const dataProviderTranHistory = providerTransHistory?.row?.map((row: any) => {
    return {
      key: row.id,
      id: row.id,
      member: row.booker.name,
      bookingDate: row.createdAt,
      skill: row.providerService.service.name,
      serveTime: row.bookingPeriod,
      status: row.status,
      mountMoney: row.totalCost,
      // feedback: 'Thằng này ngáo',
      ...row,
    }
  })

  const name = providerInfo.name
  const avatarUrl = providerInfo.avatarUrl
  const createdAt = new Date(providerInfo.createdAt).toLocaleDateString('en-GB')
  const email = providerInfo.Gmail
  const phone = providerInfo.phone
  const rating = providerInfo.rating
  const servicedTime = providerInfo.servicedTime
  const balance = providerInfo.balance
  const status = providerInfo.status
  const [switchTable, setSwitchTable] = React.useState(true)

  function handleSwitchTable() {
    if (switchTable === true) {
      setSwitchTable(false)
    } else {
      setSwitchTable(true)
    }
  }
  const handlePageChange = (switchTable, nextPage) => {
    if (switchTable) {
      setPageService(nextPage)
    } else {
      setPageTrans(nextPage)
    }
  }

  return (
    <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
      <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
        <div className="pr-4 rounded-full">
          <Avatar src={avatarUrl} size={200} />
        </div>
        <div className="flex flex-col justify-end w-2/5 ">
          <div className="h-12 text-white">
            Tên: <span className="font-bold">{name}</span>
          </div>
          <div className="h-12 text-white">
            Ngày tham gia: <span className="font-bold">{createdAt}</span>
          </div>
        </div>
        <div className="flex flex-col justify-end w-2/5 ">
          <div className="h-12 text-white">
            Gmail: <span className="font-bold">{email}</span>
          </div>
          <div className="h-12 text-white">
            Số Điện Thoại: <span className="font-bold">{phone}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-6 text-white ">
          Đánh giá: <span className="font-bold">{rating}</span>
        </div>
        <div className="h-6 text-white ">
          Số giờ đã phục vụ: <span className="font-bold">{servicedTime}</span>
        </div>
        <div className="h-6 text-white ">
          Số dư: <span className="font-bold">{balance}</span>
        </div>
      </div>
      <div className="flex h-10 mt-4">
        <div className="flex flex-col">
          <Button isActive={false} onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Dịch vụ cung cấp
          </Button>
          {switchTable && <div className="border-b-2 border-[#7463F0] mx-4 mr-6"></div>}
        </div>
        <div className="flex flex-col w-40 ">
          <Button isActive={false} onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Lịch sử giao dịch
          </Button>
          {!switchTable && <div className="border-b-2 border-[#7463F0] mx-4"></div>}
        </div>
      </div>
      <div>
        {switchTable && (
          <ProviderServiceTable isLoading={isListSkillLoading || isListSkillFetching} data={dataProviderSkills} />
        )}
        {!switchTable && (
          <TransactionTable isLoading={isListTransLoading || isListTransFetching} data={dataProviderTranHistory} />
        )}
        <div className="flex w-full justify-center pb-[200px] mt-5">
          <Pagination
            itemRender={(page, type) => (
              <div className="text-white">
                {type == 'prev' ? (
                  <Left theme="outline" size="24" fill="#fff" />
                ) : type == 'next' ? (
                  <Right theme="outline" size="24" fill="#fff" />
                ) : (
                  page
                )}
              </div>
            )}
            pageSize={switchTable ? PAGE_SIZE_SERVICE : PAGE_SIZE_TRANS}
            current={switchTable ? pageService : pageTrans}
            total={switchTable ? providerSkills?.count : providerTransHistory?.count}
            onChange={(nextPage) => {
              handlePageChange(switchTable, nextPage)
            }}
          />
        </div>
      </div>
    </div>
  )
}
