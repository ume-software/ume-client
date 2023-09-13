import { Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React from 'react'

import Head from 'next/head'

const UserManager = () => {
  return (
    <div>
      <Head>
        <title>Admin | User Manager</title>
      </Head>
      <div className="h-[1000px]">
        <span className="content-title">Quản Lý người dùng</span>
        <div className="flex justify-between items-center my-5">
          <div className="flex justify-between items-center">
            <button className="rounded-xl py-2 px-4 bg-gray-800 hover:bg-gray-700 m-2">Giới tính</button>
            <Button>Trạng thái</Button>
          </div>
          <div className="flex items-center">
            <Search className="bg-gray-800 hover:bg-gray-700 rounded-full" theme="outline" size="24" fill="#fff" />
            <Input className="bg-gray-800 border-white border-2" type="text" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManager
