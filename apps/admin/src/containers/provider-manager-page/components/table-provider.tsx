import { Eyes, ReduceOne } from '@icon-park/react'
import { Button } from '@ume/ui'

import * as React from 'react'
import { useState } from 'react'

import { Space, Table, Tag, Tooltip, notification } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'
import ProviderDetail from './provider-detail'

import BanModal from '~/components/modal-base/ban-modal'

import { trpc } from '~/utils/trpc'

export default function TableProviders({ data, isLoading }) {
  const utils = trpc.useContext()
  const [openProviderDetail, setOpenProviderDetail] = useState(false)
  const [providerId, setProviderId] = useState(null)
  const [providerName, setProviderName] = useState(null)
  const [isBanedProvider, setIsBanedProvider] = useState(null)
  const [openBanProvider, setOpenBanProvider] = useState(false)
  const BanProvider = trpc.useMutation(['provider.BanProvider'])
  const UnBanProvider = trpc.useMutation(['provider.UnBanProvider'])

  function openProviderDetailHandle(providerId) {
    setProviderId(providerId)
    setOpenProviderDetail(true)
  }
  function closeProviderDetailHandle() {
    setOpenProviderDetail(false)
  }
  function closeBanProviderHandle() {
    setOpenBanProvider(false)
  }
  function HandleBanFunction(content) {
    if (!isBanedProvider) {
      try {
        let req = { slug: providerId! }
        content
          ? (req['adminHandleBanProviderRequest'] = {
              content: content,
            })
          : req
        BanProvider.mutate(req, {
          onSuccess: (data) => {
            if (data.success) {
              notification.success({
                message: 'Chặn Người Cung Cấp thành công!',
                description: 'Người Cung Cấp Đã Bị Chặn',
              })
              utils.invalidateQueries('provider.getProviderList')
            }
          },
        })
      } catch (error) {
        console.error('Failed to Handle Ban/Unban Provider:', error)
      }
    } else {
      try {
        UnBanProvider.mutate(
          {
            slug: providerId!!,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Bỏ Chặn Người Cung Cấp thành công!',
                  description: 'Người Cung Cấp Đã Được Bỏ Chặn',
                })
                utils.invalidateQueries('provider.getProviderList')
              }
            },
          },
        )
      } catch (error) {
        console.error('Failed to Handle Ban/Unban Provider:', error)
      }
    }
  }
  function banProviderHandle(providerId, providerName, isBanned) {
    setProviderId(providerId)
    setProviderName(providerName)
    setOpenBanProvider(true)
    setIsBanedProvider(isBanned)
  }
  const [arrow] = useState('Show')
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
      render: (isBanned) => (
        <div className="flex items-center justify-center">
          {!isBanned ? (
            <Tag className="px-3 py-2 m-0 text-white bg-green-500 rounded-lg">Hoạt động</Tag>
          ) : (
            <Tag className="px-3 py-2 m-0 text-white bg-red-500 rounded-lg">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (joinDate) => <div className="flex justify-start">{new Date(joinDate).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Xem Chi Tiết">
            <div>
              <Button
                isActive={false}
                onClick={(e) => {
                  openProviderDetailHandle(record.id)
                }}
                customCSS="hover:bg-gray-500"
              >
                <Eyes theme="outline" size="24" fill="#fff" />
              </Button>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={record.isBanned ? 'Bỏ chặn' : 'Chặn'}>
            <div>
              <Button
                isActive={false}
                onClick={(e) => {
                  banProviderHandle(record.id, record.name, record.isBanned)
                }}
                customCSS="hover:bg-gray-500"
              >
                <ReduceOne theme="outline" size="24" fill={record.isBanned ? '#ff0000' : '#ffffff'} />
              </Button>
            </div>
          </Tooltip>
        </Space>
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

  return (
    <div>
      <Table
        loading={isLoading}
        locale={locale}
        pagination={false}
        columns={columnsProvider}
        dataSource={data}
        className="z-0"
      />
      {openProviderDetail && (
        <ProviderDetail
          providerInfo={data}
          providerId={providerId}
          openValue={openProviderDetail}
          closeFunction={closeProviderDetailHandle}
        />
      )}
      <BanModal
        isBanned={isBanedProvider}
        name={providerName}
        closeFunction={closeBanProviderHandle}
        openValue={openBanProvider}
        excuteFunction={HandleBanFunction}
      />
    </div>
  )
}
