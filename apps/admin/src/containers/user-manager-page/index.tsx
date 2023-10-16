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
import { genderFilterItems, mappingGender } from '~/components/filter-items'

import { trpc } from '~/utils/trpc'

interface LooseObject {
  [key: string]: any
}

const userStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Tạm dừng
      </Tag>
    ),
  },
]

const mappingUserStatus = {
  all: 'Tất cả',
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
  const ORDER = [{ id: 'asc' }]

  const { isLoading: isUserListLoading, isFetching: isUserListFetching } = trpc.useQuery(
    [
      'user.getUserList',
      {
        page: page.toString(),
        where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']),
        order: JSON.stringify(ORDER),
      },
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
          <div className="flex justify-between items-center">
            <div className="flex">
              <FilterDropdown
                id={'gender'}
                CustomCss="w-[9rem]"
                title={`Giới tính: ${mappingGender[filter.gender]}`}
                items={genderFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id={'status'}
                CustomCss="w-[12rem]"
                title={`Trạng thái: ${mappingUserStatus[filter.isBanned]}`}
                items={userStatusFilterItems}
                handleFilter={handleFilter}
              />
            </div>

            <div className="flex items-center rounded-lg bg-umeHeader border-2 border-white">
              <Search className=" active:bg-gray-700 p-2 rounded-full" theme="outline" size="24" fill="#fff" />
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
        <div className="flex justify-end mb-5 text-gray-500">
          {10 * (page - 1) + 1}-{page * 10 > userList?.count!! ? userList?.count : page * 10} trên {userList?.count}{' '}
          người dùng
        </div>
        <UserTable isLoading={isUserListLoading || isUserListFetching} userList={userList} />
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
