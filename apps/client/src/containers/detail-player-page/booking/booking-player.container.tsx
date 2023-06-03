import { Time } from '@icon-park/react'
import { FormInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useEffect, useState } from 'react'

import { InputNumber, Select } from 'antd'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/legacy/image'
import { BookingProviderRequest } from 'ume-booking-service-openapi'

import { trpc } from '~/utils/trpc'

const BookingPlayer = (props: { data }) => {
  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerSkillId: '',
    bookingPeriod: 1,
    voucherIds: [],
  })
  const [total, setTotal] = useState(0)

  const { mutate, data, error } = trpc.useMutation('booking.createBooking')

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

  const handleCreateBooking = async (bookingData: BookingProviderRequest) => {
    console.log({ bookingData })

    const result = await mutate(bookingData)
    console.log(result)

    if (error) {
      console.log('Create fail!')
    } else {
      console.log('Create success!')
    }
  }
  return (
    <>
      <div className="p-10 overflow-auto">
        <Formik initialValues={booking} onSubmit={() => handleCreateBooking(booking)}>
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
                    <p className="font-nunito font-bold text-4xl">Tên người được book</p>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="providerSkillId" className="font-nunito font-medium text-2xl">
                        Chọn dịch vụ
                      </label>
                      <Select
                        className="w-full"
                        size="large"
                        showSearch
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
                      <ErrorMessage name="providerSkillId" component="div" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label htmlFor="bookingPeriod" className="font-nunito font-medium text-2xl">
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
                  <label htmlFor="bookingPeriod" className="font-nunito font-medium text-2xl text-white opacity-40">
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
                <p className="font-nunito font-bold text-4xl">Thành tiền:</p>
                <p className="font-nunito font-bold text-4xl">
                  {booking.bookingPeriod}h giá {total}U
                </p>
              </div>
              <button
                type="submit"
                className="rounded-full mt-5 text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:scale-105 text-center"
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
