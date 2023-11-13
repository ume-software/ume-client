/* eslint-disable react-hooks/exhaustive-deps */
import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'
import { useAuth } from '~/contexts/auth'

import { useEffect, useId, useState } from 'react'

import { notification } from 'antd'
import {
  BalanceHistoryPagingResponse,
  BalanceHistoryResponseBalanceTypeEnum,
  VoucherResponseStatusEnum,
} from 'ume-service-openapi'

import ColumnChart from './column-chart'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const TransactionContent: IEnumType[] = [
  { key: BalanceHistoryResponseBalanceTypeEnum.Admin, label: 'Admin chuyển tiền' },
  { key: BalanceHistoryResponseBalanceTypeEnum.Deposit, label: 'Nạp tiền' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetBooking, label: 'Nhận từ đơn hàng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetDonate, label: 'Quà tặng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetGift, label: 'Quà tặng' },
  { key: BalanceHistoryResponseBalanceTypeEnum.GetMission, label: 'Nhận từ nhiệm vụ' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendBooking, label: 'Đặt đơn' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendDonate, label: 'Tặng quà' },
  { key: BalanceHistoryResponseBalanceTypeEnum.SpendGift, label: 'Tặng quà' },
  { key: BalanceHistoryResponseBalanceTypeEnum.Withdraw, label: 'Rút tiền' },
]

const mappingStatus: IEnumType[] = [
  { key: VoucherResponseStatusEnum.Approved, label: 'Chấp nhận', color: '#008000', textColor: '#FFF' },
  { key: VoucherResponseStatusEnum.Rejected, label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: VoucherResponseStatusEnum.Pending, label: 'Chờ duyệt', color: '#FFFF00', textColor: '#000' },
]

const TransactionHistory = () => {
  const index_id = useId()
  const [transactionPage, setTransactionPage] = useState<string>('1')
  const [withdrawRequestPage, setWithdrawRequestPage] = useState<string>('1')
  const limit = '5'

  const { user } = useAuth()

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [idWithdrawReq, setIdWithdrawReq] = useState<string>('')

  const [transactionHistory, setTransactionHistory] = useState<BalanceHistoryPagingResponse | undefined>(undefined)
  const [windrawRequest, setWindrawRequest] = useState<any>(undefined)
  const [transactionHistoryArray, setTransactionHistoryArray] = useState<any[] | undefined>(undefined)
  const [withdrawRequestArray, setWithdrawRequestArray] = useState<any[] | undefined>(undefined)
  const [withdrawRequestIds, setWithdrawRequestIds] = useState<string[]>([])
  const [seriesCharts, setSeriesCharts] = useState<any[] | undefined>(undefined)

  const { isLoading: isTransactionHistoryLoading } = trpc.useQuery(
    ['identity.getHistoryTransaction', { page: transactionPage, limit }],
    {
      onSuccess(data) {
        setTransactionHistory(data.data)
      },
    },
  )
  const { isLoading: isWithdrawRequestLoading } = trpc.useQuery(
    ['identity.getWithdrawRequests', { limit, page: withdrawRequestPage }],
    {
      onSuccess(data) {
        setWindrawRequest(data.data)
      },
    },
  )
  const cancelWithdrawRequests = trpc.useMutation(['identity.cancelWithdrawRequests'])
  const utils = trpc.useContext()

  console.log(windrawRequest)

  useEffect(() => {
    const monthYearAmountMap = {}

    transactionHistory?.row?.map((transactionHistory) => {
      const updatedAt = new Date(transactionHistory.updatedAt ?? '')
      const monthYear = `${updatedAt.getFullYear()}-${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}`
      const amount = transactionHistory.amount

      if (monthYearAmountMap[monthYear]) {
        monthYearAmountMap[monthYear].push(amount)
      } else {
        monthYearAmountMap[monthYear] = [amount]
      }
    })

    const monthYearAmountArray = Object.keys(monthYearAmountMap).map((monthYear) => ({
      monthYear,
      amount: monthYearAmountMap[monthYear],
    }))

    setSeriesCharts(monthYearAmountArray)

    const transactionHistoryResultArray = transactionHistory?.row?.map((transactionHistory) => {
      const transactionArray = Object.values(transactionHistory)

      const newTransactionArray = [
        TransactionContent.find((transContent) => transContent.key == transactionArray[5])?.label,
        <div className="flex items-center justify-center gap-2" key={transactionHistory[0]}>
          {transactionArray[6]} <span className="text-xs italic"> đ</span>
        </div>,
        transactionArray[12]?.recipient?.name ?? user?.name,
        new Date(transactionArray[1]).toLocaleDateString('en-GB'),
        new Date(transactionArray[2]).toLocaleDateString('en-GB'),
      ]
      return newTransactionArray
    })
    setTransactionHistoryArray(transactionHistoryResultArray)
  }, [transactionHistory])

  useEffect(() => {
    const windrawRequestResultArray = windrawRequest?.row?.map((withdrawReq) => {
      const withdrawReqArray = Object.values(withdrawReq)
      setWithdrawRequestIds((prevWithdrawRequestId) => {
        const newWithdrawRequestId = [...prevWithdrawRequestId]
        newWithdrawRequestId.push(withdrawReqArray[0] as string)
        return newWithdrawRequestId
      })

      const newWithdrawArray = [
        (withdrawReqArray[14] as any).platform,
        (withdrawReqArray[14] as any).platformAccount,
        <span key={index_id} className="flex justify-center items-center gap-2">
          {((withdrawReqArray[5] ?? 0) as any).toLocaleString('en-US', {
            currency: 'VND',
          })}
          <p className="text-xs italic"> đ</p>
        </span>,
        <span key={index_id} className="flex justify-center items-center gap-2">
          {(withdrawReqArray[4] as any).toLocaleString('en-US', {
            currency: 'VND',
          })}
          <p className="text-xs italic"> VND</p>
        </span>,
        <div className="flex justify-center" key={index_id}>
          <p
            className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl`}
            style={{
              background: `${mappingStatus.find((statusType) => statusType.key == withdrawReqArray[9])?.color}`,
              color: `${mappingStatus.find((statusType) => statusType.key == withdrawReqArray[9])?.textColor}`,
            }}
          >
            {mappingStatus.find((statusType) => statusType.key == withdrawReqArray[9])?.label}
          </p>
        </div>,
        new Date(withdrawReqArray[1] as any).toLocaleDateString('en-GB'),
      ]
      return newWithdrawArray
    })
    setWithdrawRequestArray(windrawRequestResultArray)
  }, [windrawRequest])

  const handleViewWithdrawDetail = (id: string) => {
    console.log(id)
  }
  const handleCancelWithdrawDetail = (id: string) => {
    console.log(id)
    setIdWithdrawReq(id)
    setIsModalConfirmationVisible(true)
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Thay đổi thông tin cá nhân"
          description="Bạn có chấp nhận thay đổi thông tin cá nhân hay không?"
          onClose={handleClose}
          onOk={() => {
            cancelWithdrawRequests.mutate(idWithdrawReq, {
              onSuccess() {
                handleClose()
                utils.invalidateQueries(['identity.getWithdrawRequests'])
                notification.success({
                  message: 'Hủy yêu cầu rút tiền thành công',
                  description: 'Yêu cầu rút tiền của bạn đã được hủy',
                  placement: 'bottomLeft',
                })
              },
              onError() {
                notification.error({
                  message: 'Hủy yêu cầu rút tiền thất bại',
                  description: 'Hủy yêu cầu rút tiền thất bại. Vui lòng thử lại sau!',
                  placement: 'bottomLeft',
                })
              },
            })
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return (
    <>
      {isModalConfirmationVisible && confirmModal}
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Lịch sử giao dịch</p>

        <div className="flex flex-col gap-5 mt-10 space-y-10">
          {!isTransactionHistoryLoading && seriesCharts ? (
            <ColumnChart seriesCharts={seriesCharts} />
          ) : (
            <div className="w-full h-[350px] flex justify-center gap-10 mt-20 mb-10">
              <div className="w-full h-[350px] bg-gray-300 rounded-lg animate-pulse">
                <span className="w-full h-full" />
              </div>
            </div>
          )}

          {!isWithdrawRequestLoading && withdrawRequestArray ? (
            <>
              {user?.isVerified && (
                <div className="flex flex-col gap-3">
                  <p className="text-xl font-bold">Yêu cầu rút tiền</p>
                  <Table
                    dataHeader={['Nền tảng', 'Số tài khoản', 'Số tiền rút', 'Số tiền nhận', 'Trạng thái', 'Ngày tạo']}
                    dataBody={withdrawRequestArray as any}
                    page={withdrawRequestPage}
                    setPage={setWithdrawRequestPage}
                    limit={limit}
                    totalItem={Number(windrawRequest?.count ?? 0)}
                    contentItem={'yêu cầu'}
                    watchAction={true}
                    onWatch={(index) => handleViewWithdrawDetail(withdrawRequestIds[index ?? 0] ?? '')}
                    editAction={false}
                    onEdit={() => {}}
                    deleteAction={true}
                    onDelete={(index) => {
                      handleCancelWithdrawDetail(withdrawRequestIds[index ?? 0] ?? '')
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <TableSkeletonLoader />
          )}

          {!isTransactionHistoryLoading && transactionHistoryArray ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-bold">Chi tiết giao dịch</p>
              <Table
                dataHeader={['Loại', 'Số tiền', 'Người nhận', 'Ngày tạo giao dịch', 'Ngày hoàn thành']}
                dataBody={transactionHistoryArray}
                page={transactionPage}
                setPage={setTransactionPage}
                limit={limit}
                totalItem={Number(transactionHistory?.count ?? 0)}
                contentItem={'giao dịch'}
                watchAction={false}
                onWatch={() => {}}
                editAction={false}
                onEdit={() => {}}
                deleteAction={false}
                onDelete={() => {}}
              />
            </div>
          ) : (
            <TableSkeletonLoader />
          )}
        </div>
      </div>
    </>
  )
}
export default TransactionHistory
