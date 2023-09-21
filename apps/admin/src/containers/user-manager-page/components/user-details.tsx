import { useState } from 'react'

import { Table } from 'antd'
import Image from 'next/image'
import { CoinHistoryPagingResponse } from 'ume-service-openapi'

import EmptyErrorPic from '../../../../public/empty_error.png'

import ModalBase from '~/components/modal-base'
import PersionalInfo from '~/components/persional-info'

import { trpc } from '~/utils/trpc'

export interface IUserDetailsProps {
  closeFunction: any | undefined
  openValue: boolean
  data: any
}

export default function UserDetails({ data, openValue, closeFunction }: IUserDetailsProps) {
  const [transaction, setTransaction] = useState<CoinHistoryPagingResponse>()
  const [page, setPage] = useState(1)

  const { isLoading: isUserListLoading, isFetching: isUserListFetching } = trpc.useQuery(
    ['user.getUserCoinHistories', { slug: data?.key, page: page.toString(), where: undefined, order: undefined }],
    {
      onSuccess(data) {
        setTransaction(data.data)
      },
    },
  )

  const columns = [
    {
      title: 'Ngày giao dịch',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date) => <div className="flex">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'coinType',
      key: 'coinType',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
  ]

  let locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={250} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  return (
    <ModalBase
      titleValue="Thông tin tài khoản"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <PersionalInfo data={data} />
      <div className="flex justify-between px-4 mt-5 text-white">
        <span>Biến động số dư</span>
        <div className="border-b-2 border-[#7463F0] mx-4 mr-6"></div>

        <div className="h-6 text-white w-[6rem]">
          Số dư: <span className="font-bold"></span>
        </div>
      </div>
      <div className="px-4 my-4">
        <Table pagination={false} locale={locale} columns={columns} dataSource={transaction?.row} />
      </div>
    </ModalBase>
  )
}
