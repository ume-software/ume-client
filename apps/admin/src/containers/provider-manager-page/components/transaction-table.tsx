import coinIcon from 'public/coin-icon.png'

import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

export interface ITransactionTableProps {
  data: any
  isLoading?: boolean
}

export default function TransactionTable(props: ITransactionTableProps) {
  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }
  const { data } = props
  function formatNumberWithCommas(number) {
    return parseFloat(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const columnsService = [
    {
      title: 'Người dùng',
      dataIndex: 'member',
      key: 'member',
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (bookingDate) => (
        <div className="flex justify-start">{new Date(bookingDate).toLocaleDateString('en-GB')}</div>
      ),
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
    },
    {
      title: 'Giờ phục vụ',
      dataIndex: 'serveTime',
      key: 'serveTime',
      render: (text) => {
        return <div>{text ? text : 0} h</div>
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: <div className="flex">Số tiền</div>,
      dataIndex: 'mountMoney',
      key: 'mountMoney',
      render: (text) => (
        <div>
          {' '}
          {text ? formatNumberWithCommas(text) : 0} <span className="text-xs italic"> đ</span>
        </div>
      ),
    },
  ]
  return (
    <Table
      loading={props.isLoading}
      locale={locale}
      pagination={false}
      columns={columnsService}
      dataSource={data}
      className="z-0"
    />
  )
}
