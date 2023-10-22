import { Button, TextArea } from '@ume/ui'
import coinIcon from 'public/coin-icon.png'
import empty_img from 'public/empty_error.png'

import { useState } from 'react'

import { Select, Space } from 'antd'
import Image from 'next/legacy/image'
import { prismaSelectToJsonString } from 'query-string-prisma-ume'
import { CreateVoucherRequestDiscountUnitEnum, VoucherResponse } from 'ume-service-openapi'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

export interface IVourcherModalViewProps {
  closeFunction: any
  openValue: boolean
  vourcherId: any
}
const { Option } = Select

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
  const { isLoading } = trpc.useQuery(
    ['voucher.getVoucherDetails', { id: vourcherId, select: JSON.stringify(SELECT) }],
    {
      onSuccess(data) {
        setVoucherDetails(data.data)
      },
    },
  )
  const titleValue = 'Thông Tin Khuyến Mãi'
  const avatarUrl = voucherDetails?.image || empty_img
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
  const description = voucherDetails?.description || ''
  const minimumBookingDurationForUsageInit = voucherDetails?.minimumBookingDurationForUsage ?? 0
  const minimumBookingTotalPriceForUsageInit = voucherDetails?.minimumBookingTotalPriceForUsage ?? 0
  const maximumDiscountValueInit = voucherDetails?.maximumDiscountValue ?? 0
  const discountUnitInit = voucherDetails?.discountUnit
  function closeHandle() {
    closeFunction()
  }
  return (
    <div>
      <ModalBase titleValue={titleValue} closeFunction={closeHandle} openValue={openValue} className="w-auto bg-black">
        <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="w-1/5 pr-4 mt-10">
              <Image
                className="overflow-hidden rounded-2xl"
                width={150}
                height={200}
                src={avatarUrl!}
                alt=""
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="text-white h-14">
                Tên: <span className="font-bold">{name}</span>
              </div>
              <div className="h-12 text-[#FFFFFF80]">
                Mã: <span className="font-bold">{vourcherCode}</span>
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
                Ngày phát hành: <span className="font-bold">{new Date(createAt).toLocaleDateString('en-GB')}</span>
              </div>
              <div className="h-12 text-white">
                Ngày kết thúc: <span className="font-bold">{new Date(endDate).toLocaleDateString('en-GB')}</span>
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
                Thời gian áp dụng trong tuần:
                <Select
                  mode="multiple"
                  placeholder="Chọn ngày"
                  value={applyTime}
                  optionLabelProp="label"
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  open={false}
                >
                  <Option value={1} label="T2">
                    <Space>
                      <span role="img" aria-label="T2">
                        T2
                      </span>
                      Thứ 2
                    </Space>
                  </Option>
                  <Option value={2} label="T3">
                    <Space>
                      <span role="img" aria-label="T3">
                        T3
                      </span>
                      Thứ 3
                    </Space>
                  </Option>
                  <Option value={3} label="T4">
                    <Space>
                      <span role="img" aria-label="T4">
                        T4
                      </span>
                      Thứ 4
                    </Space>
                  </Option>
                  <Option value={4} label="T5">
                    <Space>
                      <span role="img" aria-label="T5">
                        T5
                      </span>
                      Thứ 5
                    </Space>
                  </Option>
                  <Option value={5} label="T6">
                    <Space>
                      <span role="img" aria-label="T6">
                        T6
                      </span>
                      Thứ 6
                    </Space>
                  </Option>
                  <Option value={6} label="T7">
                    <Space>
                      <span role="img" aria-label="T7">
                        T7
                      </span>
                      Thứ 7
                    </Space>
                  </Option>
                  <Option value={7} label="CN">
                    <Space>
                      <span role="img" aria-label="CN">
                        CN
                      </span>
                      Chủ Nhật
                    </Space>
                  </Option>
                </Select>
              </div>
              <div className="flex h-12 text-white">
                <div className="flex items-center">
                  {'Khuyến mãi dùng cho hóa đơn có xu tối thiểu:'}
                  <span className="ml-2">{minimumBookingTotalPriceForUsageInit} </span>
                  <Image className="" alt="Xu" src={coinIcon} width={24} height={24} />
                </div>
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
              <div className="flex items-baseline h-12 text-white">
                <span className="h-8">Giảm :</span>
                <div className="inline-block w-2/12 ml-1 font-bold">{minimize}</div>
                {discountUnitInit == CreateVoucherRequestDiscountUnitEnum.Percent && (
                  <div className="flex items-center justify-end w-8/12">
                    <span className="">Giảm Tối Đa:</span>
                    <div className="inline-block w-3/12 ml-1 mr-1">{maximumDiscountValueInit} Xu</div>
                  </div>
                )}
              </div>
              <div className="h-12 text-white">
                Đối tượng: <span className="font-bold">{audience && mappingRecipientType[audience]}</span>
              </div>
              <div className="flex h-12 text-white">
                <div className="flex items-center">
                  {'Khuyến mãi dùng cho hóa đơn có giờ tối thiểu: '}
                  <span className="ml-2">{minimumBookingDurationForUsageInit} h</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="flex h-32 text-white">
                <span className="w-16 mr-4">Mô tả: </span>
                <TextArea
                  name="description"
                  className="bg-[#413F4D] w-4/5 max-h-[140px]"
                  rows={5}
                  value={description}
                />
              </div>
            </div>
          </div>
          {status == 'PENDING' && (
            <div className="flex items-center w-full my-4 justify-evenly">
              <Button customCSS="py-1 px-2 "> Từ chối </Button>
              <Button customCSS="py-1 px-2 bg-[#7463f0]"> Chấp nhận </Button>
            </div>
          )}
        </div>
        <div className="flex justify-center pb-4 mt-6">
          <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={closeHandle}>
            Đóng
          </Button>
        </div>
      </ModalBase>
    </div>
  )
}
