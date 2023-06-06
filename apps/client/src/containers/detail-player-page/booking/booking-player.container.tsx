import { Time } from '@icon-park/react'
import { FormInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { SocketContext, socketTokenContext } from '~/api/socket'

import { useContext, useEffect, useState } from 'react'

import { InputNumber, Select } from 'antd'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/legacy/image'
import { BookingProviderRequest } from 'ume-booking-service-openapi'
import * as Yup from 'yup'

import { trpc } from '~/utils/trpc'

const BookingPlayer = (props: { data }) => {
  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerSkillId: '',
    bookingPeriod: 1,
    voucherIds: [],
  })
  const [total, setTotal] = useState(0)
  const createBooking = trpc.useMutation(['booking.createBooking'])

  const handleServiceChange = (value: string) => {
    setBooking((prevBooking) => ({ ...prevBooking, providerSkillId: value }))
  }
  const handlePeriodChange = (value: number) => {
    setBooking((prevBooking) => ({ ...prevBooking, bookingPeriod: value }))
  }

  useEffect(() => {
    const selectedItem = props.data.providerSkills?.find((item) => booking.providerSkillId == item.id)
    setTotal((selectedItem?.defaultCost || 0) * booking.bookingPeriod)
  }, [booking])

  const validationSchema = Yup.object().shape({
    providerSkillId: Yup.string().required('*Chưa chọn dịch vụ'),
  })

  const handleCreateBooking = (bookingData: BookingProviderRequest) => {
    try {
      createBooking.mutate(bookingData, {
        onSuccess: (data) => {
          console.log(data.message)

          setBooking({ providerSkillId: '', bookingPeriod: 1, voucherIds: [] })
        },
        onError: (error) => console.error(error),
      })
    } catch (error) {
      console.error('Failed to create booking:', error)
    }
  }
  return (
    <>
      <div className="p-10 overflow-auto">
        <Formik
          initialValues={booking}
          onSubmit={() => handleCreateBooking(booking)}
          validationSchema={validationSchema}
        >
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
                    <p className="text-4xl font-bold font-nunito">{props.data?.name}</p>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="providerSkillId" className="text-2xl font-medium font-nunito">
                        Chọn dịch vụ
                      </label>
                      <Select
                        className="w-full"
                        size="large"
                        showSearch
                        showArrow={false}
                        placeholder="Select service"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          ((option?.label as string) ?? '').toLowerCase().includes(input)
                        }
                        onChange={handleServiceChange}
                        options={props.data.providerSkills?.map((service) => {
                          return {
                            value: service.id,
                            label: service.skill?.name,
                          }
                        })}
                      />
                      <ErrorMessage
                        name="providerSkillId"
                        component="div"
                        className="font-normal font-nunito text-sm text-red-500"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label htmlFor="bookingPeriod" className="text-2xl font-medium font-nunito">
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
                        onChange={handlePeriodChange}
                      />
                      <ErrorMessage name="bookingPeriod" component="div" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-10 pt-5 pb-5">
                <div className="col-span-4">
                  <label htmlFor="bookingPeriod" className="text-2xl font-medium text-white font-nunito opacity-40">
                    Mã giảm giá
                  </label>
                </div>
                <div className="col-span-6">
                  <FormInput
                    type="text"
                    className="text-black"
                    placeholder="Mã giảm giá"
                    error={undefined}
                    errorMessage={undefined}
                  />
                  <ErrorMessage name="bookingPeriod" component="div" />
                </div>
              </div>
              <div className="flex justify-between border-b-2 border-[#B9B8CC] pb-5">
                <p className="text-4xl font-bold font-nunito">Thành tiền:</p>
                <p className="text-4xl font-bold font-nunito">
                  {booking.bookingPeriod}h giá {total}U
                </p>
              </div>
              <button
                type="submit"
                className="py-2 mt-5 text-2xl font-bold text-center text-white bg-purple-700 rounded-full font-nunito hover:scale-105"
              >
                Đặt
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  )
}
export default BookingPlayer
