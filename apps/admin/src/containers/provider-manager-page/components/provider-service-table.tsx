import coinIcon from 'public/coin-icon.png'

import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

export interface IProviderServiceTableProps {
  data: any
  isLoading: boolean
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
      render: (text) => {
        return <div>{text ? text : 0} h</div>
      },
    },
    {
      title: 'Số người thuê',
      dataIndex: 'totalBooking',
      key: 'totalBooking',
      render: (text) => {
        return text ? text : 0
      },
    },
    // {
    //   title: 'Đánh giá',
    //   dataIndex: 'rating',
    //   key: 'rating',
    // },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (text) => (
        <div>
          {' '}
          {text ? text : 0} <Image className="inline-block" alt="Xu" src={coinIcon} width={25} height={25} />
        </div>
      ),
    },
  ]
  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  console.log(data)
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
