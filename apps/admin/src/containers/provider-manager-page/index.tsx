import { Left, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import Head from 'next/head'
import { AdminGetUserPagingResponseResponse, FilterProviderPagingResponse } from 'ume-service-openapi'
import { util } from 'zod'

import TableProviders from './components/table-provider'

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
const ProviderManager = () => {
  const utils = trpc.useContext()
  const LIMIT = '10'
  const SELECT = ['$all', { providerConfig: ['$all'] }]
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    gender: 'all',
    isBanned: 'all',
    search: 'all',
  })
  const [searchChange, setSearchChange] = useState('')
  const ORDER = [{ id: 'asc' }]
  const [providerList, setProviderList] = useState<AdminGetUserPagingResponseResponse | undefined>()
  const generateQuery = () => {
    let query: LooseObject = {}
    query.isBanned = false
    query.isProvider = true
    query.NOT = [{ providerConfig: null }]
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
      filter.isBanned == 'true'
        ? (query.providerConfig = { isBanned: true })
        : (query.providerConfig = { isBanned: false })
    }
    return query
  }
  const { isLoading: isUserListLoading, isFetching: isUserListFetching } = trpc.useQuery(
    [
      'provider.getProviderList',
      {
        limit: LIMIT,
        page: page.toString(),
        select: JSON.stringify(SELECT),
        where: JSON.stringify(generateQuery()),
        order: JSON.stringify(ORDER),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      // refetchOnMount: false,
      onSuccess(data) {
        setProviderList(data.data)
      },
    },
  )
  const data = providerList?.row?.map((row: any) => {
    return {
      ...row,
      key: row.id,
      id: row.id,
      name: row.name,
      Gmail: row.email,
      phone: row.phone,
      gender: row.gender,
      isBanned: row.providerConfig.isBanned,
      joinDate: row.providerConfig.createdAt,
    }
  })
  const mapingGender = {
    all: 'Tất Cả',
    male: 'Nam',
    female: ' Nữ',
    orther: ' Khác',
  }
  const mapingStatus = {
    all: 'Tất Cả',
    false: 'HOẠT ĐỘNG',
    true: 'TẠM DỪNG',
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

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
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
  const handleFilter = (id, key) => {
    setPage(1)
    if (id == 'gender') {
      setFilter({
        ...filter,
        gender: key,
      })
    } else if (id == 'status') {
      setFilter({
        ...filter,
        isBanned: key,
      })
    }
  }
  function refreshData() {
    utils.invalidateQueries('provider.getProviderList')
  }

  return (
    <div>
      <Head>
        <title>Admin | Provider Manager</title>
      </Head>
      <div className="pb-80">
        <span className="content-title">Quản lý nhà cung cấp</span>
        <div className="flex items-center justify-between my-5">
          <div className="flex items-center justify-between">
            <div className="flex">
              <FilterDropdown
                id="gender"
                title={'Giới tính: ' + mapingGender[filter.gender]}
                items={genderFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id="status"
                title={'Trạng thái: ' + mapingStatus[filter.isBanned]}
                items={statusFilterItems}
                handleFilter={handleFilter}
              />
            </div>
          </div>
          <div className="flex items-center px-3 bg-gray-800 border-2 rounded-lg">
            <Search
              onClick={() => {
                setPage(1)
                setFilter({
                  ...filter,
                  search: searchChange,
                })
              }}
              className="bg-gray-800 rounded-full hover:bg-gray-700"
              theme="outline"
              size="24"
              fill="#fff"
            />
            <Input
              className="bg-gray-800 focus:outline-none"
              placeholder="Search "
              value={searchChange}
              onChange={handleSearchChange}
              onKeyUp={handleKeyPress}
              type="text"
            />
          </div>
        </div>
        <div className="flex justify-end mb-5 text-gray-500">
          {10 * (page - 1) + 1}-{page * 10 > providerList?.count!! ? providerList?.count : page * 10} trên{' '}
          {providerList?.count} user
        </div>
        <TableProviders data={data} />
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
            total={providerList?.count}
            onChange={(nextPage) => {
              handlePageChange(nextPage)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProviderManager
