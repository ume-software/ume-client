import { Eyes, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import EmptyErrorPic from 'public/empty_error.png'

import React, { useState } from 'react'

import { Tag, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'
import Image from 'next/image'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { ReportUserPagingResponse, ReportUserResponseReasonTypeEnum } from 'ume-service-openapi'

import ReportDetails from './components/report-details'

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
    key: ReportUserResponseReasonTypeEnum.AbusiveLanguage,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Ngôn ngữ lăng mạ
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.Cheating,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Gian lận
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.FakeAccountOrScam,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Lừa đảo
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.IllegalTransactions,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Giao dịch phi pháp
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.InappropriateContent,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Nội dung không phù hợp
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.SpamOrHarassment,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Quấy rối
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.ViolentOrDiscriminatoryBehavior,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Hành vi bạo lực
      </Tag>
    ),
  },
  {
    key: ReportUserResponseReasonTypeEnum.Other,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Khác
      </Tag>
    ),
  },
]

const mappingReason = {
  all: 'Tất cả',
  ABUSIVE_LANGUAGE: 'Ngôn ngữ lăng mạ',
  CHEATING: 'Gian lận',
  SPAM_OR_HARASSMENT: 'Spam hoặc quấy rối',
  INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
  VIOLENT_OR_DISCRIMINATORY_BEHAVIOR: 'Hành vi bạo lực',
  FAKE_ACCOUNT_OR_SCAM: 'Lừa đảo',
  ILLEGAL_TRANSACTIONS: 'Giao dịch phi pháp',
  OTHER: 'Khác',
}

type tableProps = {
  key: string
  id: string
  content: string
  createdAt: string
  deletedAt: string
  reasonType: string
  reportedUserId: string
  reportingUserId: string
  updatedAt: string
}

const ReportManagerContainer = () => {
  const [reports, setReports] = useState<ReportUserPagingResponse | undefined>()
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({
    reasonType: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')
  const [reportId, setReportId] = useState(null)
  const [openReportDetail, setOpenReportDetail] = useState(false)
  function openDetailHandler(requestId) {
    setReportId(requestId)
    setOpenReportDetail(true)
  }
  function closeReportDetailHandle() {
    setOpenReportDetail(false)
  }

  const mappingListWithKeys = (data) => {
    const transactionsWithKeys = data.row.map((item) => ({
      ...item,
      key: item.id,
    }))
    setCount(data.count)
    setReports(transactionsWithKeys)
  }

  const listQuerry: PrismaWhereConditionType<ReportUserPagingResponse> = Object.assign({
    reasonType: filter.reasonType !== 'all' ? filter.reasonType : undefined,
  })
  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { reportingUser: ['$all'], reportedUser: ['$all'] }]
  const { isLoading } = trpc.useQuery(
    [
      'report.getReportList',
      {
        page: page.toString(),
        where: prismaWhereConditionToJsonString(listQuerry, ['isUndefined']),
        order: JSON.stringify(ORDER),
        select: JSON.stringify(SELECT),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        mappingListWithKeys(data?.data as any)
      },
      onError(error: any) {
        notification.error({
          message: 'Lỗi khi lấy data',
          description: error.message,
        })
      },
    },
  )
  console.log(reports)

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'platform') {
      setFilter({
        ...filter,
        reasonType: key,
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

  const columns: ColumnsType<tableProps> = [
    {
      title: <div className="ml-3">Người báo cáo</div>,
      width: '15%',
      align: 'center',
      render(record) {
        return <div className="ml-3">{record.reportingUser.name}</div>
      },
    },
    {
      title: 'Người bị báo cáo',
      width: '15%',
      align: 'center',
      render(record) {
        return <div className="ml-3">{record.reportedUser.name}</div>
      },
    },
    {
      title: 'Loại báo cáo',
      dataIndex: 'reasonType',
      width: '15%',
      align: 'center',
      render(reasonType) {
        return <div className="flex flex-col items-center">{mappingReason[reasonType]}</div>
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'content',
      render(content) {
        return <div>{content}</div>
      },
    },
    {
      title: 'Ngày báo cáo',
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
      render(record) {
        return (
          <Button isActive={false} customCSS="flex justify-center items-center">
            <Eyes
              onClick={() => {
                openDetailHandler(record.id)
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
      <Head>
        <title>UME | Reports Manager</title>
      </Head>
      <span className="content-title">Quản lý báo cáo</span>
      <div className="flex flex-col my-10">
        <div className="flex items-center justify-between">
          <div className="flex">
            <FilterDropdown
              id={'platform'}
              CustomCss="w-[10rem]"
              title={`Lý do: ${mappingReason[filter.reasonType]}`}
              items={platformFilterItems}
              handleFilter={handleFilter}
            />
          </div>

          <div className="flex items-center border-2 border-white rounded-lg bg-umeHeader">
            <Search className="p-2 rounded-full active:bg-gray-700" theme="outline" size="24" fill="#fff" />
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
        {10 * (page - 1) + 1}-{page * 10 > count!! ? count : page * 10} trên {count} báo cáo
      </div>
      <CommonTable
        locate={locale}
        columns={columns}
        data={reports}
        loading={isLoading}
        total={count}
        page={page}
        setPage={setPage}
      />
      {openReportDetail && reportId && (
        <ReportDetails
          mappingReason={mappingReason}
          id={reportId}
          openValue={openReportDetail}
          closeFunction={closeReportDetailHandle}
        />
      )}
    </div>
  )
}

export default ReportManagerContainer
