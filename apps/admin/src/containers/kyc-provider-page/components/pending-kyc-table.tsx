import { Button } from '@ume/ui'

import { useCallback, useState } from 'react'

import { Image as AntdImage, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import {
  PrismaSelectType,
  PrismaWhereConditionType,
  prismaSelectToJsonString,
  prismaWhereConditionToJsonString,
} from 'query-string-prisma-ume'
import { UserKYCRequestResponse } from 'ume-service-openapi'

import EmptyErrorPic from '../../../../public/empty_error.png'
import { KYCModal } from './kyc-modal'
import StatusBlock from './kyc-status'

import CommonTable from '~/components/common-table/Table'

import { LIMIT_PAGE_SIZE } from '~/utils/constant'
import { trpc } from '~/utils/trpc'

const PENDING_QUERY: PrismaWhereConditionType<UserKYCRequestResponse> = {
  userKYCStatus: 'PENDING',
}

const SELECT_TRANS: PrismaSelectType<UserKYCRequestResponse> = [
  '$all',
  {
    user: ['$all'],
  },
]

type KYCTableProps = {
  id: number
  email: string
  name: string
  phone: string
  address: string
  status: string
  action: string
}
export const PendingKYCTable = () => {
  const [kycListPending, setKYCListPending] = useState<any>([])
  const [pagePendingKYC, setPagePendingKYC] = useState(1)
  const [totalPendingKYC, setTotalPendingKYC] = useState(0)
  const [kycModal, setKycModal] = useState(false)
  const [record, setRecord] = useState<any>(null)

  const handleClose = useCallback(() => {
    setKycModal(false)
    setRecord(null)
  }, [])

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
        setTotalPendingKYC(Number(data.count))
      },
      onError(error: any) {
        notification.error({
          message: 'Error to fetching data',
          description: error.message,
        })
      },
    },
  )

  const pendingTable: ColumnsType<KYCTableProps> = [
    {
      title: 'Hình đại diện',
      dataIndex: 'avatarUrl',
      width: '15%',
      align: 'center',
      render(value) {
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
                  setKycModal(true)
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

  const locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }
  return (
    <>
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
        <KYCModal visible={kycModal} handleClose={handleClose} data={record} />
      </div>
    </>
  )
}
