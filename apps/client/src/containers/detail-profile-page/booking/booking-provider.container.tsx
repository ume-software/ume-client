import { Menu, Transition } from '@headlessui/react'
import { Time } from '@icon-park/react'
import { Down } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { Fragment, useState } from 'react'

import { InputNumber, Select, notification } from 'antd'
import { ErrorMessage, Form, Formik } from 'formik'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import {
  BookingProviderRequest,
  ProviderConfigResponseStatusEnum,
  UserInformationResponse,
  VoucherPagingResponse,
  VoucherResponseDiscountUnitEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

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
  const accountBalance = trpc.useQuery(['identity.account-balance'])
  const createBooking = trpc.useMutation(['booking.createBooking'])

  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerServiceId:
      props.data?.providerServices?.find((dataChoose) => dataChoose.service?.slug == slug.service)?.serviceId || '',
    bookingPeriod: 1,
    voucherIds: [],
  })
  const [total, setTotal] = useState(0)

  const handleTotal = (providerServiceId, bookingPeriod, voucherIds) => {
    const selectedItem = props.data.providerServices?.find((item) => providerServiceId == item.id)
    const voucher = myVoucher?.row?.find((voucher) => voucher.code == voucherIds)
    const voucherValue =
      voucher?.discountUnit == VoucherResponseDiscountUnitEnum.Cash
        ? voucher.discountValue
        : (voucher?.discountValue || 0) / 100

    setTotal(
      voucherValue! < 0
        ? (selectedItem?.defaultCost || 0) * bookingPeriod * (voucherValue || 0)
        : (selectedItem?.defaultCost || 0) * bookingPeriod - (voucherValue || 0),
    )
  }

  const validationSchema = Yup.object().shape({
    providerServiceId: Yup.string().required('*Chưa chọn dịch vụ'),
  })

  const handleCreateBooking = (values, { setSubmitting }) => {
    if (!props.data.isOnline || props.data.providerConfig?.status != ProviderConfigResponseStatusEnum.Activated) {
      notification.warning({
        message: 'Tài khoản chưa sẵn sàng',
        description: 'Tài khoản hiện chưa sẵn sàng lúc này. Vui lòng thử lại vào lúc khác!',
        placement: 'bottomLeft',
      })
    } else if (accountBalance.data?.data.totalCoinsAvailable! >= total) {
      try {
        createBooking.mutate(values, {
          onSuccess: (data) => {
            if (data.success) {
              setSubmitting(false)
              setBooking({ providerServiceId: '', bookingPeriod: 1, voucherIds: [] })
              notification.success({
                message: 'Tạo đơn thành công',
                description: 'Đơn của bạn đã được tạo thành công.',
                placement: 'bottomLeft',
              })
            }
          },
          onError: (error) => {
            console.error(error)
            setSubmitting(false)
            notification.error({
              message: 'Tạo đơn thất bại',
              description: 'Đơn của bạn chưa được tạo thành công!',
              placement: 'bottomLeft',
            })
          },
        })
      } catch (error) {
        console.error('Failed to create booking:', error)
        setSubmitting(false)
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
      <div className="h-[90vh] p-10 overflow-auto">
        <Formik initialValues={booking} validationSchema={validationSchema} onSubmit={handleCreateBooking}>
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form>
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-10 border-b-2 border-[#B9B8CC] pb-5">
                  <div className="col-span-4">
                    <div className="relative w-[300px] h-[350px]">
                      <Image
                        className="absolute rounded-xl"
                        layout="fill"
                        objectFit="cover"
                        src={props.data?.avatarUrl || ImgForEmpty}
                        alt="Game Image"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="flex flex-col gap-10">
                      <p className="text-4xl font-bold ">{props.data?.name}</p>
                      <div className={`flex flex-col gap-3`}>
                        <label htmlFor="providerServiceId" className="text-2xl font-medium ">
                          Chọn dịch vụ
                        </label>
                        <div className="relative w-full">
                          <Menu>
                            <Menu.Button className={'w-full'}>
                              <button
                                className={`flex justify-between items-center gap-3 min-w-full text-lg font-semibold px-3 py-2 border border-white border-opacity-30 bg-zinc-800 hover:bg-gray-700 rounded-xl`}
                                type="button"
                              >
                                {
                                  props.data?.providerServices?.find(
                                    (dataChoose) => dataChoose.serviceId == values.providerServiceId,
                                  )?.service?.name
                                }
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
                            >
                              <Menu.Items
                                className="absolute right-0 left-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[300px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                                style={{ zIndex: 5 }}
                              >
                                <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                  {props.data?.providerServices?.map((data, index) => (
                                    <div
                                      className={`flex gap-5 items-center ${
                                        data.serviceId == values.providerServiceId && 'bg-gray-500'
                                      } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                      key={index}
                                      onClick={() => {
                                        setFieldValue('providerServiceId', data.serviceId)
                                        handleTotal(values.providerServiceId, values.bookingPeriod, values.voucherIds)
                                      }}
                                    >
                                      <p className="col-span-1 text-md font-semibold">{data.service?.name}</p>
                                    </div>
                                  ))}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                        <ErrorMessage name="providerServiceId">
                          {(errorMessage) => <div className="font-normal  text-sm text-red-500">{errorMessage}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label htmlFor="bookingPeriod" className="text-2xl font-medium ">
                          Chọn thời gian
                        </label>
                        <InputWithAffix
                          type="number"
                          position="left"
                          placeholder="Chọn thời gian"
                          className="!bg-zinc-800 w-fit rounded-xl border border-white border-opacity-30"
                          styleInput="bg-transparent border-transparent border-l-white border-opacity-30 hover:border-transparent hover:border-l-white hover:border-opacity-30 focus:outline-none"
                          min={1}
                          defaultValue={1}
                          onChange={(value) => {
                            setFieldValue('bookingPeriod', value)
                            handleTotal(values.providerServiceId, value, values.voucherIds)
                          }}
                          value={values.bookingPeriod}
                          component={
                            <Time className="pr-2" theme="outline" size="15" fill="#FFF" strokeLinejoin="bevel" />
                          }
                        />
                        <ErrorMessage name="bookingPeriod" component="div" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-10 place-items-start pt-5 pb-5">
                  <div className="col-span-2">
                    <label htmlFor="bookingPeriod" className="text-2xl font-medium text-white opacity-40">
                      Mã giảm giá
                    </label>
                  </div>
                  <div className="col-span-8">
                    <div className="relative">
                      <Menu>
                        <Menu.Button>
                          <button
                            className={`flex justify-between items-center gap-3 min-w-[200px] text-lg font-semibold px-3 py-2 border border-white border-opacity-30 bg-zinc-800 hover:bg-gray-700 rounded-xl`}
                            type="button"
                          >
                            {myVoucher?.row ? myVoucher.row[0]?.code : <>Khuyến mãi</>}
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
                        >
                          <Menu.Items
                            className="absolute right-0 left-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-fit max-h-[200px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                            style={{ zIndex: 5 }}
                          >
                            <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                              {myVoucher?.row?.map((data, index) => (
                                <div
                                  className={`flex gap-5 items-center ${
                                    values.voucherIds?.row?.find((dataChoose) => dataChoose.code == data.code) &&
                                    'bg-gray-500'
                                  } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                  key={index}
                                  onClick={() => {
                                    setFieldValue('vouchers', data.code)
                                    handleTotal(values.providerServiceId, values.bookingPeriod, data.code)
                                  }}
                                >
                                  <div className="min-w-[500px] grid grid-cols-5 gap-5">
                                    <p className="col-span-1 text-md font-semibold">{data.code}</p>
                                    <p className="col-span-3 text-md font-semibold">{data.content}</p>
                                    <p className="col-span-1 text-md font-semibold">
                                      {data.discountValue} {data.discountUnit}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <ErrorMessage name="voucherIds" component="div" />
                  </div>
                </div>
                <div className="flex justify-between border-b-2 border-[#B9B8CC] pb-5">
                  <p className="text-4xl font-bold ">Thành tiền:</p>
                  <p className="text-4xl font-bold ">
                    {values.bookingPeriod}h giá {total}U
                  </p>
                </div>
                <button
                  type="submit"
                  className={`py-2 mt-2 text-2xl font-bold text-center text-white ${
                    !values.providerServiceId
                      ? 'border bg-zinc-800 cursor-not-allowed'
                      : 'bg-purple-700 hover:scale-105'
                  }  rounded-full `}
                  disabled={!isSubmitting}
                >
                  Đặt
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
export default BookingProvider
