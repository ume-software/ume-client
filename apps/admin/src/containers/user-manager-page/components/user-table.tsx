import { CheckOne, Eyes, ReduceOne } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Table, Tag, notification } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'
import UserDetails from './user-details'

import { mappingGender } from '~/components/filter-items'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

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

const UserTable = ({ userList, isLoading }) => {
  const utils = trpc.useContext()
  const [openUserDetail, setOpenUserDetail] = useState(false)
  const [openBanUser, setOpenBanUser] = useState(false)
  const [userDetails, setUserDetails] = useState<{}>()
  const [userName, setUserName] = useState(null)
  const [isBannedUser, setisBannedUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const banUser = trpc.useMutation(['user.banUser'])
  const unBanUser = trpc.useMutation(['user.unBanUser'])

  const listData = tableDataMapping(userList?.row)
  const handleOpenUserDetails = (record) => {
    setUserDetails(record)

    setOpenUserDetail(true)
  }
  const handlecloseUserDetails = () => {
    setOpenUserDetail(false)
  }

  const handleOpenBan = (record) => {
    setUserId(record.key)
    setUserName(record.name)
    setisBannedUser(record.isBanned)

    setOpenBanUser(true)
  }
  const handlecloseBan = () => {
    setOpenBanUser(false)
  }

  const handleBanFunction = () => {
    if (!isBannedUser) {
      try {
        banUser.mutate(
          {
            slug: userId!!,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Chặn người dùng thành công!',
                  description: 'người dùng đã bị chặn',
                  placement: 'bottomLeft',
                })
                utils.invalidateQueries('user.getUserList')
              }
            },
          },
        )
      } catch (error) {
        console.error('Failed to Handle Ban/Unban User', error)
      }
    } else {
      try {
        unBanUser.mutate(
          {
            slug: userId!!,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Bỏ chặn người dùng thành công!',
                  description: 'Người dùng đã được bỏ chặn',
                  placement: 'bottomLeft',
                })
                utils.invalidateQueries('user.getUserList')
              }
            },
          },
        )
      } catch (error) {
        console.error('Failed to Handle Ban/Unban User:', error)
      }
    }
    setOpenBanUser(false)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
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
      title: <div className="flex items-center justify-center">Giới tính</div>,
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => <div className="w-14 flex justify-center">{mappingGender[text]}</div>,
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
      title: <div className="flex items-center justify-center">Ngày tham gia</div>,
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
              <Eyes
                onClick={() => handleOpenUserDetails(record)}
                className="p-2 mr-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="24"
                fill="#fff"
              />
              <Button isActive={false} onClick={() => handleOpenBan(record)}>
                {record.isBanned ? (
                  <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#22c55e" />
                ) : (
                  <ReduceOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#ff0000" />
                )}
              </Button>
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
      <Table loading={isLoading} locale={locale} pagination={false} columns={columns} dataSource={listData} />

      {openUserDetail && (
        <UserDetails details={userDetails} openValue={openUserDetail} closeFunction={handlecloseUserDetails} />
      )}
      <ComfirmModal
        closeFunction={handlecloseBan}
        openValue={openBanUser}
        isComfirmFunction={handleBanFunction}
        titleValue={!isBannedUser ? 'Xác nhận chặn' : 'Xác nhận bỏ chặn'}
      >
        <div className="p-4 text-white">
          Bạn có chắc chắn muốn {!isBannedUser ? ' chặn ' : ' bỏ chặn '}
          {userName}
        </div>
      </ComfirmModal>
    </div>
  )
}

export default UserTable
