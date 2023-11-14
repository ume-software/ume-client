import coinIcon from 'public/coin-icon.png'
import EmptyErrorPic from 'public/empty_error.png'

import * as React from 'react'

import Image from 'next/legacy/image'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

export interface IViewDepositDetailProps {
  closeFunction: any
  openValue: boolean
  requestId: any
}

export default function ViewDepositDetail({ requestId, openValue, closeFunction }: IViewDepositDetailProps) {
  const SELECT = [
    '$all',
    {
      requester: ['$all'],
    },
  ]
  const [depositDetail, setDepositDetail] = React.useState<any | undefined>()
  trpc.useQuery(
    [
      'transaction.getDepositDetail',
      {
        id: requestId,
        select: JSON.stringify(SELECT),
      },
    ],
    {
      onSuccess(data) {
        setDepositDetail(data.data)
      },
    },
  )
  const avatarUrl = depositDetail?.requester?.avatarUrl
  const name = depositDetail?.requester?.name
  const username = depositDetail?.requester?.username
  const email = depositDetail?.requester?.email
  const phone = depositDetail?.requester?.phone

  const transactionCode = depositDetail?.transactionCode
  const platform = depositDetail?.platform
  const amountMoney = depositDetail?.amountMoney
  const unitCurrency = depositDetail?.unitCurrency
  const amountBalance = depositDetail?.amountBalance
  const createdAt = new Date(depositDetail?.createdAt).toLocaleDateString('en-GB') || ''
  const status = depositDetail?.status
  const mappingDepositStatus = {
    INIT: 'Đang chờ',
    APPROVED: 'Thành công',
    REJECTED: 'Thất bại',
  }
  function formatNumberWithCommas(number) {
    return parseFloat(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <ModalBase
      titleValue="Chi tiết giao dịch"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <div className="flex-col w-auto bg-[#15151B] mt-5 px-4 pb-4">
        <div className="bg-[#15151B] pt-4 pb-2 mx-4">
          <div className="text-left text-white border-b-2 border-[#FFFFFF80] border-solid text-2xl border-opacity-30">
            {'Người chuyển'}
          </div>
          <div className="flex w-auto py-4 ">
            <div className="pr-4 rounded-full">
              <Image
                className="rounded-full"
                src={avatarUrl || EmptyErrorPic}
                width={150}
                height={150}
                alt="User Avatar"
              />
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Tên: <span className="font-bold">{name}</span>
              </div>
              <div className="h-12 text-white">
                Tên người dùng: <span className="font-bold">{username}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Gmail: <span className="font-bold">{email}</span>
              </div>
              <div className="h-12 text-white">
                Số Điện Thoại: <span className="font-bold">{phone}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#15151B] pt-4 pb-2 mx-4">
          <div className="text-left text-white border-b-2 border-[#FFFFFF80] border-solid text-2xl border-opacity-30">
            {'Thông tin chi tiết'}
          </div>
          <div className="flex w-auto py-4 ">
            <div className="flex flex-col justify-end w-3/6 ">
              <div className="h-12 text-white">
                Mã giao dịch: <span className="font-bold">{transactionCode}</span>
              </div>
              <div className="h-12 text-white">
                Ngày tạo giao dịch: <span className="font-bold">{createdAt}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/6 ">
              <div className="h-12 text-white">
                Số tiền nạp:
                <span className="ml-2 font-bold">
                  {formatNumberWithCommas(amountMoney)}
                  <span className="text-xs italic"> đ</span>
                </span>
              </div>
              <div className="flex items-center h-12 text-white">
                Số tiền nhận:<span className="ml-2 font-bold">{formatNumberWithCommas(amountBalance)}</span>
                <span className="text-xs italic"> đ</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-1/6 ">
              <div className="h-12 text-white">
                Nền tảng: <span className="font-bold">{platform}</span>
              </div>
              <div className="h-12 text-white">
                Trạng thái: <span className="font-bold">{mappingDepositStatus[status]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  )
}
