import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

export interface ITransactionTableProps {
  data: any
}

export default function TransactionTable(props: ITransactionTableProps) {
  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
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
      title: 'Số tiền',
      dataIndex: 'mountMoney',
      key: 'mountMoney',
    },
  ]
  return <Table locale={locale} pagination={false} columns={columnsService} dataSource={data} className="z-0" />
}
