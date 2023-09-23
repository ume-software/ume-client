import * as React from 'react'

import { Table } from 'antd'
import Image from 'next/image'

import servicePictureDummy from '../../../public/service.jpg'

export interface IProviderServiceTableProps {}

export default function ProviderServiceTable(props: IProviderServiceTableProps) {
  const data = [
    {
      picture: servicePictureDummy,
      service: 'Liên minh huyền thoại',
      createDate: '28/09/2022',
      serveTime: 63,
      bookedNumber: 2,
      rating: 2.3,
      revenue: 1138,
    },
    {
      picture: servicePictureDummy,
      service: 'Liên minh huyền thoại',
      createDate: '09/11/2022',
      serveTime: 89,
      bookedNumber: 11,
      rating: 3.7,
      revenue: 764,
    },
    {
      picture: servicePictureDummy,
      service: 'Liên minh huyền thoại',
      createDate: '10/01/2023',
      serveTime: 97,
      bookedNumber: 1,
      rating: 4.1,
      revenue: 265,
    },
    {
      picture: servicePictureDummy,
      service: 'Liên minh huyền thoại',
      createDate: '30/05/2023',
      serveTime: 184,
      bookedNumber: 5,
      rating: 3.4,
      revenue: 1844,
    },
    {
      picture: servicePictureDummy,
      service: 'Liên minh huyền thoại',
      createDate: '15/01/2023',
      serveTime: 14,
      bookedNumber: 3,
      rating: 3.8,
      revenue: 1609,
    },
  ]
  const columnsService = [
    {
      title: 'Hình ảnh',
      dataIndex: 'picture',
      key: 'picture',
      render: (text) => <Image src={text} width={50} height={50} alt="Service Img" className="" />,
    },
    {
      title: 'Tên kỹ năng',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: 'Số giờ phục vụ',
      dataIndex: 'serveTime',
      key: 'serveTime',
    },
    {
      title: 'Số người thuê',
      dataIndex: 'bookedNumber',
      key: 'bookedNumber',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
    },
  ]
  return <Table columns={columnsService} dataSource={data} className="z-0" />
}
