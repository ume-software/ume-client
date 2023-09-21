import { CloseSmall, Eyes, H, Left, ReduceOne, Right } from '@icon-park/react'
import { Modal } from '@ume/ui'

import React, { useState } from 'react'

import { Badge, Pagination, Space, Table, Tag } from 'antd'
import Image from 'next/image'
import { UserInformationPagingResponse } from 'ume-service-openapi'
import { string } from 'zod'

import EmptyErrorPic from '../../../../public/empty_error.png'
import UserDetails from './user-details'

import BanModal from '~/components/modal-base/ban'

const tableDataMapping = (data) => {
  const list: {
    key: any
    avatarUrl: ''
    createdAt: ''
    dob: ''
    email: ''
    gender: ''
    isBanned: false
    name: ''
    phone: ''
    slug: ''
  }[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        name: item.name,
        slug: item.slug,
        email: item.email,
        phone: item.phone,
        gender: item.gender,
        dob: item.dob,
        avatarUrl: item.avatarUrl,
        isBanned: item.isBanned,
        createdAt: item.createdAt,
      }
      list.push(rowItem)
    })
  }
  return list
}

const UserTable = ({ userList }) => {
  const [openUserDetail, setOpenUserDetail] = useState(false)
  const [openBanUser, setOpenBanUser] = useState(false)
  const [userDetails, setUserDetails] = useState<{}>()

  const listData = tableDataMapping(userList?.row)
  const handleOpenUserDetails = (record) => {
    setUserDetails(record)

    setOpenUserDetail(true)
  }
  const handlecloseUserDetails = () => {
    setOpenUserDetail(false)
  }

  const handleOpenBan = (record) => {
    setOpenBanUser(true)
  }
  const handlecloseBan = () => {
    setOpenBanUser(false)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Gmail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (
        <div className="flex justify-center w-14">
          {text == 'FEMALE' ? <>Nữ</> : text == 'MALE' ? <>Nam</> : <>Khác</>}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isBaned',
      dataIndex: 'isBaned',
      render: (text) => (
        <div className="flex items-center justify-center">
          {!text ? (
            <Tag className="px-3 py-2 text-white bg-green-500 rounded-lg">Hoạt động</Tag>
          ) : (
            <Tag className="px-3 py-2 text-white bg-red-500 rounded-lg">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
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
            <div className="flex">
              <Eyes
                onClick={() => handleOpenUserDetails(record)}
                className="p-2 mr-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="24"
                fill="#fff"
              />
              <ReduceOne
                onClick={() => handleOpenBan(record)}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="24"
                fill="#ff0000"
              />
            </div>
          </>
        )
      },
    },
  ]

  let locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }

  return (
    <div className="mt-5 ">
      <Table locale={locale} pagination={false} columns={columns} dataSource={listData} />

      <UserDetails data={userDetails} openValue={openUserDetail} closeFunction={handlecloseUserDetails} />
      <BanModal name={'Que'} closeFunction={handlecloseBan} openValue={openBanUser} />
    </div>
  )
}

export default UserTable
