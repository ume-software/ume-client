import { CloseSmall, Eyes, H, ReduceOne } from '@icon-park/react'
import { Modal } from '@ume/ui'

import React, { useState } from 'react'

import { Badge, Space, Table, Tag } from 'antd'

const data = [
  {
    key: '1',
    name: 'John Brown',
    gmail: 'johnbrownkasdgkjabsjhádgasfdh123@gmail.com',
    phoneNumber: '0987654312',
    gender: 'Nam',
    status: 'Hoạt động',
    joinDate: '20/11/2022',
  },
  {
    key: '2',
    name: 'John Brown',
    gmail: 'johnbrown123@gmail.com',
    phoneNumber: '0987654312',
    gender: 'Nữ',
    status: 'Hoạt động',
    joinDate: '20/11/2022',
  },
  {
    key: '3',
    name: 'John Brown',
    gmail: 'johnbrown123@gmail.com',
    phoneNumber: '0987654312',
    gender: 'Nam',
    status: 'Tạm dừng',
    joinDate: '20/11/2022',
  },
  {
    key: '4',
    name: 'John Brown',
    gmail: 'johnbrownkasdgkjabsjhádgasfdh123@gmail.com',
    phoneNumber: '0987654312',
    gender: 'Nam',
    status: 'Hoạt động',
    joinDate: '20/11/2022',
  },
  {
    key: '5',
    name: 'John Brown',
    gmail: 'johnbrownkasdgkjabsjhádgasfdh123@gmail.com',
    phoneNumber: '0987654312',
    gender: 'Nam',
    status: 'Hoạt động',
    joinDate: '20/11/2022',
  },
]

const UserTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(true)
  const handleOpen = () => {
    setIsModalVisible(true)
  }
  const handleClose = () => {
    setIsModalVisible(false)
  }
  const UserInfoModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Tạo bài viết</p>,
    show: isModalVisible,
    form: <>Modal</>,
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
      dataIndex: 'gmail',
      key: 'gmail',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <div className="flex justify-center items-center">
          {text == 'Hoạt động' ? (
            <Tag className="bg-green-500 rounded-lg text-white px-3 py-2">Hoạt động</Tag>
          ) : (
            <Tag className="bg-red-500 rounded-lg text-white px-3 py-2">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      key: 'joinDate',
      dataIndex: 'joinDate',
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
  return (
    <div className=" mt-5">
      <Table columns={columns} dataSource={data} />
      {isModalVisible && UserInfoModal}
    </div>
  )
}

export default UserTable
