import { BaseballBat, Eyes, ReduceOne } from '@icon-park/react'
import { Button } from '@ume/ui'

import * as React from 'react'
import { useState } from 'react'

import { Space, Table, Tag, Tooltip } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'
import ProviderDetail from './provider-detail'

import BanModal from '~/components/modal-base/ban'

export default function TableProviders({ data }) {
  const [openProviderDetail, setOpenProviderDetail] = useState(false)
  const [providerId, setProviderId] = useState(null)
  const [providerName, setProviderName] = useState(null)
  const [openBanProvider, setOpenBanProvider] = useState(false)

  function openProviderDetailHandle(providerId) {
    console.log(providerId)
    setProviderId(providerId)
    setOpenProviderDetail(true)
  }
  function closeProviderDetailHandle() {
    setOpenProviderDetail(false)
  }
  function closeBanProviderHandle() {
    setOpenBanProvider(false)
  }
  function banProviderHandle(providerId, providerName) {
    setProviderId(providerId)
    setProviderName(providerName)
    setOpenBanProvider(true)
  }
  const [arrow, setArrow] = useState('Show')
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
      key: 'isBanned',
      dataIndex: 'isBanned',
      render: (_, { isBanned }) => {
        let textStatus = 'Hoạt động'
        let color = 'bg-green-500'
        if (isBanned) {
          textStatus = 'Bị Chặn'
          color = 'bg-red-500'
        }
        return (
          <div className="flex justify-center w-full">
            <Tag color={color} key={isBanned} className={`text-white ${color} px-3 py-2 rounded-lg`}>
              {textStatus.toUpperCase()}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (joinDate) => <div className="flex justify-center">{new Date(joinDate).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Xem Chi Tiết" arrow={mergedArrow}>
            <Button
              onClick={(e) => {
                console.log(record.id)
                openProviderDetailHandle(record.id)
              }}
            >
              <Eyes theme="outline" size="24" fill="#fff" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Chặn" arrow={mergedArrow}>
            <Button
              onClick={(e) => {
                banProviderHandle(record.id, record.name)
              }}
            >
              <ReduceOne theme="outline" size="24" fill="#ff0000" />
            </Button>
          </Tooltip>
        </Space>
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

  return (
    <div>
      <Table locale={locale} pagination={false} columns={columnsProvider} dataSource={data} className="z-0" />
      <ProviderDetail
        providerInfo={data}
        providerId={providerId}
        openValue={openProviderDetail}
        closeFunction={closeProviderDetailHandle}
      />
      <BanModal
        providerId={providerId}
        name={providerName}
        closeFunction={closeBanProviderHandle}
        openValue={openBanProvider}
      />
    </div>
  )
}
