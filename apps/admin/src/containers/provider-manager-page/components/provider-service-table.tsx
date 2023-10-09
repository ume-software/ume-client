import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

export interface IProviderServiceTableProps {
  data: any
}

export default function ProviderServiceTable(props: IProviderServiceTableProps) {
  const { data } = props
  const columnsService = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => <Image src={text} width={50} height={50} alt="Skill Img" className="" />,
    },
    {
      title: 'Tên kỹ năng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (createDate) => (
        <div className="flex justify-start">{new Date(createDate).toLocaleDateString('en-GB')}</div>
      ),
    },
    {
      title: 'Số giờ phục vụ',
      dataIndex: 'totalBookingPeriod',
      key: 'totalBookingPeriod',
    },
    {
      title: 'Số người thuê',
      dataIndex: 'totalBooking',
      key: 'totalBooking',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
    },
  ]
  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  return <Table locale={locale} pagination={false} columns={columnsService} dataSource={data} className="z-0" />
}
