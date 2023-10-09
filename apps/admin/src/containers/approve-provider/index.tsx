import { useState } from 'react'

import { notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'
import { PrismaSelectType, prismaSelectToJsonString } from 'query-string-prisma-ume'
import { UserKYCRequestResponse } from 'ume-service-openapi'

import CommonTable from '~/components/common-table'
import StatusBlock from '~/components/status'

import { LIMIT_PAGE_SIZE } from '~/utils/constant'
import { trpc } from '~/utils/trpc'

type KYCTableProps = {
  id: number
  email: string
  name: string
  phone: string
  address: string
  status: string
  action: string
}

const ApproveProvider = () => {
  const [kycList, setKYCList] = useState<any>([])
  const [page, setPage] = useState(1)

  const selectTrans: PrismaSelectType<UserKYCRequestResponse> = [
    '$all',
    {
      user: ['$all'],
    },
  ]

  trpc.useQuery(
    [
      'provider.getListRequestKYC',
      {
        select: prismaSelectToJsonString(selectTrans),
        limit: LIMIT_PAGE_SIZE,
        page: `${page}`,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        console.log(data.data)
        setKYCList(data.data)
      },
      onError(error: any) {
        notification.error({
          message: 'Error to fetching data',
          description: error.message,
        })
      },
    },
  )

  const column: ColumnsType<KYCTableProps> = [
    { title: '', dataIndex: '' },
    {
      title: <div className="ml-4">Client Infomation</div>,
      dataIndex: 'name',
      width: '25%',
      align: 'left',
      render(value, record) {
        return (
          <div className="flex flex-col ml-4">
            <span className="text-[15px] font-medium">{value}</span>
            <span className="font-mono text-sm text-slate-300">{record.email}</span>
          </div>
        )
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      width: '25%',
      align: 'center',
    },
    {
      title: <div className="">Status</div>,
      dataIndex: 'status',
      render(value) {
        return <StatusBlock status={value} />
      },
    },
    {
      title: '',
      render(value, record, index) {
        return (
          <div className="flex flex-row justify-center">
            <button type="button" className="hover:bg">
              hihi
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Head>
        <title>Admin | KYC</title>
      </Head>
      <div>
        <div className="mb-5">
          <span className="content-title">List KYC</span>
        </div>
        <div>
          <CommonTable columns={column} data={kycList} loading={false} onChange={undefined} />
        </div>
      </div>
    </div>
  )
}

export default ApproveProvider
