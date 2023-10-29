import { Eyes, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import coinIcon from 'public/coin-icon.png'
import EmptyErrorPic from 'public/empty_error.png'

import React, { useState } from 'react'

import { Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { BuyCoinResponse } from 'ume-service-openapi'

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
  const [transactions, setTransactions] = useState<any | undefined>()
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

  const listQuerry: PrismaWhereConditionType<BuyCoinResponse> = Object.assign({
    transactionCode: {
      contains: filter.search,
      mode: 'insensitive',
    },
    platform: filter.platform !== 'all' ? filter.platform : undefined,
  })
  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { requester: ['$all'] }]
  const { isLoading } = trpc.useQuery(
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
      onSuccess(data) {
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

  const columns: ColumnsType<DepositTableProps> = [
    {
      title: <div className="ml-3">Mã giao dịch</div>,
      dataIndex: 'transactionCode',
      width: '10%',
      render(item) {
        return <div className="ml-3">{item}</div>
      },
    },
    {
      title: 'Người giao dịch',
      width: '15%',
      align: 'center',
      render(record) {
        return <div className="flex flex-col items-center">{record.requester.name}</div>
      },
    },
    {
      title: 'Nền tảng',
      dataIndex: 'platform',
      width: '10%',
      align: 'center',
      render(platform) {
        return <div className="flex flex-col items-center">{platform}</div>
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amountMoney',
      width: '10%',
      align: 'center',
      render(amountMoney) {
        return <div className="flex flex-col items-center">{`${amountMoney} VND`}</div>
      },
    },
    {
      title: 'Thành xu',
      dataIndex: 'amountCoin',
      width: '10%',
      align: 'center',
      render(amountCoin) {
        return (
          <div className="flex justify-center items-center">
            {amountCoin} <Image alt="Xu" src={coinIcon} width={30} height={30} />
          </div>
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
    {
      title: '',
      width: '10%',
      align: 'center',
      render(record) {
        return (
          <Button isActive={false} customCSS="flex justify-center items-center">
            <Eyes
              onClick={() => {
                console.log(record)
              }}
              className="p-2 mr-2 rounded-full hover:bg-gray-500"
              theme="outline"
              size="18"
              fill="#fff"
            />
          </Button>
        )
      },
    },
  ]
  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }
  return (
    <div>
      <span className="content-title">Quản Lý người dùng</span>
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

          <div className="flex items-center rounded-lg bg-umeHeader border-2 border-white">
            <Search className=" active:bg-gray-700 p-2 rounded-full" theme="outline" size="24" fill="#fff" />
            <Input
              placeholder="Tìm kiếm tên người dùng"
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
        {10 * (page - 1) + 1}-{page * 10 > count!! ? count : page * 10} trên {count} giao dịch
      </div>
      <CommonTable
        locate={locale}
        columns={columns}
        data={transactions}
        loading={isLoading}
        total={count}
        page={page}
        setPage={setPage}
      />
    </div>
  )
}

export default DepositTransactionContainer
