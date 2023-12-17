import { Eyes, Write } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'

import ResolveComplaintModal from './components/resolve-complaint-modal'

import { locale } from '~/components/common-table/EmptyTableComponent'
import CommonTable from '~/components/common-table/Table'
import FilterDropdown from '~/components/filter-dropdown'

import { trpc } from '~/utils/trpc'

type tableProps = {
  key: string
  attachments: []
  booking: {}
  bookingHistoryId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  complaintDescription: string
  complaintStatus: string
  complaintType: string
  sendedToProviderAt: string
  id: string
}

const complaintStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'REJECTED',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đã từ chối
      </Tag>
    ),
  },
  {
    key: 'RESOLVED',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đã chấp nhận
      </Tag>
    ),
  },
  {
    key: 'PENDING_PROCESSING',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Chờ xử lý
      </Tag>
    ),
  },
  {
    key: 'AWAITING_PROVIDER_RESPONSE',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Chờ nhà cung cấp phản hồi
      </Tag>
    ),
  },
  {
    key: 'PROVIDER_RESPONDED',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Nhà cung cấp đã phản hồi
      </Tag>
    ),
  },
]

const mappingComplaintStatus = {
  all: 'Tất cả',
  REJECTED: 'Đã từ chối',
  RESOLVED: 'Đã chấp nhận',
  PENDING_PROCESSING: 'Chờ xử lý',
  AWAITING_PROVIDER_RESPONSE: 'Chờ nhà cung cấp phản hồi',
  PROVIDER_RESPONDED: 'Nhà cung cấp đã phản hồi',
}

const complaintTypeFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'WRONG_SERVICE_PROVIDED',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Sai dịch vụ đã thuê
      </Tag>
    ),
  },
  {
    key: 'FRAUD',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Gian lận
      </Tag>
    ),
  },
  {
    key: 'DELAYED_SERVICE',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Cung cấp dịch vụ chậm
      </Tag>
    ),
  },
  {
    key: 'OTHER',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Khác
      </Tag>
    ),
  },
]

const mappingComplaintType = {
  all: 'Tất cả',
  WRONG_SERVICE_PROVIDED: 'Sai dịch vụ đã thuê',
  FRAUD: 'Gian lận',
  DELAYED_SERVICE: 'Cung cấp dịch vụ chậm',
  OTHER: 'Khác',
}

const ComplaintBookingContainer = () => {
  const [complaintList, setComplaintList] = useState<any | undefined>()
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState({
    complaintStatus: 'all',
    complaintType: 'all',
  })
  const [complaintId, setComplaintId] = useState('')
  const [openResolveModal, setOpenResolveModal] = useState(false)

  const testQuerry: PrismaWhereConditionType<any> = Object.assign({
    complaintType: filter.complaintType !== 'all' ? filter.complaintType : undefined,
    complaintStatus: filter.complaintStatus !== 'all' ? filter.complaintStatus : undefined,
  })
  const ORDER = [{ createdAt: 'desc' }]
  const SELECT = [
    '$all',
    { bookingComplaintResponses: ['$all'] },
    {
      booking: [
        '$all',
        { providerService: ['$all', { provider: ['$all'] }, { service: ['$all'] }] },
        { booker: ['$all'] },
      ],
    },
  ]

  const mappingDataWithKeys = (data) => {
    const dataWithKeys = data.map((data) => ({
      ...data,
      key: data.id,
    }))
    return dataWithKeys
  }

  const { isLoading } = trpc.useQuery(
    [
      'complaint.getAllComplaint',
      {
        page: page.toString(),
        where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']),
        select: JSON.stringify(SELECT),
        order: JSON.stringify(ORDER),
      },
    ],
    {
      onSuccess(data) {
        setComplaintList(mappingDataWithKeys(data?.data?.row as any))
        setCount(data?.data?.count as any)
      },
    },
  )
  const handleFilter = (id, key) => {
    setPage(1)
    if (id == 'complaintType') {
      setFilter({
        ...filter,
        complaintType: key,
      })
    } else if (id == 'complaintStatus') {
      setFilter({
        ...filter,
        complaintStatus: key,
      })
    }
  }

  const openResolveModalHandle = (id) => {
    setComplaintId(id)
    setOpenResolveModal(true)
  }
  const closeResolveModalHandle = () => {
    setOpenResolveModal(false)
  }

  const columns: ColumnsType<tableProps> = [
    {
      title: <div className="ml-3">Người khiếu nại</div>,
      width: '15%',
      dataIndex: 'booking',
      render(booking) {
        return <div className="ml-3">{booking?.booker?.name}</div>
      },
    },
    {
      title: 'Nhà cung cấp',
      width: '15%',
      dataIndex: 'booking',
      render(booking) {
        return <div>{booking?.providerService?.provider?.name}</div>
      },
    },
    {
      title: 'Loại khiếu nại',
      dataIndex: 'complaintType',
      width: '15%',
      align: 'center',
      render(complaintType) {
        return <div>{mappingComplaintType[complaintType]}</div>
      },
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'booking',
      width: '15%',
      align: 'center',
      render(booking) {
        return <div>{booking?.providerService?.service?.name}</div>
      },
    },

    {
      title: <div className="flex items-center justify-center">Trạng thái</div>,
      key: 'complaintStatus',
      dataIndex: 'complaintStatus',
      render: (text) => (
        <div className="flex items-center justify-center">
          <Tag className="px-3 py-2 m-0  bg-white font-bold rounded-lg">{mappingComplaintStatus[text]}</Tag>
        </div>
      ),
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: '15%',
      align: 'center',
      render(createdAt) {
        return <div className="flex flex-col items-center">{new Date(createdAt).toLocaleDateString('en-GB')}</div>
      },
    },
    {
      title: '',
      width: '10%',
      align: 'center',
      render: (record) => {
        return (
          <div className="flex justify-around max-w-[10rem]">
            {!(record?.complaintStatus === 'REJECTED' || record?.complaintStatus === 'RESOLVED') ? (
              <Button isActive={false}>
                <Write
                  onClick={() => {
                    openResolveModalHandle(record.key)
                  }}
                  className="p-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#fff"
                />
              </Button>
            ) : (
              <Button isActive={false}>
                <Eyes
                  onClick={() => {
                    openResolveModalHandle(record.key)
                  }}
                  className="p-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#fff"
                />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Head>
        <title>UME | Complaint Booking Manager</title>
      </Head>
      <div className="pb-10">
        <div className="flex justify-between items-center">
          <span className="content-title">Quản lý khiếu nại dịch vụ</span>
        </div>
        <div className="flex flex-col my-10">
          <div className="flex items-center justify-between">
            <div className="flex">
              <FilterDropdown
                id={'complaintStatus'}
                CustomCss="w-[12rem]"
                title={`Trạng thái: ${mappingComplaintStatus[filter.complaintStatus]}`}
                items={complaintStatusFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id={'complaintType'}
                CustomCss="w-[12rem]"
                title={`Loại khiếu nại: ${mappingComplaintType[filter.complaintType]}`}
                items={complaintTypeFilterItems}
                handleFilter={handleFilter}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-5 text-gray-500">
          {10 * (page - 1) + 1}-{page * 10 > count!! ? count : page * 10} trên {count} khiếu nại.
        </div>
        <CommonTable
          locate={locale}
          columns={columns}
          data={complaintList}
          loading={isLoading}
          total={count}
          page={page}
          setPage={setPage}
        />
        {openResolveModal && (
          <ResolveComplaintModal
            id={complaintId}
            openValue={openResolveModal}
            closeFunction={closeResolveModalHandle}
          />
        )}
      </div>
    </div>
  )
}

export default ComplaintBookingContainer
