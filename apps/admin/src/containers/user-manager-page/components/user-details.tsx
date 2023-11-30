import { Left, Right } from '@icon-park/react'
import coinIcon from 'public/coin-icon.png'

import { useState } from 'react'

import { Pagination, Table } from 'antd'
import Image from 'next/image'
import { BalanceHistoryPagingResponse, UserBalanceResponse } from 'ume-service-openapi'

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
  const [transaction, setTransaction] = useState<BalanceHistoryPagingResponse>()
  const [total, setTotal] = useState<UserBalanceResponse>()
  const [page, setPage] = useState(1)
  const ORDER = [{ id: 'asc' }]

  const { isLoading } = trpc.useQuery(
    [
      'user.getUserCoinHistories',
      { slug: details?.key, page: page.toString(), where: undefined, order: JSON.stringify(ORDER) },
    ],
    {
      onSuccess(data) {
        setTransaction(data.data)
      },
    },
  )

  trpc.useQuery(['user.getUserTotalCoin', { slug: details?.key }], {
    onSuccess(data) {
      setTotal(data.data)
    },
  })

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
      title: <div className="flex items-center justify-center">Số tiền</div>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <div className="flex items-center justify-center">
          {formatNumberWithCommas(amount)} <span className="text-xs italic"> đ</span>
        </div>
      ),
    },
  ]

  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }
  function formatNumberWithCommas(number) {
    return parseFloat(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <ModalBase
      titleValue="Thông tin tài khoản"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <PersionalInfo data={details} />
      <div className="flex items-center justify-between px-4 mt-5 text-white">
        <span>Biến động số dư</span>
        <div className="border-b-2 border-[#7463F0] mx-4 mr-6"></div>

        <div className=" flex items-center text-white w-[6rem]">
          Số dư: {formatNumberWithCommas(total?.totalBalance) || 0} <span className="text-xs italic"> đ</span>
        </div>
      </div>
      <div className="px-4 my-4">
        <Table
          loading={isLoading}
          pagination={false}
          locale={locale}
          columns={columns}
          dataSource={tableDataMapping(transaction?.row)}
        />
        <div className="flex justify-center w-full mt-5 mb-2">
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
