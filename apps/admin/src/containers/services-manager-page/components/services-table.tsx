import { CheckOne, Eyes, ReduceOne, Write } from '@icon-park/react'
import { Button } from '@ume/ui'
import EmptyErrorPic from 'public/empty_error.png'

import React, { useState } from 'react'

import { Table, Tag } from 'antd'
import Image from 'next/image'

import { trpc } from '~/utils/trpc'

const tableDataMapping = (data?) => {
  const list: {}[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        ...item,
      }
      list.push(rowItem)
    })
  }
  return list
}
const ServicesTable = ({ servicesList, isLoading }) => {
  const utils = trpc.useContext()

  const listData = tableDataMapping(servicesList?.row)

  const columns = [
    {
      title: <div className="w-full flex justify-center">Hình ảnh</div>,
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <div className="w-full flex justify-center">
          <Image src={imageUrl} width={70} height={100} alt={imageUrl} className="rounded-lg" />
        </div>
      ),
    },
    {
      title: 'Tên',
      key: 'name',
      render: (record) => (
        <div>
          <p>{record.name}</p>
          <p>{record.viName}</p>
        </div>
      ),
    },

    {
      title: 'Số người dùng',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: <div className="flex items-center justify-center">Trạng thái</div>,
      key: 'isBanned',
      dataIndex: 'isBanned',
      render: (text) => (
        <div className="flex items-center justify-center">
          {!text ? (
            <Tag className="px-3 py-2 m-0 text-white bg-green-500 rounded-lg">Hoạt động</Tag>
          ) : (
            <Tag className="px-3 py-2 m-0 text-white bg-red-500 rounded-lg">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: <div className="flex items-center justify-center">Ngày tạo</div>,
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date) => <div className="flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return (
          <>
            <div className="flex justify-end w-full">
              <Button isActive={false}>
                <Eyes
                  onClick={() => {}}
                  className="p-2 mr-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#fff"
                />
              </Button>
              <Button isActive={false}>
                <Write
                  onClick={() => {}}
                  className="p-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#1677ff"
                />
              </Button>
              <Button isActive={false} onClick={() => {}}>
                {record.isActivated ? (
                  <ReduceOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#ff0000" />
                ) : (
                  <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#22c55e" />
                )}
              </Button>
            </div>
          </>
        )
      },
    },
  ]

  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full font-bold text-2xl text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }

  return (
    <div className="mt-5 ">
      <Table loading={isLoading} locale={locale} pagination={false} columns={columns} dataSource={listData} />

      {/* <ComfirmModal
        closeFunction={handlecloseBan}
        openValue={openBanUser}
        isComfirmFunction={handleBanFunction}
        titleValue={!isBannedUser ? 'Xác nhận chặn' : 'Xác nhận bỏ chặn'}
      >
        <div className="p-4 text-white">
          Bạn có chắc chắn muốn {!isBannedUser ? ' chặn ' : ' bỏ chặn '}
          {userName}
        </div>
      </ComfirmModal> */}
    </div>
  )
}

export default ServicesTable
