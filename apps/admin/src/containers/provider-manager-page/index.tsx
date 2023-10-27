import { Left, Right, Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import Head from 'next/head'
import { AdminGetUserPagingResponseResponse } from 'ume-service-openapi'

import TableProviders from './components/table-provider'

import FilterDropdown from '~/components/filter-dropdown'
import { genderFilterItems, mappingGender } from '~/components/filter-items'

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

const ProviderManager = () => {
  const LIMIT = '10'
  const SELECT = ['$all', { providerConfig: ['$all'] }]
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    gender: 'ALL',
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
    if (filter.gender !== 'ALL') {
      query.gender = filter.gender.toUpperCase()
    }
    if (filter.isBanned !== 'all') {
      if (filter.isBanned == 'true') {
        query.providerConfig = { isBanned: true }
      } else {
        query.providerConfig = { isBanned: false }
      }
    }
    return query
  }
  const { isLoading: isUserListLoading } = trpc.useQuery(
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
      onSuccess(data) {
        setProviderList(data?.data as any)
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

  const mapingStatus = {
    all: 'Tất Cả',
    false: 'Hoạt động',
    true: 'Tạm dừng',
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
                CustomCss="w-[9rem]"
                title={'Giới tính: ' + mappingGender[filter.gender]}
                items={genderFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id="status"
                CustomCss="w-[12rem]"
                title={'Trạng thái: ' + mapingStatus[filter.isBanned]}
                items={statusFilterItems}
                handleFilter={handleFilter}
              />
            </div>
          </div>
          <div className="flex items-center bg-umeHeader border-2 rounded-lg">
            <Search
              onClick={() => {
                setPage(1)
                setFilter({
                  ...filter,
                  search: searchChange,
                })
              }}
              className="bg-umeHeader p-2 rounded-full hover:bg-gray-700"
              theme="outline"
              size="24"
              fill="#fff"
            />
            <Input
              className="bg-umeHeader focus:outline-none"
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
          {providerList?.count} nhà cung cấp
        </div>
        <TableProviders data={data} isLoading={isUserListLoading} />
        <div className="flex w-full justify-center pb-[200px] mt-5">
          <Pagination
            itemRender={(page, type) => (
              <div className="text-white flex items-center justify-center">
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
