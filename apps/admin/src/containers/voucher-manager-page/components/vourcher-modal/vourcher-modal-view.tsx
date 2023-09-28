import { TextArea } from '@ume/ui'

import * as React from 'react'

import Image from 'next/legacy/image'

import anhURL from '../../../../../public/anh.jpg'

import ModalBase from '~/components/modal-base'

export interface IVourcherModalViewProps {
  closeFunction: any
  openValue: boolean
  vourcherId?: any
}

export default function VourcherModalView({ vourcherId, closeFunction, openValue }: IVourcherModalViewProps) {
  const titleValue = 'Thông Tin Khuyến Mãi'
  const avatarUrl = anhURL.src
  const name = 'ABC'
  const vourcherCode = ''
  const issuer = 'ABC'
  const approver = 'ABC'
  const status = 'ABC'
  const createAt = 'ABC'
  const endDate = 'ABC'

  const numVoucher = 'ABC'
  const numUserCanUse = 'ABC'
  const typeVoucher = 'ABC'
  const applyTime = 'ABC'

  const numVoucherInDay = 'ABC'
  const numUserCanUseInDay = 'ABC'
  const minimize = 'ABC'
  const audience = 'ABC'

  const description = 'ABC'
  const content = 'SOME THING WRONG'
  function closeHandle() {
    closeFunction()
  }
  return (
    <div>
      <ModalBase titleValue={titleValue} closeFunction={closeHandle} openValue={openValue} className="w-auto bg-black">
        <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="w-1/5 pr-4 mt-10">
              <Image className="overflow-hidden rounded-2xl" width={150} height={200} src={avatarUrl} alt="" />
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
                Loại: <span className="font-bold">{typeVoucher}</span>
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
                Đối tượng: <span className="font-bold">{audience}</span>
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="h-12 text-white">
                Mô tả: <span className="font-bold">{description}</span>
              </div>
              <div className="flex h-32 text-white">
                <span className="mr-4">Nội dung:</span>
                <TextArea className="bg-[#413F4D] w-4/5" rows={5} value={content} />
              </div>
            </div>
          </div>
        </div>
      </ModalBase>
    </div>
  )
}
