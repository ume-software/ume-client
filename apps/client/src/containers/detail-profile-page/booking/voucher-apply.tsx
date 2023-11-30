import ImgForEmpty from 'public/img-for-empty.png'

import { Dispatch, SetStateAction } from 'react'

import Image from 'next/legacy/image'
import { BookingProviderRequest, VoucherPagingResponse, VoucherResponseDiscountUnitEnum } from 'ume-service-openapi'

const VoucherApply = (props: {
  setIsModalVoucherOpen: Dispatch<SetStateAction<boolean>>
  voucherSelected: string[] | undefined
  setVoucherSelected: Dispatch<SetStateAction<BookingProviderRequest>>
  data: VoucherPagingResponse | undefined
}) => {
  return (
    <>
      <div className="h-[80vh]">
        <div className="grid grid-cols-6 mt-5 mx-3 overflow-y-auto">
          {props.data?.row?.map((voucher) => (
            <div
              key={voucher.id}
              className="col-span-3 m-3"
              onClick={() => {
                props.setVoucherSelected((prevData) => ({
                  ...prevData,
                  voucherIds: [String(voucher.code)] ?? [],
                }))
              }}
              onKeyDown={() => {}}
            >
              <div
                className={`flex border-2 gap-3 ${
                  props.voucherSelected?.find((voucherSelec) => voucherSelec == voucher.code)
                    ? 'border-purple-600'
                    : 'border-white border-opacity-30'
                }  rounded-2xl`}
              >
                <div className="relative min-w-[100px] min-h-[150px] max-w-[100px] max-h-[150px]">
                  <Image
                    className="absolute rounded-xl"
                    layout="fill"
                    objectFit="cover"
                    src={voucher.image ?? ImgForEmpty}
                    alt="Game Image"
                  />
                </div>
                <div className="w-full flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">{voucher.name}</p>
                      <p className="text-xs opacity-30">{voucher.code}</p>
                    </div>
                    <div>
                      <span className="text-md font-bold opacity-50">
                        {voucher.discountValue}
                        {voucher.discountUnit == VoucherResponseDiscountUnitEnum.Percent ? '%' : 'đ'}
                      </span>
                    </div>
                  </div>
                  <p className="w-full text-md overflow-hidden line-clamp-2">{voucher.description}</p>

                  <p className="text-md font-semibold opacity-30">Ngày hết hạn: {voucher.endDate?.split('T')[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button
          className="w-[90%] text-xl font-bold bg-purple-600 rounded-3xl p-3 hover:scale-105"
          type="button"
          onClick={() => {
            props.setIsModalVoucherOpen(false)
          }}
        >
          Đóng
        </button>
      </div>
    </>
  )
}
export default VoucherApply
