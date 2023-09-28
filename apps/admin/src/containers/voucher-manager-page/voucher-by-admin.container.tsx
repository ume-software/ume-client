import { Left, Plus, Right, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { Pagination, Tag } from 'antd'

import VoucherTable from './components/voucher-table'

import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

interface LooseObject {
  [key: string]: any
}

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
      <Tag className="bg-green-500 hover:bg-green-600 rounded-lg text-white px-3 py-2 w-full flex justify-center">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="bg-red-500 hover:bg-red-600 rounded-lg text-white px-3 py-2 w-full flex justify-center">
        Tạm dừng
      </Tag>
    ),
  },
]

const voucherRecipientTypes = [
  {
    key: 'ALL',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: 'FIRST_TIME_BOOKING',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center">Người lần đầu thuê</div>
      </Tag>
    ),
  },
  {
    key: 'PREVIOUS_BOOKING',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center">Người đã từng thuê</div>
      </Tag>
    ),
  },
  {
    key: 'TOP_5_BOOKER',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center">Top 5 người thuê</div>
      </Tag>
    ),
  },
  {
    key: 'TOP_10_BOOKER',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center">Top 10 người thuê</div>
      </Tag>
    ),
  },
]

const VoucherByAdmin = () => {
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
        <Button customCSS="bg-[#7463f0] px-3 py-1 rounded-2xl active:bg-gray-600">
          <Plus theme="outline" size="24" fill="#fff" />
          Thêm khuyến mãi
        </Button>
      </div>

      <div className="flex flex-col my-10">
        <div className="flex justify-between items-center">
          <div className="flex">
            <FilterDropdown title="Trạng thái" items={statusFilterItems} handleFilter={handleFilter} />
            <FilterDropdown title="Đối tượng" items={voucherRecipientTypes} handleFilter={handleFilter} />
          </div>

          <div className="flex items-center rounded-lg pl-2 w-fit bg-umeHeader border-2 border-white">
            <Search className=" active:bg-gray-700 p-2 rounded-full" theme="outline" size="24" fill="#fff" />
            <Input
              placeholder="Tìm kiếm tên khuyến mãi"
              onKeyUp={handleKeyPress}
              value={searchChange}
              onChange={handleSearchChange}
              className="bg-umeHeader focus:outline-none w-full"
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
    </div>
  )
}

export default VoucherByAdmin
