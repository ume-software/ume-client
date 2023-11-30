import { CheckOne, CloseSmall, HandleX } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import React, { useState } from 'react'

import { Tooltip, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { WithdrawalRequestPagingResponse, WithdrawalRequestResponse } from 'ume-service-openapi'

import { locale } from './components/empty-table.component'
import TransactionStatus from './components/transaction-status'

import CommonTable from '~/components/common-table/Table'

import { trpc } from '~/utils/trpc'

type WithdrawTableProps = WithdrawalRequestResponse

type ConfirmModalType = {
  visible: boolean
  handleClose: () => void
  id?: string
  action: 'COMPLETED' | 'REJECTED'
}
const ConfirmForm = ({ visible, handleClose, id, action }: ConfirmModalType) => {
  const utils = trpc.useContext()
  const handleApprove = trpc.useMutation(['transaction.approveWithdrawRequest'])
  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: visible,
    form: (
      <div>
        <div className="flex justify-center mt-2 font-medium">
          <span className="text-white">
            Bạn có chắc chắn muốn{' '}
            {action === 'COMPLETED' ? (
              <span className="font-bold text-green-400">duyệt</span>
            ) : (
              <span className="font-bold text-red-400">từ chối</span>
            )}{' '}
            giao dịch này?
          </span>
        </div>
        <div className="flex flex-row justify-center gap-4 p-5">
          <Button
            customCSS="px-3 w-24 py-2 hover:bg-green-400 hover:text-black"
            type="button"
            onClick={() => {
              handleApprove.mutate(
                { id: id ?? '', action: action },
                {
                  onSuccess(success) {
                    if (success) {
                      notification.success({
                        message: 'Success',
                        description: `Giao dịch đã được ${action === 'COMPLETED' ? 'duyệt' : 'từ chối'}`,
                      })
                      handleClose()
                      utils.invalidateQueries(['transaction.getWithdrawRequest'])
                    }
                  },
                  onError(error) {
                    notification.error({
                      message: 'Error',
                      description: 'Có lỗi xảy ra, vui lòng thử lại sau',
                    })
                  },
                },
              )
            }}
          >
            Xác nhận
          </Button>
          <Button
            customCSS="px-3 w-24 py-2 hover:bg-red-400 hover:text-black"
            type="button"
            onClick={() => {
              handleClose()
            }}
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    ),
    title: <span className="text-white">Xác nhận</span>,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Esc' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{confirmModal}</>
}

const WithdrawTransactionPage = () => {
  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all', { requester: ['$all'] }]
  const [transactions, setTransactions] = useState<Array<any>>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState<string>()
  const [action, setAction] = useState<any>()

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
        setTransactions(data.data ?? [])
      },
    },
  )
  const handleOpenConfirmModal = (_id: string, action: 'COMPLETED' | 'REJECTED') => {
    setVisible(true)
    setId(_id)
    setAction(action)
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
      align: 'left',
      render(value) {
        return <TransactionStatus status={value} />
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
                <Tooltip placement="top" title={'Chấp thuận'}>
                  <CheckOne
                    onClick={() => handleOpenConfirmModal(record.id, 'COMPLETED')}
                    className="p-2 mr-2 rounded-full hover:bg-gray-500"
                    theme="two-tone"
                    size="30"
                    fill={['#48e05f', '#292734']}
                  />
                </Tooltip>
              )}
            </Button>
            <Button isActive={false} customCSS="flex justify-center items-center">
              {record.status === 'PENDING' && (
                <Tooltip placement="top" title={'Từ chối'}>
                  <HandleX
                    onClick={() => handleOpenConfirmModal(record.id, 'REJECTED')}
                    className="p-2 mr-2 rounded-full hover:bg-gray-500"
                    theme="two-tone"
                    size="30"
                    fill={['#e04848', '#292734']}
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
      <ConfirmForm visible={visible} handleClose={() => setVisible(false)} id={id} action={action} />
    </div>
  )
}

export default WithdrawTransactionPage
