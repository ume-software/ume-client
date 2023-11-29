import { Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'

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

const BookingTransactionContainer = () => {
  const [transactions, setTransactions] = useState<any>()
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    platform: 'all',
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
  })

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
        <div className="flex items-center justify-end">
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
