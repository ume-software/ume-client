import { Left, Plus, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { VoucherPagingResponse, VoucherResponse } from 'ume-service-openapi'

import AdminVoucherTable from './components/voucher-table/admin-voucher-table'
import VourcherModalCreate from './components/vourcher-modal/vourcher-modal-create'

import FilterDropdown from '~/components/filter-dropdown'
import { mappingRecipientTypes, recipientType } from '~/components/filter-items'

import { trpc } from '~/utils/trpc'

export const voucherStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
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
export const mappingVoucherStatus = {
  all: 'Tất cả',
  true: 'Hoạt động',
  false: 'Tạm dừng',
}

const VoucherByAdmin = () => {
  const [openVourcherModalCreate, setOpenVourcherModalCreate] = useState(false)

  function closeVourcherModalCreate() {
    setOpenVourcherModalCreate(false)
  }
  function addVourcherHandler() {
    setOpenVourcherModalCreate(true)
  }
  const [adminVoucherList, setAdminVoucherList] = useState<VoucherPagingResponse | undefined>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    recipientType: 'ALL',
    isActivated: 'all',
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
    providerId: null,
    recipientType: filter.recipientType !== 'ALL' ? filter.recipientType : undefined,
    isActivated: filter.isActivated !== 'all' ? (filter.isActivated == 'true' ? true : false) : undefined,
  })
  const ORDER = [{ id: 'asc' }]

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
        setAdminVoucherList(data?.data as any)
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
    } else if (id == 'status') {
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
        <span className="content-title">Khuyến mãi của quản trị viên</span>
        <Button customCSS="bg-[#7463f0] px-3 rounded-2xl active:bg-gray-600" onClick={addVourcherHandler}>
          <Plus theme="outline" size="24" fill="#fff" />
          Thêm khuyến mãi
        </Button>
      </div>

      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <div className="flex">
            <FilterDropdown
              id={'status'}
              CustomCss="w-[12rem]"
              title={`Trạng thái: ${mappingVoucherStatus[filter.isActivated]}`}
              items={voucherStatusFilterItems}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'recipientType'}
              CustomCss="w-[12rem]"
              title={`Đối tượng: ${mappingRecipientTypes[filter.recipientType]}`}
              items={recipientType}
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
        {10 * (page - 1) + 1}-{page * 10 > adminVoucherList?.count!! ? adminVoucherList?.count : page * 10} trên{' '}
        {adminVoucherList?.count} khuyến mãi
      </div>
      <AdminVoucherTable isLoading={isLoading} data={adminVoucherList} />
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
          total={adminVoucherList?.count}
          onChange={(page) => {
            handlePageChange(page)
          }}
        />
      </div>
      {openVourcherModalCreate && (
        <VourcherModalCreate closeFunction={closeVourcherModalCreate} openValue={openVourcherModalCreate} />
      )}
    </div>
  )
}

export default VoucherByAdmin
