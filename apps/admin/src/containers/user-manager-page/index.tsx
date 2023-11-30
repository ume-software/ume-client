import { Left, Right, Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import Head from 'next/head'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { AdminGetUserPagingResponseResponse, AdminGetUserResponseResponse } from 'ume-service-openapi'

import UserTable from './components/user-table'

import FilterDropdown from '~/components/filter-dropdown'
import { genderFilterItems, mappingGender } from '~/components/filter-items'

import { LIMIT_PAGE_SIZE } from '~/utils/constant'
import { trpc } from '~/utils/trpc'

interface LooseObject {
  [key: string]: any
}

const userStatusFilterItems = [
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
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
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

  const { isLoading: isUserListLoading } = trpc.useQuery(
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
        <title>UME | User Manager</title>
      </Head>
      <div className="pb-10">
        <span className="content-title">Quản Lý người dùng</span>
        <div className="flex flex-col my-10">
          <div className="flex items-center justify-between">
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
        <UserTable isLoading={isUserListLoading} userList={userList} />
        <div className="flex w-full justify-center pb-[200px] mt-5">
          <Pagination
            itemRender={(page, type) => (
              <div className="text-white">
                {type == 'prev' ? (
                  <div className="mt-1.5 ml-1">
                    <Left theme="outline" size="24" fill="#fff" />
                  </div>
                ) : type == 'next' ? (
                  <div className="mt-1.5">
                    <Right theme="outline" size="24" fill="#fff" />
                  </div>
                ) : (
                  page
                )}
              </div>
            )}
            pageSize={Number(LIMIT_PAGE_SIZE)}
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
