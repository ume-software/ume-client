import { Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { DepositPagingResponse } from 'ume-service-openapi'

import { locale } from './components/empty-table.component'

import CommonTable from '~/components/common-table/Table'
import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

const platformFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'MOMO',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        MoMo
      </Tag>
    ),
  },
  {
    key: 'VNPAY',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        VNPAY
      </Tag>
    ),
  },
]

const mappingPlatform = {
  all: 'Tất cả',
  MOMO: 'MoMo',
  VNPAY: 'VNPAY',
}

type DepositTableProps = {
  key: string
  id: string
  email: string
  name: string
  phone: string
  address: string
  status: string
  action: string
}

const DepositTransactionContainer = () => {
  const [transactions, setTransactions] = useState<any>()
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    platform: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')

  const updateTransactionsWithKeys = (data) => {
    const transactionsWithKeys = data.row.map((transaction) => ({
      ...transaction,
      key: transaction.id,
    }))
    setCount(data.count)
    setTransactions(transactionsWithKeys)
  }

  const listQuerry: PrismaWhereConditionType<DepositPagingResponse> = Object.assign({
    transactionCode: {
      contains: filter.search,
      mode: 'insensitive',
    },
    platform: filter.platform !== 'all' ? filter.platform : undefined,
  })

  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { requester: ['$all'] }]
  const { isLoading, isFetching } = trpc.useQuery(
    [
      'transaction.getDepositTransactions',

      {
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
        console.log(data?.data)
        updateTransactionsWithKeys(data?.data as any)
      },
    },
  )

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'platform') {
      setFilter({
        ...filter,
        platform: key,
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

  const columns: ColumnsType<DepositTableProps> = [
    {
      title: <div className="ml-3">Mã giao dịch</div>,
      dataIndex: 'transactionCode',
      width: '5%',
      render(item) {
        return <div className="ml-3 truncate">{item}</div>
      },
    },
    {
      title: <div className="ml-4">Thông tin người giao dịch</div>,
      width: '15%',
      render(record) {
        return (
          <div className="flex flex-col ml-4">
            <span className="text-[16px] font-medium">{record.requester.name}</span>
            <span className="font-mono text-sm text-slate-300">{record.requester.email}</span>
          </div>
        )
      },
    },
    {
      title: 'Nền tảng',
      dataIndex: 'platform',
      width: '10%',
      align: 'center',
      render(platform) {
        return (
          <div className="flex flex-col items-center">
            {
              {
                MOMO: <div className="flex justify-center px-3 py-2 bg-pink-600 rounded-lg ">MOMO</div>,
                VNPAY: <div className="flex justify-center px-3 py-2 bg-blue-400 rounded-lg ">VNPAY</div>,
              }[platform]
            }
          </div>
        )
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amountMoney',
      width: '10%',
      align: 'center',
      render(amountMoney) {
        return (
          <div className="flex flex-col items-center">{`${amountMoney
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ`}</div>
        )
      },
    },
    {
      title: 'Ngày tạo',
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
          <div className="flex">
            <FilterDropdown
              id={'platform'}
              CustomCss="w-[10rem]"
              title={`Nền tảng: ${mappingPlatform[filter.platform]}`}
              items={platformFilterItems}
              handleFilter={handleFilter}
            />
          </div>

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

export default DepositTransactionContainer
