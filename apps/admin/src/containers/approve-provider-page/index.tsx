import { Button } from '@ume/ui'
import StatusBlock from '~/containers/approve-provider-page/components/kyc-status'

import { useCallback, useState } from 'react'

import { Image as AntdImage, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'
import Image from 'next/image'
import {
  PrismaSelectType,
  PrismaWhereConditionType,
  prismaSelectToJsonString,
  prismaWhereConditionToJsonString,
} from 'query-string-prisma-ume'
import { UserKYCRequestResponse } from 'ume-service-openapi'

import EmptyErrorPic from '../../../public/empty_error.png'
import { KYCModal } from './components/kyc-modal'

import CommonTable from '~/components/common-table/Table'

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

const PENDING_QUERY: PrismaWhereConditionType<UserKYCRequestResponse> = {
  userKYCStatus: 'PENDING',
}

const IGNORE_PENDING_QUERY: PrismaWhereConditionType<UserKYCRequestResponse> = {
  userKYCStatus: {
    not: 'PENDING',
  },
}

const SELECT_TRANS: PrismaSelectType<UserKYCRequestResponse> = [
  '$all',
  {
    user: ['$all'],
  },
]

const ApproveProvider = () => {
  const [kycList, setKYCList] = useState<any>([])
  const [kycListPending, setKYCListPending] = useState<any>([])
  const [pagePendingKYC, setPagePendingKYC] = useState(1)
  const [kcyModal, setKYCModal] = useState(false)
  const [record, setRecord] = useState<any>(null)
  const [totalPendingKYC, setTotalPedingKYC] = useState(0)

  const handleClose = useCallback(() => {
    setKYCModal(false)
    setRecord(null)
  }, [])

  // Get kyc approved or rejected list
  const getKYCList = trpc.useQuery(
    [
      'provider.getListRequestKYC',
      {
        select: prismaSelectToJsonString(SELECT_TRANS),
        limit: LIMIT_PAGE_SIZE,
        page: `${1}`,
        where: prismaWhereConditionToJsonString(IGNORE_PENDING_QUERY),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
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

  // Get kyc pending list
  const getPendingList = trpc.useQuery(
    [
      'provider.getListRequestKYC',
      {
        select: prismaSelectToJsonString(SELECT_TRANS),
        limit: LIMIT_PAGE_SIZE,
        page: `${pagePendingKYC}`,
        where: prismaWhereConditionToJsonString(PENDING_QUERY),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setKYCListPending(data.data)
        setTotalPedingKYC(Number(data.count))
      },
      onError(error: any) {
        notification.error({
          message: 'Error to fetching data',
          description: error.message,
        })
      },
    },
  )

  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  const pendingTable: ColumnsType<KYCTableProps> = [
    {
      title: 'Hình đại diện',
      dataIndex: 'avatarUrl',
      width: '15%',
      align: 'center',
      render(value, record, index) {
        return (
          <div className="flex flex-col items-center ">
            <AntdImage className="rounded-full" height={50} width={50} src={value} alt="avatar" />
          </div>
        )
      },
    },
    {
      title: <div className="ml-4">Thông tin người dùng</div>,
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
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: '15%',
      align: 'center',
    },
    {
      title: <div className="ml-5">Trạng thái</div>,
      width: '10%',
      dataIndex: 'status',
      render(value) {
        return <StatusBlock status={value} />
      },
    },
    {
      title: <div className="flex">Ngày tạo đơn</div>,
      dataIndex: 'createdAt',
      width: '10%',
      render: (value) => <div className="">{new Date(value).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      render(record) {
        return (
          <div className="flex">
            <div className="flex flex-row justify-center gap-2">
              <Button
                customCSS="px-3 py-2 hover:bg-green-400 hover:text-black "
                type="button"
                onClick={() => {
                  setRecord(record)
                  setKYCModal(true)
                }}
              >
                Xem đơn
              </Button>
              {record.slug && (
                <Button customCSS="p-2 bg-green-600 hover:text-black" type="button" isDisable={!record.slug}>
                  <a
                    className="hover:text-black"
                    target="_blank"
                    href={`https://facebook.com`}
                    rel="noopener noreferrer"
                  >
                    Xem trang cá nhân
                  </a>
                </Button>
              )}
            </div>
          </div>
        )
      },
    },
  ]

  const kycTable: ColumnsType<KYCTableProps> = [
    {
      title: 'Hình đại diện',
      dataIndex: 'avatarUrl',
      width: '10%',
      align: 'center',
      render(value, record, index) {
        return (
          <div className="flex flex-col items-center">
            <AntdImage className="rounded-full" height={50} width={50} src={value} alt="avatar" />
          </div>
        )
      },
    },
    {
      title: <div className="ml-4">Thông tin người dùng</div>,
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
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: '15%',
      align: 'center',
    },
    {
      title: <div className="ml-5">Trạng thái</div>,
      width: '10%',
      dataIndex: 'status',
      render(value) {
        return <StatusBlock status={value} />
      },
    },
    {
      title: <div className="flex">Ngày duyệt đơn</div>,
      dataIndex: 'updatedAt',
      width: '12%',

      render: (value) => <div>{new Date(value).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      render(record) {
        return (
          <div className="flex justify-start">
            <div className="flex flex-row justify-center gap-2">
              <Button customCSS="p-2 bg-green-600 hover:text-black" type="button" isDisable={!record.slug}>
                <a className="hover:text-black" target="_blank" href={`https://facebook.com`} rel="noopener noreferrer">
                  Xem trang cá nhân
                </a>
              </Button>
            </div>
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
        <div className="flex flex-col gap-1">
          <div className="mb-5">
            <span className="content-title">Hàng chờ</span>
          </div>
          <div>
            <CommonTable
              columns={pendingTable}
              locate={locale}
              data={kycListPending}
              loading={getPendingList.isFetching || getPendingList.isLoading}
              setPage={setPagePendingKYC}
              page={pagePendingKYC}
              pageSize={Number(LIMIT_PAGE_SIZE)}
              total={totalPendingKYC}
            />
            <KYCModal visible={kcyModal} handleClose={handleClose} data={record} />
          </div>
          <div>
            <div className="mb-5">
              <span className="content-title">Đơn đã duyệt</span>
            </div>
            <div>
              <CommonTable
                locate={locale}
                columns={kycTable}
                data={kycList}
                loading={getKYCList.isLoading || getKYCList.isFetching}
              />
              <KYCModal visible={kcyModal} handleClose={handleClose} data={record} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApproveProvider
