import { Button } from '@ume/ui'

import * as React from 'react'

import { Avatar } from 'antd'
import Image from 'next/image'
import { AdminGetProviderResponse } from 'ume-service-openapi'

import ProviderServiceTable from './provider-service-table'
import TransactionTable from './transaction-table'

import { trpc } from '~/utils/trpc'

export interface IProviderInfoProps {
  providerId: any
  providerInfo: any
}

export default function ProviderInfo({ providerInfo, providerId }: IProviderInfoProps) {
  const [providerDetail, setProviderDetail] = React.useState<AdminGetProviderResponse | undefined>()
  const SELECT_SKILL = [
    '$all',
    {
      providerSkills: [
        {
          providerSkills: [
            {
              skill: ['imageUrl', 'name', 'createdAt'],
            },
          ],
        },
      ],
    },
  ]
  const { isLoading: isUserListLoading, isFetching: isUserListFetching } = trpc.useQuery(
    [
      'provider.getProviderDetail',
      {
        slug: providerId,
        select: JSON.stringify(SELECT_SKILL),
      },
    ],
    {
      onSuccess(data) {
        setProviderDetail(data.data)
      },
    },
  )

  console.log(providerDetail)
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

  return (
    <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
      <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
        <div className="pr-4 rounded-full">
          <Avatar src={avatarUrl} size={200} />
          {/* <Image src={data.avatarUrl} width={150} height={200} alt="Personal Infor" className="rounded-full" /> */}
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
          <Button onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Dịch vụ cung cấp
          </Button>
          {switchTable && <div className="border-b-2 border-[#7463F0] mx-4 mr-6"></div>}
        </div>
        <div className="flex flex-col w-40 ">
          <Button onClick={handleSwitchTable} customCSS="hover:text-gray-400">
            Lịch sử giao dịch
          </Button>
          {!switchTable && <div className="border-b-2 border-[#7463F0] mx-4"></div>}
        </div>
      </div>
      <div>
        {switchTable && <ProviderServiceTable />}
        {!switchTable && <TransactionTable />}
      </div>
    </div>
  )
}
