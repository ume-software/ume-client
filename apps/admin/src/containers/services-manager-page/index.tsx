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
  ServicePagingResponse,
} from 'ume-service-openapi'

import ServicesTable from './components/services-table'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

const statusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Tạm dừng
      </Tag>
    ),
  },
]

const mappingStatus = {
  all: 'Trạng thái',
  false: 'Tạm dừng',
  true: 'Hoạt động',
}
const ServicesManagerPage = () => {
  const [serviceList, setServiceList] = useState<ServicePagingResponse | undefined>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    gender: 'ALL',
    isActivated: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')
  const testQuerry: PrismaWhereConditionType<ServicePagingResponse> = Object.assign({
    name: {
      contains: filter.search,
      mode: 'insensitive',
    },

    gender: filter.gender !== 'ALL' ? filter.gender : undefined,
    isActivated: filter.isActivated !== 'all' ? (filter.isActivated == 'true' ? true : false) : undefined,
  })

  const { isLoading, isFetching } = trpc.useQuery(
    [
      'services.getServiceList',
      {
        page: page.toString(),
        select: undefined,
        where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']),
        order: undefined,
      },
    ],
    {
      onSuccess(data) {
        setServiceList(data?.data as any)
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
        isActivated: key,
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
        <title>Admin | Services Manager</title>
      </Head>
      <div className="pb-10">
        <span className="content-title">Quản Lý Dịch Vụ</span>
        <div className="flex flex-col my-10">
          <div className="flex justify-between items-center">
            <div className="flex">
              <FilterDropdown
                id={'status'}
                CustomCss="min-w-[7rem]"
                title={`${mappingStatus[filter.isActivated]}`}
                items={statusFilterItems}
                handleFilter={handleFilter}
              />
            </div>

            <div className="flex pl-1 items-center rounded-lg bg-umeHeader border-2 border-white">
              <Search className=" active:bg-gray-700 p-2 rounded-full" theme="outline" size="24" fill="#fff" />
              <Input
                placeholder="Tìm kiếm tên dịch vụ"
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
          {10 * (page - 1) + 1}-{page * 10 > serviceList?.count!! ? serviceList?.count : page * 10} trên{' '}
          {serviceList?.count} dịch vụ
        </div>
        <ServicesTable isLoading={isLoading || isFetching} servicesList={serviceList} />
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
            total={serviceList?.count}
            onChange={(page) => {
              handlePageChange(page)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ServicesManagerPage
