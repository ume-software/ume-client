import { Left, Right, Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import Head from 'next/head'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import {
  AdminGetUserPagingResponseResponse,
  AdminGetUserResponseResponse,
  AdminGetUserResponseResponseGenderEnum,
} from 'ume-service-openapi'

import UserTable from './components/user-table'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

const statusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">
        Tạm dừng
      </Tag>
    ),
  },
]

const genderFilterItems = [
  {
    key: 'ALL',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Male,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Nam</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Female,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Nữ</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Other,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Khác</div>
      </Tag>
    ),
  },
]
const mappingGender = {
  ALL: 'Giới tính',
  MALE: 'Nam',
  FEMALE: ' Nữ',
  OTHER: ' Khác',
}
const mappingStatus = {
  all: 'Trạng thái',
  false: 'Hoạt động',
  true: 'Tạm dừng',
}
const UserManager = () => {
  const [userList, setUserList] = useState<AdminGetUserPagingResponseResponse | undefined>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    gender: 'ALL',
    isBanned: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')

  const testQuerry: PrismaWhereConditionType<AdminGetUserResponseResponse> = Object.assign({
    name: {
      contains: filter.search,
      mode: 'insensitive',
    },

    gender: filter.gender !== 'ALL' ? filter.gender : undefined,
    isBanned: filter.isBanned !== 'all' ? (filter.isBanned == 'true' ? true : false) : undefined,
  })

  trpc.useQuery(
    [
      'user.getUserList',
      { page: page.toString(), where: prismaWhereConditionToJsonString(testQuerry), order: undefined },
    ],
    {
      onSuccess(data) {
        setUserList(data?.data as any)
      },
    },
  )

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'gender') {
      setFilter({
        ...filter,
        gender: key,
      })
    } else if (title == 'status') {
      setFilter({
        ...filter,
        isBanned: key,
      })
    }
  }

  const handleSearchChange = (e) => {
    if (e.target.value == '') {
      setPage(1)
      setFilter({
        ...filter,
        search: '',
      })
    }
    setSearchChange(e.target.value)
  }

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      setFilter({
        ...filter,
        search: searchChange,
      })
    }
  }
  return (
    <div>
      <Head>
        <title>Admin | User Manager</title>
      </Head>
      <div className="pb-10">
        <span className="content-title">Quản Lý người dùng</span>
        <div className="flex flex-col my-10">
          <div className="flex items-center justify-between">
            <div className="flex">
              <FilterDropdown
                id={'gender'}
                CustomCss="min-w-[6rem]"
                title={`${mappingGender[filter.gender]}`}
                items={genderFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id={'status'}
                CustomCss="min-w-[7rem]"
                title={`${mappingStatus[filter.isBanned]}`}
                items={statusFilterItems}
                handleFilter={handleFilter}
              />
            </div>

            <div className="flex items-center pl-2 border-2 border-white rounded-lg bg-umeHeader">
              <Search className="p-2 mr-3 rounded-full active:bg-gray-700" theme="outline" size="24" fill="#fff" />
              <Input
                placeholder="Tìm kiếm tên người dùng"
                onKeyUp={handleKeyPress}
                value={searchChange}
                onChange={handleSearchChange}
                className="bg-umeHeader focus:outline-none"
                type="text"
              />
            </div>
          </div>
        </div>
        <span className="text-gray-500">1-10 trên {userList?.count} user</span>
        <UserTable userList={userList} />
        <div className="flex w-full justify-center pb-[200px] mt-5">
          <Pagination
            itemRender={(page, type) => (
              <div className="text-white">
                {type == 'prev' ? (
                  <Left theme="outline" size="24" fill="#fff" />
                ) : type == 'next' ? (
                  <Right theme="outline" size="24" fill="#fff" />
                ) : (
                  page
                )}
              </div>
            )}
            pageSize={10}
            current={page}
            total={userList?.count}
            onChange={(page) => {
              handlePageChange(page)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserManager
