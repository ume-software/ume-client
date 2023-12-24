import { Left, Right, Star } from '@icon-park/react'
import { Button } from '@ume/ui'
import coinIcon from 'public/coin-icon.png'
import EmptyErrorPic from 'public/empty_error.png'

import * as React from 'react'

import { Avatar, Pagination } from 'antd'
import Image from 'next/image'
import {
  AdminGetBookingStatisticResponse,
  AdminGetProviderServicePagingResponse,
  BookingHistoryPagingResponse,
} from 'ume-service-openapi'

import ProviderServiceTable from './provider-service-table'
import TransactionTable from './transaction-table'

import { trpc } from '~/utils/trpc'

export interface IProviderInfoProps {
  providerId: any
  providerInfo: any
}

export default function ProviderInfo({ providerInfo, providerId }: IProviderInfoProps) {
  const [providerSkills, setProviderSkills] = React.useState<AdminGetProviderServicePagingResponse | undefined>()
  const [providerBookingStatistics, setProviderBookingStatistics] = React.useState<
    AdminGetBookingStatisticResponse | undefined
  >()
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
    { $where: { deletedAt: null } },
  ]
  const SELECT_TRANS = [
    '$all',
    {
      booker: ['$all'],
    },
    {
      providerService: [
        '$all',
        {
          service: ['$all'],
        },
        { $where: { deletedAt: null } },
      ],
    },
  ]
  const { isLoading: isListSkillLoading } = trpc.useQuery(
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
  const { isLoading: isListStatisticsLoading, isFetching: isListStatisticsFetching } = trpc.useQuery(
    [
      'provider.getProviderBookingStatistics',
      {
        slug: providerId,
      },
    ],
    {
      onSuccess(data) {
        setProviderBookingStatistics(data.data)
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
      totalRevenue: row.totalRevenue,
      ...row,
    }
  })

  const { isLoading: isListTransLoading } = trpc.useQuery(
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
      ...row,
    }
  })

  const name = providerInfo.name
  const avatarUrl = providerInfo.avatarUrl
  const createdAt = new Date(providerInfo.createdAt).toLocaleDateString('en-GB')
  const email = providerInfo.Gmail
  const phone = providerInfo.phone
  const rating = providerBookingStatistics?.star?.toFixed(1) ?? ''
  const servicedTime = providerBookingStatistics?.totalTime?.toFixed(0) ?? ''
  const balance = providerBookingStatistics?.totalRevenue?.toFixed(0) ?? ''
  const status = providerInfo.status
  const [switchTable, setSwitchTable] = React.useState(true)

  const handleSwitchTable = () => {
    if (switchTable) {
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
  function formatNumberWithCommas(number) {
    return parseFloat(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
      <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
        <div className="pr-4 rounded-full">
          <Avatar src={avatarUrl || EmptyErrorPic} size={200} />
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
        <div className="flex h-6 text-white">
          Đánh giá:
          <span className="inline-block ml-1 font-bold">
            {rating}
            {rating && (
              <Star className="inline-block ml-1" theme="filled" size="12" fill="#FFBB00" strokeLinejoin="bevel" />
            )}
            {!rating && 'Chưa có đánh giá'}
          </span>
        </div>
        <div className="h-6 text-white ">
          Số giờ đã phục vụ:
          <span className="ml-1 font-bold">
            {servicedTime} {servicedTime && ' h'}
            {!servicedTime && 'Chưa có giờ phục vụ'}
          </span>
        </div>
        <div className="h-6 text-white ">
          Doanh Thu:
          <span className="inline-block ml-1 font-bold">
            {balance && formatNumberWithCommas(balance)}
            {balance ? <span className="text-xs italic"> đ</span> : 'Chưa có doanh thu'}
          </span>
        </div>
      </div>
      <div className="flex justify-between w-64 h-10 mt-4">
        <div className="flex flex-col">
          <Button isActive={false} onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Dịch vụ cung cấp
          </Button>
          {switchTable && <div className="border-b-2 border-[#7463F0] mx-4 "></div>}
        </div>
        <div className="flex flex-col">
          <Button isActive={false} onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Lịch sử giao dịch
          </Button>
          {!switchTable && <div className="border-b-2 border-[#7463F0] mx-4 "></div>}
        </div>
      </div>
      <div>
        {switchTable && <ProviderServiceTable isLoading={isListSkillLoading} data={dataProviderSkills} />}
        {!switchTable && <TransactionTable isLoading={isListTransLoading} data={dataProviderTranHistory} />}
        <div className="flex w-full justify-center pb-[3rem] mt-5">
          <Pagination
            itemRender={(page, type) => (
              <div className="text-white">
                {type == 'prev' ? (
                  <div className="mt-1.5 ml-1">
                    <Left theme="outline" size="24" fill="#fff" />
                  </div>
                ) : type == 'next' ? (
                  <div className="mt-1.5">
                    <Right theme="outline" size="24" fill="#fff" />
                  </div>
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
