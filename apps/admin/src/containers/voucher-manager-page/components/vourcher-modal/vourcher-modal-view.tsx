import { Button, TextArea } from '@ume/ui'

import { useState } from 'react'

import Image from 'next/legacy/image'
import { prismaSelectToJsonString } from 'query-string-prisma-ume'
import { VoucherResponse } from 'ume-service-openapi'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

export interface IVourcherModalViewProps {
  closeFunction: any
  openValue: boolean
  vourcherId: any
}

const mappingRecipientType = {
  ALL: 'Tất cả',
  FIRST_TIME_BOOKING: 'Người lần đầu thuê',
  PREVIOUS_BOOKING: ' Người đã từng thuê',
  TOP_5_BOOKER: ' Top 5 người thuê',
  TOP_10_BOOKER: ' Top 10 người thuê',
  SELECTIVE_BOOKER: 'Người đặt chọn',
}

const mappingType = {
  DISCOUNT: 'Giảm giá',
  CASHBACK: 'Hoàn tiền',
}

export default function VourcherModalView({ vourcherId, closeFunction, openValue }: IVourcherModalViewProps) {
  const [voucherDetails, setVoucherDetails] = useState<any>()
  const SELECT = [
    '$all',
    {
      admin: ['$all'],
      provider: ['$all'],
    },
  ]
  const { isLoading, isFetching } = trpc.useQuery(
    ['voucher.getVoucherDetails', { id: vourcherId, select: JSON.stringify(SELECT) }],
    {
      onSuccess(data) {
        setVoucherDetails(data.data)
      },
    },
  )
  console.log(voucherDetails)
  const titleValue = 'Thông Tin Khuyến Mãi'
  const avatarUrl = voucherDetails?.image || ''
  const name = voucherDetails?.name || ''
  const vourcherCode = voucherDetails?.code || ''
  const issuer = voucherDetails?.provider?.name || voucherDetails?.admin?.name
  const approver = voucherDetails?.admin?.name || ''
  const status = voucherDetails?.status || ''
  const createAt = voucherDetails?.createdAt || ''
  const endDate = voucherDetails?.endDate || ''
  const numVoucher = voucherDetails?.numberIssued || ''
  const numUserCanUse = voucherDetails?.numberUsablePerBooker || ''
  const typeVoucher = voucherDetails?.type || ''
  const applyTime = voucherDetails?.applyISODayOfWeek || ''
  const numVoucherInDay = voucherDetails?.dailyNumberIssued || ''
  const numUserCanUseInDay = voucherDetails?.dailyUsageLimitPerBooker || ''
  const minimize = voucherDetails?.discountValue || ''
  const audience = voucherDetails?.recipientType || ''

  const description = voucherDetails?.description
  function closeHandle() {
    closeFunction()
  }
  return (
    <div>
      <ModalBase titleValue={titleValue} closeFunction={closeHandle} openValue={openValue} className="w-auto bg-black">
        <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="w-1/5 pr-4 mt-10">
              <Image className="overflow-hidden rounded-2xl" width={150} height={200} src={avatarUrl!} alt="" />
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-24 text-white">
                Tên: <span className="font-bold">{name}</span>
                <div className="h-12 text-[#FFFFFF80]">
                  Mã: <span className="font-bold">{vourcherCode}</span>
                </div>
              </div>

              <div className="h-12 text-white">
                Người phát hành: <span className="font-bold">{issuer}</span>
              </div>
              <div className="h-12 text-white">
                Người duyệt: <span className="font-bold">{approver}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Trạng thái: <span className="font-bold">{status}</span>
              </div>
              <div className="h-12 text-white">
                Ngày phát hành: <span className="font-bold">{createAt}</span>
              </div>
              <div className="h-12 text-white">
                Ngày kết thúc: <span className="font-bold">{endDate}</span>
              </div>
            </div>
          </div>

          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end w-3/5 mt-5">
              <div className="h-12 text-white">
                Số lượng phát hành: <span className="font-bold">{numVoucher}</span>
              </div>

              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng: <span className="font-bold">{numUserCanUse}</span>
              </div>
              <div className="h-12 text-white">
                Loại: <span className="font-bold">{typeVoucher && mappingType[typeVoucher]}</span>
              </div>
              <div className="h-12 text-white">
                Thời gian áp dụng trong tuần: <span className="font-bold">{applyTime}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Số lượng phát hành mỗi ngày: <span className="font-bold">{numVoucherInDay}</span>
              </div>
              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng trong ngày:{' '}
                <span className="font-bold">{numUserCanUseInDay}</span>
              </div>
              <div className="h-12 text-white">
                Giảm tối đa: <span className="font-bold">{minimize}</span>
              </div>
              <div className="h-12 text-white">
                Đối tượng: <span className="font-bold">{audience && mappingRecipientType[audience]}</span>
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="flex h-32 text-white">
                <span className="w-16 mr-4">Mô tả: </span>
                <TextArea name="description" className="bg-[#413F4D] w-4/5" rows={5} value={description} />
              </div>
            </div>
          </div>
          {status == 'PENDING' && (
            <div className="w-full flex justify-evenly items-center my-4">
              <Button customCSS="py-1 px-2 bg-green-600"> Duyệt </Button>
              <Button customCSS="py-1 px-2 bg-red-600"> Từ chối </Button>
            </div>
          )}
        </div>
      </ModalBase>
    </div>
  )
}
