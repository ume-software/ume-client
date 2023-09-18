import { CloseSmall, Eyes, H, Left, ReduceOne, Right } from '@icon-park/react'
import { Modal } from '@ume/ui'

import React, { useState } from 'react'

import { Badge, Pagination, Space, Table, Tag } from 'antd'
import Image from 'next/image'
import { UserInformationPagingResponse } from 'ume-service-openapi'
import { string } from 'zod'

import EmptyErrorPic from '../../../../public/empty_error.png'

// const tableDataMapping = (data) => {
//   const list: {
//     key: any
//     name: any
//     email: any
//     phone: any
//     gender: any
//     status: string
//     createdAt: any
//   }[] = []
//   data.map((item) => {
//     const rowItem = {
//       key: item.id,
//       name: item.name,
//       email: item.email,
//       phone: item.phone,
//       gender: item.gender,
//       status: 'Hoạt động',
//       createdAt: item.createdAt,
//     }
//     list.push(rowItem)
//   })
// }

const UserTable = ({ userList }) => {
  const [isModalVisible, setIsModalVisible] = useState(true)

  const handleOpen = () => {
    setIsModalVisible(true)
  }
  const handleClose = () => {
    setIsModalVisible(false)
  }
  const UserInfoModal = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Thông tin người dùng</p>,
    show: isModalVisible,
    form: <div className="w-[40%]">Modal</div>,
    backgroundColor: '#292734',
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })
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
        // console.log(record)

        return (
          <>
            <div className="flex">
              <Eyes
                onClick={handleOpen}
                className="mr-2 rounded-full hover:bg-gray-500 p-2"
                theme="outline"
                size="24"
                fill="#fff"
              />
              <ReduceOne className="rounded-full hover:bg-gray-500 p-2" theme="outline" size="24" fill="#fff" />
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
      <Table locale={locale} pagination={false} columns={columns} dataSource={userList?.row} />

      {/* {isModalVisible && UserInfoModal} */}
    </div>
  )
}

export default UserTable
