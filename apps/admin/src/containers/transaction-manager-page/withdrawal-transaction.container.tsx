import { Eyes } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { WithdrawalRequestPagingResponse, WithdrawalRequestResponse } from 'ume-service-openapi'

import { locale } from './components/empty-table.component'
import TransactionStatus from './components/transaction-status'
import WithdrawalTransactionModal from './components/withdrawal-transaction-modal'

import CommonTable from '~/components/common-table/Table'

import { trpc } from '~/utils/trpc'

type WithdrawTableProps = WithdrawalRequestResponse

type ConfirmModalType = {
  visible: boolean
  handleClose: () => void
  id?: string
  action: 'COMPLETED' | 'REJECTED'
}

const WithdrawalTransactionPage = () => {
  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { requester: ['$all'], userPaymentSystem: ['$all'] }]
  const [transactions, setTransactions] = useState<Array<any>>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState<string>()

  const mappingListWithKeys = (data) => {
    const dataWithKeys = data.map((item) => ({
      ...item,
      key: item.id,
    }))
    return dataWithKeys
  }

  const listQuerry: PrismaWhereConditionType<WithdrawalRequestPagingResponse> = {}
  const { isLoading, isFetching } = trpc.useQuery(
    [
      'transaction.getWithdrawRequest',
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
        setCount(data?.count ?? 0)
        setTransactions(mappingListWithKeys(data?.data as any))
      },
    },
  )
  const handleOpenConfirmModal = (_id: string) => {
    setVisible(true)
    setId(_id)
  }

  function closeModalHandle() {
    setVisible(false)
  }

  const columns: ColumnsType<WithdrawTableProps> = [
    {
      title: <div className="ml-4">Thông tin người dùng</div>,
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
      title: <div className="ml-1">Nền tảng giao dịch</div>,
      width: '10%',
      align: 'center',
      render(record) {
        return <div className="flex justify-center font-bold">{record.userPaymentSystem?.platform}</div>
      },
    },
    {
      title: 'Số tiền rút',
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
      title: <div className="ml-1">Trạng thái</div>,
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      render(value) {
        return (
          <div className="flex justify-center">
            <TransactionStatus status={value} />
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
      align: 'center',
      width: '10%',
      render(record) {
        return (
          <div>
            <Button isActive={false} customCSS="flex justify-center items-center">
              {record.status === 'PENDING' && (
                <Tooltip placement="top" title={'Xem yêu cầu'}>
                  <Eyes
                    onClick={() => handleOpenConfirmModal(record.id)}
                    className="p-2 mr-2 rounded-full hover:bg-gray-500"
                    size="25"
                    fill={['#fff']}
                  />
                </Tooltip>
              )}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <span className="content-title">Giao dịch rút tiền</span>
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
      {id && <WithdrawalTransactionModal id={id} openValue={visible} closeFunction={closeModalHandle} />}
    </div>
  )
}

export default WithdrawalTransactionPage
