import { Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React, { useState } from 'react'

import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'

import { locale } from './components/empty-table.component'

import CommonTable from '~/components/common-table/Table'

import { trpc } from '~/utils/trpc'

type TableProps = {
  key: string
  id: string
  donor: string
  message: string
  receivedAmount: string
  recipient: string
  createdAt: string
  donatedAmount: string
}

const DonationTransactionContainer = () => {
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
        donor: {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      },
      {
        recipient: {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      },
    ],
  })

  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { donor: ['$all'], recipient: ['$all'] }]
  const { isLoading, isFetching } = trpc.useQuery(
    [
      'transaction.getDonationTransactions',

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

  const columns: ColumnsType<TableProps> = [
    {
      title: <div className="ml-3">Người ủng hộ</div>,
      width: '10%',
      render(record) {
        return <div className="ml-3 truncate">{record.donor.name}</div>
      },
    },
    {
      title: <div className="ml-3">Người nhận</div>,
      width: '10%',
      render(record) {
        return (
          <div className="flex flex-col ml-3">
            <span className="text-[16px] font-medium">{record.recipient.name}</span>
          </div>
        )
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      width: '15%',
    },
    {
      title: 'Số tiền ủng hộ',
      dataIndex: 'donatedAmount',
      width: '10%',
      align: 'center',
      render(donatedAmount) {
        return (
          <div className="flex flex-col items-center">
            {donatedAmount} {' VND'}
          </div>
        )
      },
    },
    {
      title: 'Số tiền nhận được',
      dataIndex: 'receivedAmount',
      width: '10%',
      align: 'center',
      render(receivedAmount) {
        return (
          <div className="flex flex-col items-center">
            {receivedAmount} {' VND'}
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
      <span className="content-title">Lịch sử ủng hộ</span>
      <div className="flex flex-col my-10">
        <div className="flex items-center justify-end">
          {/* <div className="flex">
            <FilterDropdown
              id={'platform'}
              CustomCss="w-[10rem]"
              title={`Nền tảng: ${mappingPlatform[filter.platform]}`}
              items={platformFilterItems}
              handleFilter={handleFilter}
            />
          </div> */}

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

export default DonationTransactionContainer
