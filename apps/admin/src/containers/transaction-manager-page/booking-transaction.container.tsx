import { Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { BookingHistoryPagingResponse } from 'ume-service-openapi'

import { locale } from '~/components/common-table/EmptyTableComponent'
import CommonTable from '~/components/common-table/Table'
import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

type TableProps = {
  key: string
  id: string
  transactionCode: string
  platform: string
  requester: string
  amountMoney: string
  createdAt: string
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
    key: 'INIT',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đang chờ
      </Tag>
    ),
  },
  {
    key: 'USER_CANCEL',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Người thuê hủy
      </Tag>
    ),
  },
  {
    key: 'PROVIDER_CANCEL',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đã từ chối
      </Tag>
    ),
  },
  {
    key: 'PROVIDER_ACCEPT',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đang cung cấp
      </Tag>
    ),
  },
  {
    key: 'USER_FINISH_SOON',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Kết thúc sớm
      </Tag>
    ),
  },
  {
    key: 'FINISHED',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đã kết thúc
      </Tag>
    ),
  },
]

const mappingStatus = {
  all: 'Tất cả',
  INIT: 'Đang chờ',
  USER_CANCEL: 'Người thuê hủy',
  PROVIDER_CANCEL: 'Đã từ chối',
  PROVIDER_ACCEPT: 'Đang cung cấp',
  USER_FINISH_SOON: 'Kết thúc sớm',
  FINISHED: 'Đã kết thúc',
  PROVIDER_FINISH_SOON: 'Nhà cung cấp kết thúc sớm',
}

const BookingTransactionContainer = () => {
  const [transactions, setTransactions] = useState<BookingHistoryPagingResponse>()
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    status: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')

  const mappingDataWithKeys = (data) => {
    const dataWithKeys = data.row.map((data) => ({
      ...data,
      key: data.id,
    }))
    setCount(data.count)
    setTransactions(dataWithKeys)
  }
  const listQuerry: PrismaWhereConditionType<any> = Object.assign({
    OR: [
      {
        providerService: {
          provider: {
            name: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        },
      },
      {
        booker: {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      },
    ],
    status: filter.status !== 'all' ? filter.status : undefined,
  })
  console.log(transactions)

  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { providerService: ['$all', { provider: ['$all'] }], booker: ['$all'] }]
  const { isLoading, isFetching } = trpc.useQuery(
    [
      'transaction.getBookingTransactions',

      {
        limit: '10',
        page: page.toString(),
        where: prismaWhereConditionToJsonString(listQuerry, ['isUndefined']),
        select: JSON.stringify(SELECT),
        order: JSON.stringify(ORDER),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        mappingDataWithKeys(data?.data as any)
      },
    },
  )

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'status') {
      setFilter({
        ...filter,
        status: key,
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      setFilter({
        ...filter,
        search: searchChange,
      })
    }
  }

  const columns: ColumnsType<TableProps> = [
    {
      title: <div className="ml-3">Người thuê</div>,
      width: '10%',
      render(record) {
        return <div className="ml-3 truncate">{record.booker.name}</div>
      },
    },
    {
      title: <div className="ml-3">Nhà cung cấp</div>,
      width: '10%',
      render(record) {
        return (
          <div className="flex flex-col ml-3">
            <span className="text-[16px] font-medium">{record.providerService.provider.name}</span>
          </div>
        )
      },
    },
    {
      title: 'Thời gian thuê',
      dataIndex: 'bookingPeriod',
      width: '10%',
      align: 'center',
      render(bookingPeriod) {
        return (
          <div className="flex flex-col items-center">
            {bookingPeriod} {' h'}
          </div>
        )
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalCost',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      render(status) {
        return (
          <div className="flex justify-center items-center">
            <div className="p-2 rounded-lg bg-white text-black min-w-[80%] font-bold">{mappingStatus[status]}</div>
          </div>
        )
      },
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'createdAt',
      width: '10%',
      align: 'center',
      render(createdAt) {
        return <div className="flex flex-col items-center">{new Date(createdAt).toLocaleDateString('en-GB')}</div>
      },
    },
  ]
  return (
    <div>
      <span className="content-title">Quản lý nạp tiền</span>
      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <FilterDropdown
            id={'status'}
            CustomCss="w-[12rem]"
            title={`Trạng thái: ${mappingStatus[filter.status]}`}
            items={statusFilterItems}
            handleFilter={handleFilter}
          />
          <div className="flex items-center border-2 border-white rounded-lg bg-umeHeader">
            <Search className="pl-2 rounded-full active:bg-gray-700" theme="outline" size="24" fill="#fff" />
            <Input
              placeholder="Tìm kiếm theo tên"
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
        {10 * (page - 1) + 1}-{page * 10 > count ? count : page * 10} trên {count} giao dịch
      </div>
      <CommonTable
        locate={locale}
        columns={columns}
        data={transactions}
        loading={isLoading || isFetching}
        total={count}
        page={page}
        setPage={setPage}
      />
    </div>
  )
}

export default BookingTransactionContainer
