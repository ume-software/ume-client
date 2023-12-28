/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from '@headlessui/react'
import { Down, Minus, Plus, Right, Time } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { Fragment, useEffect, useState } from 'react'

import { Drawer, notification } from 'antd'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import {
  BookingProviderRequest,
  UserInformationResponse,
  VoucherPagingResponse,
  VoucherResponseDiscountUnitEnum,
} from 'ume-service-openapi'

import VoucherApply from './voucher-apply'

import { trpc } from '~/utils/trpc'

const BookingProvider = (props: { data: UserInformationResponse }) => {
  const router = useRouter()
  const slug = router.query

  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState<boolean>(false)
  const voucherLimit = '10'
  const voucherPage = '1'
  const [myVoucher, setMyVoucher] = useState<VoucherPagingResponse | undefined>(undefined)
  trpc.useQuery(
    [
      'booking.getMyVoucherForBooking',
      { providerSlug: String(slug.profileId ?? ''), limit: voucherLimit, page: voucherPage },
    ],
    {
      onSuccess(data) {
        setMyVoucher(data.data)
      },
    },
  )

  const [menuShow, setMenuShow] = useState<string>('')
  const accountBalance = trpc.useQuery(['identity.account-balance'])
  const createBooking = trpc.useMutation(['booking.createBooking'])
  const utils = trpc.useContext()

  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerServiceId:
      props.data?.providerServices?.find((dataChoose) => dataChoose.service?.slug == slug.service)?.id ?? '',
    bookingPeriod: 1,
    voucherIds: [],
  })

  const [total, setTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)

  const isSpecialTime = (startTimeOfDay: string | undefined, endTimeOfDay: string | undefined) => {
    if (startTimeOfDay && endTimeOfDay) {
      const currentTime = new Date()
      const currentHours = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()

      const [startHours, startMinutes] = startTimeOfDay.split(':').map(Number)
      const [endHours, endMinutes] = endTimeOfDay.split(':').map(Number)

      return (
        (startHours > endHours &&
          (currentHours > startHours ||
            (currentHours === startHours && currentMinutes >= startMinutes) ||
            currentHours < endHours ||
            (currentHours === endHours && currentMinutes <= endMinutes))) ||
        (startHours < endHours &&
          (currentHours > startHours || (currentHours === startHours && currentMinutes >= startMinutes)) &&
          (currentHours < endHours || (currentHours === endHours && currentMinutes <= endMinutes)))
      )
    }
    return false
  }

  const handleTotal = () => {
    const selectedItem = props.data.providerServices?.find((item) => booking.providerServiceId == item.id)
    const selectedItemPrice =
      selectedItem?.bookingCosts?.find((spectialTime) => {
        if (isSpecialTime(spectialTime?.startTimeOfDay, spectialTime?.endTimeOfDay)) {
          return spectialTime
        }
      })?.amount ?? selectedItem?.defaultCost
    const voucher = myVoucher?.row?.find((voucher) => voucher.code == booking?.voucherIds)
    const voucherValue =
      voucher?.discountUnit == VoucherResponseDiscountUnitEnum.Cash
        ? voucher.discountValue
        : VoucherResponseDiscountUnitEnum.Percent
        ? ((selectedItemPrice ?? 0) * booking.bookingPeriod * (voucher?.discountValue ?? 0)) / 100
        : 0

    setTotal((selectedItemPrice ?? 0) * booking.bookingPeriod)

    setTotalAfterDiscount(
      voucher?.discountUnit == VoucherResponseDiscountUnitEnum.Cash
        ? (selectedItemPrice ?? 0) * booking.bookingPeriod > (voucherValue ?? 1)
          ? (selectedItemPrice ?? 0) * booking.bookingPeriod - (voucherValue ?? 1)
          : 0
        : VoucherResponseDiscountUnitEnum.Percent
        ? (selectedItemPrice ?? 0) * booking.bookingPeriod - (voucherValue ?? 0)
        : (selectedItemPrice ?? 0) * booking.bookingPeriod,
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
      voucherIds:
        myVoucher?.row && myVoucher?.row?.length > 0
          ? [
              String(
                myVoucher.row?.find(
                  (voucherDetail) =>
                    booking.bookingPeriod >= (voucherDetail?.minimumBookingDurationForUsage ?? 0) &&
                    total >= (voucherDetail?.minimumBookingTotalPriceForUsage ?? 0),
                )?.code ?? '',
              ),
            ]
          : [],
    }))
  }, [props.data, slug.service, myVoucher?.row])

  const handleCreateBooking = (booking: BookingProviderRequest) => {
    if (accountBalance.data?.data.totalBalanceAvailable! >= totalAfterDiscount) {
      try {
        createBooking.mutate(booking, {
          onSuccess: (data) => {
            if (data.success) {
              setBooking({ providerServiceId: '', bookingPeriod: 1, voucherIds: [] })
              utils.invalidateQueries('identity.account-balance')
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
    <>
      <div className="h-[85vh] p-10 pb-1 overflow-auto custom-scrollbar">
        <div className="h-full flex flex-col justify-between">
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
                          {props.data?.providerServices?.find(
                            (dataChoose) => dataChoose.id == booking.providerServiceId,
                          )?.service?.name ?? 'Chọn dịch vụ'}
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
                                onKeyDown={() => {}}
                              >
                                <p className="col-span-1 text-md font-semibold">{data.service?.name}</p>
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
                  <div className="flex items-center gap-3">
                    <InputWithAffix
                      type="number"
                      position="left"
                      placeholder="Chọn thời gian"
                      className="!bg-zinc-800 w-fit rounded-xl border border-white border-opacity-30"
                      styleInput="bg-transparent border-transparent border-l-white border-opacity-30 hover:border-transparent hover:border-l-white hover:border-opacity-30 focus:outline-none"
                      min={1}
                      defaultValue={1}
                      value={booking.bookingPeriod}
                      readOnly
                      component={<Time className="pr-2" theme="outline" size="15" fill="#FFF" strokeLinejoin="bevel" />}
                    />

                    <div
                      className={`p-2 bg-zinc-800 rounded-lg ${
                        booking.bookingPeriod == 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        booking.bookingPeriod > 1 &&
                          setBooking((prevData) => ({
                            ...prevData,
                            bookingPeriod: booking.bookingPeriod - 1,
                          }))
                      }}
                      onKeyDown={() => {}}
                    >
                      <Minus theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                    </div>
                    <div
                      className={`p-2 bg-zinc-800 rounded-lg ${
                        booking.bookingPeriod == 12 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        booking.bookingPeriod < 12 &&
                          setBooking((prevData) => ({
                            ...prevData,
                            bookingPeriod: booking.bookingPeriod + 1,
                          }))
                      }}
                      onKeyDown={() => {}}
                    >
                      <Plus theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-10 place-items-start pt-5 pb-5">
            <div className="col-span-2">
              <label htmlFor="bookingPeriod" className="text-2xl font-medium text-white">
                Mã giảm giá:
              </label>
            </div>
            <div className="col-span-8">
              <div className="cursor-pointer" onClick={() => setIsModalVoucherOpen(true)} onKeyDown={() => {}}>
                <InputWithAffix
                  type="text"
                  position="right"
                  placeholder="Chọn khuyến mãi"
                  className="!bg-zinc-800 w-fit rounded-xl border border-white border-opacity-30"
                  styleInput="bg-transparent border-transparent border-l-white border-opacity-30 hover:border-transparent hover:border-l-white hover:border-opacity-30 focus:outline-none"
                  value={booking.voucherIds}
                  readOnly
                  component={<Right theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
                />
              </div>
            </div>
            <div className="max-w-[200px]">
              <Drawer
                title={<p className="text-white text-xl font-bold">Khuyến mãi</p>}
                width={320}
                closable={false}
                onClose={() => setIsModalVoucherOpen(false)}
                open={isModalVoucherOpen}
              >
                <VoucherApply
                  isModalVoucherOpen={isModalVoucherOpen}
                  setIsModalVoucherOpen={setIsModalVoucherOpen}
                  voucherSelected={booking.voucherIds}
                  setVoucherSelected={setBooking}
                  data={myVoucher}
                  duration={booking.bookingPeriod}
                  price={total}
                />
              </Drawer>
            </div>
          </div>

          <div className="flex justify-between border-b-2 border-[#B9B8CC] pb-5">
            <p className="text-3xl font-bold ">Thành tiền:</p>
            {booking.providerServiceId && (
              <div className="flex items-end gap-2">
                {total != totalAfterDiscount && (
                  <span className="flex items-center text-xl font-bold line-through opacity-30">
                    {booking.bookingPeriod}h giá{' '}
                    {total.toLocaleString('en-US', {
                      currency: 'VND',
                    })}{' '}
                    <span className="text-xs italic"> đ</span>
                  </span>
                )}
                <p className="flex items-center text-3xl font-bold ">
                  {booking.bookingPeriod}h giá{' '}
                  {totalAfterDiscount.toLocaleString('en-US', {
                    currency: 'VND',
                  })}
                  đ
                </p>
              </div>
            )}
          </div>
          {createBooking.isLoading && (
            <span
              className={`spinner h-3 w-3 animate-spin rounded-full border-[3px] border-r-transparent border-white`}
            />
          )}
          <button
            type="button"
            className={`w-full h-fit py-2 mt-2 text-2xl font-bold text-white ${
              !booking.providerServiceId ? 'border bg-zinc-800 cursor-not-allowed' : 'bg-purple-700 hover:scale-105'
            }  rounded-full `}
            onClick={() => {
              if (booking.providerServiceId) handleCreateBooking(booking)
            }}
          >
            Đặt
          </button>
        </div>
      </div>
    </>
  )
}
export default BookingProvider
