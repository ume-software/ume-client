/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from '@headlessui/react'
import { Down, Time } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'
import coin from 'public/coin-icon.png'
import ImgForEmpty from 'public/img-for-empty.png'

import { Fragment, useEffect, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import {
  BookingProviderRequest,
  UserInformationResponse,
  VoucherPagingResponse,
  VoucherResponseDiscountUnitEnum,
} from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

const BookingProvider = (props: { data: UserInformationResponse }) => {
  const router = useRouter()
  const slug = router.query

  const voucherLimit = '10'
  const voucherPage = '1'
  const [myVoucher, setMyVoucher] = useState<VoucherPagingResponse | undefined>(undefined)
  trpc.useQuery(['identity.getMyVoucher', { limit: voucherLimit, page: voucherPage }], {
    onSuccess(data) {
      setMyVoucher(data.data)
    },
  })
  const [menuShow, setMenuShow] = useState<string>('')
  const accountBalance = trpc.useQuery(['identity.account-balance'])
  const createBooking = trpc.useMutation(['booking.createBooking'])

  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerServiceId:
      props.data?.providerServices?.find((dataChoose) => dataChoose.service?.slug == slug.service)?.id ?? '',
    bookingPeriod: 1,
    voucherIds: [],
  })

  const [total, setTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)

  const handleTotal = () => {
    const selectedItem = props.data.providerServices?.find((item) => booking.providerServiceId == item.id)
    const voucher = myVoucher?.row?.find((voucher) => voucher.code == booking?.voucherIds)
    const voucherValue =
      voucher?.discountUnit == VoucherResponseDiscountUnitEnum.Cash
        ? voucher.discountValue
        : VoucherResponseDiscountUnitEnum.Percent
        ? (voucher?.discountValue ?? 0) / 100
        : 0

    setTotal(selectedItem?.defaultCost ?? 0)

    setTotalAfterDiscount(
      voucher?.discountUnit == VoucherResponseDiscountUnitEnum.Cash
        ? (selectedItem?.defaultCost ?? 0) * booking.bookingPeriod * (voucherValue ?? 1)
        : VoucherResponseDiscountUnitEnum.Percent
        ? (selectedItem?.defaultCost ?? 0) * booking.bookingPeriod - (voucherValue ?? 0)
        : (selectedItem?.defaultCost ?? 0) * booking.bookingPeriod,
    )
  }
  useEffect(() => {
    handleTotal()
  }, [booking])

  useEffect(() => {
    setBooking((prevData) => ({
      ...prevData,
      providerServiceId:
        props.data?.providerServices?.find((dataChoose) => dataChoose.service?.slug === slug.service)?.id ?? '',
      voucherIds: myVoucher?.row && myVoucher?.row?.length > 0 ? [String(myVoucher.row[0].code)] : [],
    }))
  }, [props.data, slug.service, myVoucher?.row])

  const handleCreateBooking = (booking: BookingProviderRequest) => {
    // if (!props.data.isOnline ?? props.data.providerConfig?.status != ProviderConfigResponseStatusEnum.Activated) {
    //   notification.warning({
    //     message: 'Tài khoản chưa sẵn sàng',
    //     description: 'Tài khoản hiện chưa sẵn sàng lúc này. Vui lòng thử lại vào lúc khác!',
    //     placement: 'bottomLeft',
    //   })
    // } else
    if (accountBalance.data?.data.totalCoinsAvailable! >= total) {
      try {
        createBooking.mutate(booking, {
          onSuccess: (data) => {
            if (data.success) {
              setBooking({ providerServiceId: '', bookingPeriod: 1, voucherIds: [] })
              notification.success({
                message: 'Tạo đơn thành công',
                description: 'Đơn của bạn đã được tạo thành công.',
                placement: 'bottomLeft',
              })
            }
          },
          onError: (error) => {
            notification.warning({
              message: 'Tạo đơn thất bại',
              description: `${error.message}`,
              placement: 'bottomLeft',
            })
          },
        })
      } catch (error) {
        console.error('Failed to create booking:', error)
      }
    } else {
      notification.warning({
        message: 'Tài khoản không đủ',
        description: 'Bạn không có đủ tiền. Vui lòng nạp thêm!',
        placement: 'bottomLeft',
      })
    }
  }

  return (
    <div className="h-[85vh] p-10 pb-0 overflow-auto custom-scrollbar">
      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-10 border-b-2 border-[#B9B8CC] pb-5">
          <div className="col-span-4">
            <div className="relative w-[300px] h-[350px]">
              <Image
                className="absolute rounded-xl"
                layout="fill"
                objectFit="cover"
                src={props.data?.avatarUrl ?? ImgForEmpty}
                alt="Game Image"
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex flex-col gap-10">
              <p className="text-4xl font-bold ">{props.data?.name}</p>
              <div className={`flex flex-col gap-3`}>
                <label htmlFor="providerServiceId" className="text-xl font-medium ">
                  Chọn dịch vụ:
                </label>
                <div className="relative w-full">
                  <Menu>
                    <Menu.Button className={'w-full'}>
                      <button
                        className={`flex justify-between items-center gap-3 min-w-full text-lg font-semibold px-3 py-2 border border-white border-opacity-30 bg-zinc-800 hover:bg-gray-700 rounded-xl`}
                        type="button"
                        onClick={() => setMenuShow('Service')}
                      >
                        {props.data?.providerServices?.find((dataChoose) => dataChoose.id == booking.providerServiceId)
                          ?.service?.name ?? 'Chọn dịch vụ'}
                        <Down theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                      </button>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      show={menuShow == 'Service'}
                    >
                      <Menu.Items
                        className="absolute right-0 left-0 p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[300px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                        style={{ zIndex: 5 }}
                      >
                        <div
                          className="flex flex-col gap-2"
                          style={{ zIndex: 10 }}
                          onMouseLeave={() => setMenuShow('')}
                        >
                          {props.data?.providerServices?.map((data, index) => (
                            <div
                              className={`flex gap-5 items-center ${
                                data.id == booking.providerServiceId && 'bg-gray-500'
                              } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                              key={index}
                              onClick={() => {
                                setBooking((prevData) => ({ ...prevData, providerServiceId: data.id ?? '' }))
                                setMenuShow('')
                              }}
                            >
                              <p className="col-span-1 font-semibold text-md">{data.service?.name}</p>
                            </div>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div
                  className={`${booking.providerServiceId == '' && 'block'} hidden font-normal text-sm text-red-500`}
                >
                  *Chưa chọn dịch vụ
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="bookingPeriod" className="text-xl font-medium ">
                  Chọn thời gian:
                </label>
                <InputWithAffix
                  type="number"
                  position="left"
                  placeholder="Chọn thời gian"
                  className="!bg-zinc-800 w-fit rounded-xl border border-white border-opacity-30"
                  styleInput="bg-transparent border-transparent border-l-white border-opacity-30 hover:border-transparent hover:border-l-white hover:border-opacity-30 focus:outline-none"
                  min={1}
                  defaultValue={1}
                  value={booking.bookingPeriod}
                  onChange={(e) => {
                    setBooking((prevData) => ({
                      ...prevData,
                      bookingPeriod: Number(Number(e.target.value) > 0 ? e.target.value : 0),
                    }))
                  }}
                  component={<Time className="pr-2" theme="outline" size="15" fill="#FFF" strokeLinejoin="bevel" />}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10 pt-5 pb-5 place-items-start">
          <div className="col-span-2">
            <label htmlFor="bookingPeriod" className="text-2xl font-medium text-white opacity-40">
              Mã giảm giá:
            </label>
          </div>
          <div className="col-span-8">
            <div className="relative">
              <Menu>
                <Menu.Button>
                  <button
                    className={`flex justify-between items-center gap-3 min-w-[250px] text-lg font-semibold px-3 py-2 border border-white border-opacity-30 bg-zinc-800 hover:bg-gray-700 rounded-xl`}
                    type="button"
                    onClick={() => setMenuShow('Voucher')}
                  >
                    {myVoucher?.row && myVoucher?.row?.length > 0 ? myVoucher.row[0]?.code : <>Khuyến mãi</>}
                    <Down theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                  </button>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-400"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-400"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  show={menuShow == 'Voucher'}
                >
                  <Menu.Items
                    className="absolute right-0 left-0 p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[200px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                    style={{ zIndex: 5 }}
                  >
                    <div className="flex flex-col gap-2" style={{ zIndex: 10 }} onMouseLeave={() => setMenuShow('')}>
                      {myVoucher?.row && myVoucher?.row?.length > 0 ? (
                        myVoucher?.row?.map((data, index) => (
                          <div
                            className={`flex gap-5 items-center ${
                              booking.voucherIds?.[0] == data.code && 'bg-gray-500'
                            } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                            key={index}
                            onClick={() => {
                              setBooking((prevData) => ({
                                ...prevData,
                                voucherIds: Array.isArray(data.code) ? data.code : prevData.voucherIds,
                              }))
                              setMenuShow('Voucher')
                            }}
                          >
                            <div className="min-w-[500px] grid grid-cols-5 gap-5">
                              <p className="col-span-1 font-semibold text-md">{data.code}</p>
                              <p className="col-span-1 font-semibold text-md">
                                {data.discountValue} {data.discountUnit}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>Không có khuyến mãi dành cho bạn!</>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-b-2 border-[#B9B8CC] pb-5">
          <p className="text-3xl font-bold ">Thành tiền:</p>
          <div className="flex items-end gap-2">
            {total != totalAfterDiscount && (
              <span className="flex items-center text-xl font-bold line-through opacity-30">
                {booking.bookingPeriod}h giá {total} <Image src={coin} width={30} height={30} alt="coin" />
              </span>
            )}
            <p className="flex items-center text-3xl font-bold ">
              {booking.bookingPeriod}h giá {totalAfterDiscount} <Image src={coin} width={50} height={50} alt="coin" />
            </p>
          </div>
        </div>
        <button
          type="button"
          className={`py-2 mt-2 text-2xl font-bold text-center text-white ${
            !booking.providerServiceId ? 'border bg-zinc-800 cursor-not-allowed' : 'bg-purple-700 hover:scale-105'
          }  rounded-full `}
          onClick={() => handleCreateBooking(booking)}
        >
          Đặt
        </button>
      </div>
    </div>
  )
}
export default BookingProvider
