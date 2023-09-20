import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

export interface ITransactionTableProps {}

export default function TransactionTable(props: ITransactionTableProps) {
  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  const data = [
    {
      member: 'Lynnelle Gaddas',
      bookingDate: '30/10/2022',
      skill: 'Liên minh huyền thoại',
      serveTime: 7,
      status: 'done',
      mountMoney: 237,
      feedback: 'Thằng này ngáo',
    },
    {
      member: 'Jemimah Tranfield',
      bookingDate: '07/05/2023',
      skill: 'Liên minh huyền thoại',
      serveTime: 19,
      status: 'done',
      mountMoney: 1556,
      feedback: 'Thằng này ngáo',
    },
    {
      member: 'Cathy Ridhole',
      bookingDate: '08/06/2023',
      skill: 'Liên minh huyền thoại',
      serveTime: 24,
      status: 'done',
      mountMoney: 1309,
      feedback: 'Thằng này ngáo',
    },
    {
      member: 'Hester Weatherby',
      bookingDate: '25/01/2023',
      skill: 'Liên minh huyền thoại',
      serveTime: 16,
      status: 'done',
      mountMoney: 777,
      feedback: 'Thằng này ngáo',
    },
    {
      member: 'Elspeth Khrishtafovich',
      bookingDate: '09/03/2023',
      skill: 'Liên minh huyền thoại',
      serveTime: 21,
      status: 'done',
      mountMoney: 308,
      feedback: 'Thằng này ngáo',
    },
  ]
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
        <div className="flex justify-center">{new Date(bookingDate).toLocaleDateString('en-GB')}</div>
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
    {
      title: 'Phản hồi',
      dataIndex: 'feedback',
      key: 'feedback',
    },
  ]
  return <Table locale={locale} pagination={false} columns={columnsService} dataSource={data} className="z-0" />
}
