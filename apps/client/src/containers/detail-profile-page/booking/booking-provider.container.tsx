import { Time } from '@icon-park/react'
import { Context } from '@react-oauth/google'
import { FormInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useContext, useEffect, useState } from 'react'

import { InputNumber, Select } from 'antd'
import { notification } from 'antd'
import { NotificationPlacement } from 'antd/es/notification/interface'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/legacy/image'
import { BookingProviderRequest, ProviderConfigResponseStatusEnum, UserInformationResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import { trpc } from '~/utils/trpc'

const BookingProvider = (props: { data: UserInformationResponse }) => {
  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerServiceId: '',
    bookingPeriod: 1,
    voucherIds: [],
  })
  const [total, setTotal] = useState(0)
  const accountBalance = trpc.useQuery(['identity.account-balance'])
  const createBooking = trpc.useMutation(['booking.createBooking'])

  const handleTotal = (providerServiceId, bookingPeriod) => {
    const selectedItem = props.data.providerServices?.find((item) => providerServiceId == item.id)
    setTotal((selectedItem?.defaultCost || 0) * bookingPeriod)
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
                        <Select
                          className="w-full"
                          size="large"
                          showSearch
                          placeholder="Select service"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            ((option?.label as string) ?? '').toLowerCase().includes(input)
                          }
                          onChange={(value) => {
                            setFieldValue('providerServiceId', value)
                            handleTotal(value, values.bookingPeriod)
                          }}
                          value={values.providerServiceId}
                          options={props.data.providerServices?.map((service) => ({
                            value: service.id,
                            label: service.service?.name,
                          }))}
                        />
                        <ErrorMessage name="providerServiceId">
                          {(errorMessage) => <div className="font-normal  text-sm text-red-500">{errorMessage}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label htmlFor="bookingPeriod" className="text-2xl font-medium ">
                          Chọn thời gian
                        </label>
                        <InputNumber
                          prefix={
                            <Time className="pr-2" theme="outline" size="15" fill="#000000" strokeLinejoin="bevel" />
                          }
                          placeholder="Chọn thời gian"
                          min={1}
                          size="large"
                          defaultValue={1}
                          onChange={(value) => {
                            setFieldValue('bookingPeriod', value)
                            handleTotal(values.providerServiceId, value)
                          }}
                          value={values.bookingPeriod}
                        />
                        <ErrorMessage name="bookingPeriod" component="div" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-10 pt-5 pb-5">
                  <div className="col-span-4">
                    <label htmlFor="bookingPeriod" className="text-2xl font-medium text-white  opacity-40">
                      Mã giảm giá
                    </label>
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      type="text"
                      className="text-black"
                      placeholder="Mã giảm giá"
                      onChange={(values) => {
                        setFieldValue('voucherIds', values)
                      }}
                      value={values.voucherIds}
                      error={undefined}
                      errorMessage={undefined}
                    />
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
                  className="py-2 mt-2 text-2xl font-bold text-center text-white bg-purple-700 rounded-full  hover:scale-105"
                  disabled={isSubmitting}
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