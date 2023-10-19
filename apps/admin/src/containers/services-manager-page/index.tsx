import { Left, Plus, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

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

import ServicesModalCreate from './components/services-modal/services-modal-create'
import ServicesModalUpdate from './components/services-modal/services-modal-update'
import ServicesTable from './components/services-table'

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
    key: 'true',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
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
  const [openServicesModalCreate, setOpenServicesModalCreate] = useState(false)
  const [openServicesModalUpdate, setOpenServicesModalUpdate] = useState(false)

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
  function addServicesHandler() {
    setOpenServicesModalCreate(true)
    // setOpenServicesModalUpdate(true)
  }
  function closeServicesModalCreate() {
    setOpenServicesModalCreate(false)
  }

  function closeServicesModalUpdate() {
    setOpenServicesModalUpdate(false)
  }
  return (
    <div>
      <Head>
        <title>Admin | Services Manager</title>
      </Head>
      <div className="pb-10">
        <div className="flex justify-between">
          <span className="content-title">Quản Lý Dịch Vụ</span>
          <Button customCSS="bg-[#7463f0] px-3 rounded-2xl active:bg-gray-600" onClick={addServicesHandler}>
            <Plus theme="outline" size="24" fill="#fff" />
            Thêm dịch vụ
          </Button>
        </div>
        <div className="flex flex-col my-10">
          <div className="flex items-center justify-between">
            <div className="flex">
              <FilterDropdown
                id={'status'}
                CustomCss="min-w-[7rem]"
                title={`${mappingStatus[filter.isActivated]}`}
                items={statusFilterItems}
                handleFilter={handleFilter}
              />
            </div>

            <div className="flex items-center pl-1 border-2 border-white rounded-lg bg-umeHeader">
              <Search className="p-2 rounded-full active:bg-gray-700" theme="outline" size="24" fill="#fff" />
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
        <ServicesTable isLoading={isLoading} servicesList={serviceList} />
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
        {openServicesModalCreate && (
          <ServicesModalCreate closeFunction={closeServicesModalCreate} openValue={openServicesModalCreate} />
        )}
        {openServicesModalUpdate && (
          <ServicesModalUpdate
            idService="1"
            closeFunction={closeServicesModalUpdate}
            openValue={openServicesModalUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default ServicesManagerPage
