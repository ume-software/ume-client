import { Left, Right, Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { VoucherPagingResponse, VoucherResponse } from 'ume-service-openapi'

import ApproveProviderVoucherTable from './components/voucher-table/approve-voucher-table'

import FilterDropdown from '~/components/filter-dropdown'
import {
  discountUnitsFilter,
  mappingDiscountUnits,
  mappingRecipientTypes,
  mappingVoucherType,
  recipientType,
  voucherTypeFilter,
} from '~/components/filter-items'

import { trpc } from '~/utils/trpc'

const ApproveProviderVoucher = () => {
  const [voucherList, setVoucherList] = useState<VoucherPagingResponse>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    recipientType: 'ALL',
    discountUnit: 'all',
    type: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')

  const testQuerry: PrismaWhereConditionType<VoucherResponse> = Object.assign({
    OR: [
      {
        name: {
          contains: filter.search,
          mode: 'insensitive',
        },
      },
      {
        code: {
          contains: filter.search,
          mode: 'insensitive',
        },
      },
    ],

    adminId: null,
    recipientType: filter.recipientType !== 'ALL' ? filter.recipientType : undefined,
    status: 'PENDING',
    type: filter.type !== 'all' ? filter.type : undefined,
    discountUnit: filter.discountUnit !== 'all' ? filter.discountUnit : undefined,
  })
  const ORDER = [{ createdAt: 'desc' }]

  const { isLoading } = trpc.useQuery(
    [
      'voucher.getAllVoucher',
      {
        page: page.toString(),
        where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']),
        order: JSON.stringify(ORDER),
      },
    ],
    {
      onSuccess(data) {
        setVoucherList(data.data)
      },
    },
  )

  const handleFilter = (id, key) => {
    setPage(1)
    if (id == 'recipientType') {
      setFilter({
        ...filter,
        recipientType: key,
      })
    } else if (id == 'discountUnit') {
      setFilter({
        ...filter,
        discountUnit: key,
      })
    } else if (id == 'type') {
      setFilter({
        ...filter,
        type: key,
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
      <div className="flex justify-between">
        <span className="content-title">Kiểm duyệt khuyến mãi từ nhà cung cấp</span>
        <div></div>
      </div>

      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <div className="flex">
            <FilterDropdown
              id={'recipientType'}
              CustomCss="w-[12rem]"
              title={`Đối tượng: ${mappingRecipientTypes[filter.recipientType]}`}
              items={recipientType}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'discountUnit'}
              CustomCss="w-[9rem]"
              title={`Kiểu: ${mappingDiscountUnits[filter.discountUnit]}`}
              items={discountUnitsFilter}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'type'}
              CustomCss="w-[9rem]"
              title={`Loại: ${mappingVoucherType[filter.type]}`}
              items={voucherTypeFilter}
              handleFilter={handleFilter}
            />
          </div>

          <div className="flex items-center border-2 border-white rounded-lg w-fit bg-umeHeader">
            <Search className="p-2 rounded-full active:bg-gray-700" theme="outline" size="24" fill="#fff" />
            <Input
              placeholder="Tìm kiếm tên khuyến mãi"
              onKeyUp={handleKeyPress}
              value={searchChange}
              onChange={handleSearchChange}
              className="w-full bg-umeHeader focus:outline-none"
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5 text-gray-500">
        {10 * (page - 1) + 1}-{page * 10 > voucherList?.count!! ? voucherList?.count : page * 10} trên{' '}
        {voucherList?.count} khuyến mãi
      </div>
      <ApproveProviderVoucherTable isLoading={isLoading} data={voucherList} />
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
          pageSize={10}
          current={page}
          total={voucherList?.count}
          onChange={(page) => {
            handlePageChange(page)
          }}
        />
      </div>
    </div>
  )
}

export default ApproveProviderVoucher
