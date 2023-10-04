import { Left, Plus, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import {
  VoucherPagingResponse,
  VoucherResponse,
  VoucherResponseRecipientTypeEnum,
  VoucherResponseStatusEnum,
} from 'ume-service-openapi'

import AdminVoucherTable from './components/voucher-table/admin-voucher-table'
import VourcherModalCreate from './components/vourcher-modal/vourcher-modal-create'
import VourcherModalUpdate from './components/vourcher-modal/vourcher-modal-update'
import VourcherModalView from './components/vourcher-modal/vourcher-modal-view'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

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
      <Tag className="flex justify-center w-full px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">
        Tạm dừng
      </Tag>
    ),
  },
]

const recipientType = [
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
const mappingStatus = {
  all: 'Trạng thái',
  true: 'Hoạt động',
  false: 'Tạm dừng',
}

const VoucherByAdmin = () => {
  // model variable and function

  const [openVourcherModalView, setOpenVourcherModalView] = useState(false)
  const [openVourcherModalCreate, setOpenVourcherModalCreate] = useState(false)
  const [openVourcherModalUpdate, setOpenVourcherModalUpdate] = useState(false)

  function closeVourcherModalView() {
    setOpenVourcherModalView(false)
  }
  function closeVourcherModalCreate() {
    setOpenVourcherModalCreate(false)
  }
  function closeVourcherModalUpdate() {
    setOpenVourcherModalUpdate(false)
  }
  function addVourcherHandler() {
    // setOpenVourcherModalView(true)
    // setOpenVourcherModalCreate(true)
    setOpenVourcherModalUpdate(true)
  }
  // --------------------------
  const [adminVoucherList, setAdminVoucherList] = useState<VoucherPagingResponse>()
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
    isActivated: filter.isActivated !== 'ALL' ? (filter.isActivated == 'true' ? true : false) : undefined,
  })

  const { isLoading, isFetching } = trpc.useQuery(
    [
      'voucher.getAllVoucher',
      { page: page.toString(), where: prismaWhereConditionToJsonString(testQuerry), order: undefined },
    ],
    {
      onSuccess(data) {
        setAdminVoucherList(data.data)
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
        <Button customCSS="bg-[#7463f0] px-3 py-1 rounded-2xl active:bg-gray-600" onClick={addVourcherHandler}>
          <Plus theme="outline" size="24" fill="#fff" />
          Thêm khuyến mãi
        </Button>
      </div>

      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <div className="flex">
            <FilterDropdown
              id={'status'}
              CustomCss="min-w-[7rem]"
              title={mappingStatus[filter.isActivated]}
              items={statusFilterItems}
              handleFilter={handleFilter}
            />
            <FilterDropdown
              id={'recipientType'}
              CustomCss="min-w-[11rem]"
              title={mappingRecipientType[filter.recipientType]}
              items={recipientType}
              handleFilter={handleFilter}
            />
          </div>

          <div className="flex items-center pl-2 border-2 border-white rounded-lg w-fit bg-umeHeader">
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
      <AdminVoucherTable data={adminVoucherList} />
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

      <VourcherModalView closeFunction={closeVourcherModalView} openValue={openVourcherModalView} />
      <VourcherModalCreate closeFunction={closeVourcherModalCreate} openValue={openVourcherModalCreate} />
      <VourcherModalUpdate closeFunction={closeVourcherModalUpdate} openValue={openVourcherModalUpdate} />
    </div>
  )
}

export default VoucherByAdmin