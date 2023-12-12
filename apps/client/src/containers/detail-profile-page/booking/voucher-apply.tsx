import ImgForEmpty from 'public/img-for-empty.png'

import { Dispatch, SetStateAction } from 'react'

import Image from 'next/legacy/image'
import { BookingProviderRequest, VoucherPagingResponse, VoucherResponseDiscountUnitEnum } from 'ume-service-openapi'

const VoucherApply = (props: {
  setIsModalVoucherOpen: Dispatch<SetStateAction<boolean>>
  voucherSelected: string[] | undefined
  setVoucherSelected: Dispatch<SetStateAction<BookingProviderRequest>>
  data: VoucherPagingResponse | undefined
  duration: number
  price: number
}) => {
  return (
    <>
      {(props.data?.row?.length ?? 0) > 0 ? (
        <>
          <div className="h-[80vh]">
            <div className="grid grid-cols-6 mt-5 mx-3 overflow-y-auto">
              {props.data?.row?.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`${
                    !(
                      props.duration >= (voucher?.minimumBookingDurationForUsage ?? 0) &&
                      props.price >= (voucher?.minimumBookingTotalPriceForUsage ?? 0)
                    ) && 'opacity-30'
                  } col-span-3 m-3`}
                  onClick={() => {
                    if (
                      props.duration >= (voucher?.minimumBookingDurationForUsage ?? 0) &&
                      props.price >= (voucher?.minimumBookingTotalPriceForUsage ?? 0)
                    ) {
                      props.setVoucherSelected((prevData) => ({
                        ...prevData,
                        voucherIds: [String(voucher.code)] ?? [],
                      }))
                    }
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
                      <div className="flex items-center gap-2">
                        {(Number(voucher?.minimumBookingDurationForUsage ?? 0) > 0 ||
                          Number(voucher?.minimumBookingTotalPriceForUsage ?? 0) > 0) && (
                          <p className="text-md font-semibold opacity-30">Tối thiểu: </p>
                        )}

                        {Number(voucher?.minimumBookingDurationForUsage ?? 0) > 0 && (
                          <p className="text-md font-semibold">{voucher?.minimumBookingDurationForUsage}h </p>
                        )}
                        {Number(voucher?.minimumBookingDurationForUsage ?? 0) > 0 &&
                          Number(voucher?.minimumBookingTotalPriceForUsage ?? 0) > 0 && (
                            <p className="text-md font-semibold">&</p>
                          )}
                        {Number(voucher?.minimumBookingTotalPriceForUsage ?? 0) > 0 && (
                          <p className="text-md font-semibold">
                            {voucher?.minimumBookingTotalPriceForUsage?.toLocaleString()}đ
                          </p>
                        )}
                      </div>
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
      ) : (
        <div className="mt-10 text-center col-span-full">
          <p className="text-3xl font-bold">Chưa có khuyến mãi nào phù hợp với bạn</p>
        </div>
      )}
    </>
  )
}
export default VoucherApply
