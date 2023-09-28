import { Left, Plus, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'

import VoucherTable from './components/voucher-table'
import VourcherModalCreate from './components/vourcher-modal/vourcher-modal-create'
import VourcherModalView from './components/vourcher-modal/vourcher-modal-view'

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

const voucherRecipientTypes = [
  {
    key: 'ALL',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: 'FIRST_TIME_BOOKING',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người lần đầu thuê</div>
      </Tag>
    ),
  },
  {
    key: 'PREVIOUS_BOOKING',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người đã từng thuê</div>
      </Tag>
    ),
  },
  {
    key: 'TOP_5_BOOKER',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 5 người thuê</div>
      </Tag>
    ),
  },
  {
    key: 'TOP_10_BOOKER',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 10 người thuê</div>
      </Tag>
    ),
  },
]

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
    setOpenVourcherModalCreate(true)
    // setOpenVourcherModalUpdate(true)
  }
  // --------------------------
  const [adminVoucherList, setAdminVoucherList] = useState<any>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    voucherRecipientType: 'ALL',
    isActived: 'all',
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
    if (filter.voucherRecipientType !== 'ALL') {
      query.voucherRecipientType = filter.voucherRecipientType.toUpperCase()
    }
    if (filter.isActived !== 'all') {
      filter.isActived == 'true' ? (query.isActived = true) : (query.isActived = false)
    }
    console.log(query)

    return JSON.stringify(query)
  }

  const { isLoading, isFetching } = trpc.useQuery(
    ['voucher.getAllVoucher', { page: page.toString(), where: generateQuery(), order: undefined }],
    {
      onSuccess(data) {
        setAdminVoucherList(data.data)
      },
    },
  )

  const handleFilter = (id, key) => {
    setPage(1)
    if (id == 'Đối tượng') {
      setFilter({
        ...filter,
        voucherRecipientType: key,
      })
    } else if (id == 'Trạng thái') {
      setFilter({
        ...filter,
        isActived: key,
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
            {/* <FilterDropdown title="Trạng thái" items={statusFilterItems} handleFilter={handleFilter} />
            <FilterDropdown title="Đối tượng" items={voucherRecipientTypes} handleFilter={handleFilter} /> */}
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
      <VoucherTable data={adminVoucherList} />
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
    </div>
  )
}

export default VoucherByAdmin
