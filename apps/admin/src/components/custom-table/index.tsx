import { BaseballBat, Eyes, ReduceOne } from '@icon-park/react'
import { Button } from '@ume/ui'

import * as React from 'react'

import { Space, Table, Tag, Tooltip } from 'antd'

export default function TableProviders({ data }) {
  const [arrow, setArrow] = React.useState('Show')
  const mergedArrow = React.useMemo(() => {
    if (arrow === 'Hide') {
      return false
    }
    if (arrow === 'Show') {
      return true
    }
    return {
      pointAtCenter: true,
    }
  }, [arrow])
  const columnsProvider = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Gmail',
      dataIndex: 'Gmail',
      key: 'Gmail',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: <div className="flex justify-center w-full px-0 mx-0">Trạng Thái</div>,
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => {
        let color = 'bg-green-500'
        if (status === 'Bị Chặn') {
          color = 'bg-red-500'
        }
        return (
          <div className="flex justify-center w-full">
            <Tag color={color} key={status} className={`text-white ${color}`}>
              {status.toUpperCase()}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Xem Chi Tiết" arrow={mergedArrow}>
            <Button>
              <Eyes theme="outline" size="24" fill="#fff" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Chặn" arrow={mergedArrow}>
            <Button>
              <ReduceOne theme="outline" size="24" fill="#ff0000" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table columns={columnsProvider} dataSource={data} className="z-0" />
    </div>
  )
}
