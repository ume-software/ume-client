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
        <div className="w-14 flex justify-center">
          {text == 'FEMALE' ? <>Nữ</> : text == 'MALE' ? <>Nam</> : <>Khác</>}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isBaned',
      dataIndex: 'isBaned',
      render: (text) => (
        <div className="flex justify-center items-center">
          {!text ? (
            <Tag className="bg-green-500 rounded-lg text-white px-3 py-2">Hoạt động</Tag>
          ) : (
            <Tag className="bg-red-500 rounded-lg text-white px-3 py-2">Tạm dừng</Tag>
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
                className="mr-2 rounded-full hover:bg-gray-500 p-2"
                theme="outline"
                size="24"
                fill="#fff"
              />
              <ReduceOne
                onClick={() => handleOpenBan(record)}
                className="rounded-full hover:bg-gray-500 p-2"
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
      <div className="w-full h-full flex justify-center items-center">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }

  return (
    <div className=" mt-5">
      <Table locale={locale} pagination={false} columns={columns} dataSource={listData} />

      <UserDetails data={userDetails} openValue={openUserDetail} closeFunction={handlecloseUserDetails} />
      <BanModal name={'Que'} closeFunction={handlecloseBan} openValue={openBanUser} />
    </div>
  )
}

export default UserTable
