import { Button } from '@ume/ui'
import StatusBlock from '~/containers/kyc-provider-page/components/kyc-status'

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

export const KYCTable = () => {
  const [kycList, setKYCList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [kcyModal, setKYCModal] = useState(false)
  const [record, setRecord] = useState<any>(null)
  const [total, setTotal] = useState(0)

  const mappingDataWithKeys = (data) => {
    const dataWithKeys = data.map((data) => ({
      ...data,
      key: data.id,
    }))
    return dataWithKeys
  }

  const handleClose = useCallback(() => {
    setKYCModal(false)
    setRecord(null)
  }, [])

  const getKYCList = trpc.useQuery(
    [
      'provider.getListRequestKYC',
      {
        select: prismaSelectToJsonString(SELECT_TRANS),
        limit: LIMIT_PAGE_SIZE,
        page: `${page}`,
        where: prismaWhereConditionToJsonString(IGNORE_PENDING_QUERY),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setKYCList(mappingDataWithKeys(data.data))
        setTotal(Number(data.count))
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
        return <div className="flex justify-start"></div>
      },
    },
  ]

  return (
    <div className="flex flex-col gap-1">
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
            total={total}
            page={page}
            setPage={setPage}
            pageSize={Number(LIMIT_PAGE_SIZE)}
          />
          <KYCModal visible={kcyModal} handleClose={handleClose} data={record} />
        </div>
      </div>
    </div>
  )
}
