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
      <div className="flex flex-col items-center justify-center w-full h-full font-bold text-2xl text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }
  const { data } = props
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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: <div className="flex justify-center items-center">Số tiền</div>,
      dataIndex: 'mountMoney',
      key: 'mountMoney',
      render: (mountMoney) => (
        <div className="flex justify-center items-center">
          {mountMoney} <Image alt="Xu" src={coinIcon} width={30} height={30} />
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
