import { Female, Left, Male, More, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { ReactNode, useState } from 'react'

import { Badge, Dropdown, Pagination, Space, Tag } from 'antd'
import Head from 'next/head'
import { title } from 'process'
import { UserInformationPagingResponse } from 'ume-service-openapi'

import UserTable from './components/user-table'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

interface LooseObject {
  [key: string]: any
}

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
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: 'male',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Nam</div>
      </Tag>
    ),
  },
  {
    key: 'female',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Nữ</div>
      </Tag>
    ),
  },
  {
    key: 'orther',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center w-10">Khác</div>
      </Tag>
    ),
  },
]

const UserManager = () => {
  const [userList, setUserList] = useState<UserInformationPagingResponse | undefined>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    gender: 'all',
    isBanned: 'all',
    search: 'all',
  })
  const [searchChange, setSearchChange] = useState('')

  const generateQuery = () => {
    let query: LooseObject = {}
    if (filter.search !== 'all') {
      query.name = {
        contains: filter.search,
        mode: 'insensitive',
      }
    }
    if (filter.gender !== 'all') {
      query.gender = filter.gender.toUpperCase()
    }
    if (filter.isBanned !== 'all') {
      filter.isBanned == 'true' ? (query.isBanned = true) : (query.isBanned = false)
    }
    return query
  }

  const { isLoading: isUserListLoading, isFetching: isUserListFetching } = trpc.useQuery(
    ['user.getUserList', { page: page.toString(), where: JSON.stringify(generateQuery()), order: undefined }],
    {
      onSuccess(data) {
        setUserList(data.data)
      },
    },
  )

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'Giới tính') {
      setFilter({
        ...filter,
        gender: key,
      })
    } else if (title == 'Trạng thái') {
      setFilter({
        ...filter,
        isBanned: key,
      })
    }
  }

  const handleSearchChange = (e) => {
    setSearchChange(e.target.value)
  }

  const handlePageChange = (currentPage) => {
    setPage(currentPage)
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
              <FilterDropdown title="Giới tính" items={genderFilterItems} handleFilter={handleFilter} />
              <FilterDropdown title="Trạng thái" items={statusFilterItems} handleFilter={handleFilter} />
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
            itemRender={(page, type, originalElement) => (
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
