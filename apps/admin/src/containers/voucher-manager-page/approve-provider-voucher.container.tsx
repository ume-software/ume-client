import { Left, Right, Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import {
  VoucherPagingResponse,
  VoucherResponse,
  VoucherResponseDiscountUnitEnum,
  VoucherResponseRecipientTypeEnum,
  VoucherResponseTypeEnum,
} from 'ume-service-openapi'

import ApproveProviderVoucherTable from './components/voucher-table/approve-voucher-table'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

const typeFilter = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: VoucherResponseTypeEnum.Discount,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Giảm giá
      </Tag>
    ),
  },
  {
    key: VoucherResponseTypeEnum.Cashback,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Hoàn tiền
      </Tag>
    ),
  },
]
const mappingtype = {
  all: 'Loại',
  CASHBACK: 'Hoàn tiền',
  DISCOUNT: 'Giảm giá',
}
const discountUnitsFilter = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: VoucherResponseDiscountUnitEnum.Cash,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tiền
      </Tag>
    ),
  },
  {
    key: VoucherResponseDiscountUnitEnum.Percent,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Phần trăm
      </Tag>
    ),
  },
]
const mappingDiscountUnits = {
  all: 'Kiểu khuyến mãi',
  CASH: 'Tiền',
  PERCENT: 'Phần trăm',
}

const recipientTypeFilter = [
  {
    key: VoucherResponseRecipientTypeEnum.All,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.FirstTimeBooking,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người lần đầu thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.PreviousBooking,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người đã từng thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.Top5Booker,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 5 người thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.Top10Booker,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 10 người thuê</div>
      </Tag>
    ),
  },
]

const mappingRecipientType = {
  ALL: 'Đối tượng',
  FIRST_TIME_BOOKING: 'Người lần đầu thuê',
  PREVIOUS_BOOKING: ' Người đã từng thuê',
  TOP_5_BOOKER: ' Top 5 người thuê',
  TOP_10_BOOKER: ' Top 10 người thuê',
}
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

  const { isLoading, isFetching } = trpc.useQuery(
    [
      'voucher.getAllVoucher',
      { page: page.toString(), where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']), order: undefined },
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
        <span className="content-title">Kiểm duyệt khuyến mãi từ quản trị viên</span>
        <div></div>
      </div>

      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <div className="flex">
            <FilterDropdown
              id={'recipientType'}
              CustomCss="min-w-[11rem]"
              title={`${mappingRecipientType[filter.recipientType]}`}
              items={recipientTypeFilter}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'discountUnit'}
              CustomCss="min-w-[9.5rem]"
              title={`${mappingDiscountUnits[filter.discountUnit]}`}
              items={discountUnitsFilter}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'type'}
              CustomCss="min-w-[6.5rem]"
              title={`${mappingtype[filter.type]}`}
              items={typeFilter}
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
      <ApproveProviderVoucherTable isLoading={isLoading || isFetching} data={voucherList} />
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
