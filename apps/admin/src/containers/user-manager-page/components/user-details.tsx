import { Left, Right } from '@icon-park/react'

import { useState } from 'react'

import { Pagination, Table } from 'antd'
import Image from 'next/image'
import { CoinHistoryPagingResponse } from 'ume-service-openapi'

import EmptyErrorPic from '../../../../public/empty_error.png'

import ModalBase from '~/components/modal-base'
import PersionalInfo from '~/components/persional-info'

import { trpc } from '~/utils/trpc'

export interface IUserDetailsProps {
  closeFunction: any | undefined
  openValue: boolean
  details: any
}

const tableDataMapping = (data?) => {
  const list: {}[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        ...item,
      }
      list.push(rowItem)
    })
  }
  return list
}

export default function UserDetails({ details, openValue, closeFunction }: IUserDetailsProps) {
  const [transaction, setTransaction] = useState<CoinHistoryPagingResponse>()
  const [page, setPage] = useState(1)

  const { isLoading, isFetching } = trpc.useQuery(
    ['user.getUserCoinHistories', { slug: details?.key, page: page.toString(), where: undefined, order: undefined }],
    {
      onSuccess(data) {
        setTransaction(data.data)
      },
    },
  )

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage)
  }
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
      <div className="w-full h-full flex justify-center items-center">
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
      <PersionalInfo data={details} />
      <div className="flex justify-between text-white mt-5 px-4">
        <span>Biến động số dư</span>
        <div className="border-b-2 border-[#7463F0] mx-4 mr-6"></div>

        <div className="h-6 text-white w-[6rem]">
          Số dư: <span className="font-bold"></span>
        </div>
      </div>
      <div className="my-4 px-4">
        <Table pagination={false} locale={locale} columns={columns} dataSource={tableDataMapping(transaction?.row)} />
        <div className="flex w-full justify-center mb-2 mt-5">
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
            pageSize={10}
            current={page}
            total={transaction?.count}
            onChange={(page) => {
              handlePageChange(page)
            }}
          />
        </div>
      </div>
    </ModalBase>
  )
}
