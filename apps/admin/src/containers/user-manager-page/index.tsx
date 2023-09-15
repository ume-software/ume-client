import { Female, Male, More, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { ReactNode } from 'react'

import { Badge, Dropdown, Space, Tag } from 'antd'
import Head from 'next/head'

import CustomDropdown from './components/custom-dropdown'
import UserTable from './components/user-table'

const statusFilterItems = [
  {
    key: '1',
    label: <Tag className="bg-green-500 hover:bg-green-600 rounded-lg text-white px-3 py-2">Hoạt động</Tag>,
  },
  {
    key: '2',
    label: <Tag className="bg-red-500 hover:bg-red-600 rounded-lg text-white px-3 py-2">Tạm dừng</Tag>,
  },
]

const genderFilterItems = [
  {
    key: '1',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2">
        <div className="flex justify-center items-center">
          <Male className="mr-2" theme="outline" size="18" fill="#15151b" />
          <span className="w-10">Nam</span>
        </div>
      </Tag>
    ),
  },
  {
    key: '2',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white bg-white rounded-lg px-3 py-2">
        <div className="flex justify-center items-center">
          <Female className="mr-2" theme="outline" size="18" fill="#15151b" />
          <span className="w-10">Nữ</span>
        </div>
      </Tag>
    ),
  },
]

const UserManager = () => {
  return (
    <div>
      <Head>
        <title>Admin | User Manager</title>
      </Head>
      <div className="py-10">
        <span className="content-title">Quản Lý người dùng</span>
        <div className="flex flex-col my-10">
          <div className="flex justify-between items-center">
            <div className="flex">
              <CustomDropdown title="Giới tính" items={genderFilterItems} />
              <CustomDropdown title="Trạng thái" items={statusFilterItems} />
            </div>

            <div className="flex items-center rounded-lg pl-2 bg-gray-800 border-2 border-white">
              <Search className=" active:bg-gray-700 p-2 rounded-full mr-3" theme="outline" size="24" fill="#fff" />
              <Input className="bg-gray-800" type="text" />
            </div>
          </div>
        </div>
        <span className="text-gray-500">1-10 trên 250 user</span>
        <UserTable />
      </div>
    </div>
  )
}

export default UserManager
