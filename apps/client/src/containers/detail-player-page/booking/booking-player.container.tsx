import { Time } from '@icon-park/react'
import { FormInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useState } from 'react'

import { Input, InputNumber, Select } from 'antd'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/legacy/image'
import { BookingProviderRequest } from 'ume-booking-service-openapi'

import { trpc } from '~/utils/trpc'

const BookingPlayer = (props) => {
  const [booking, setBooking] = useState<BookingProviderRequest>({
    providerSkillId: '',
    bookingPeriod: 0,
    voucherIds: [],
  })

  const { mutate, data, error } = trpc.useMutation('booking.createBooking')

  const handleCreateBooking = async (bookingData: BookingProviderRequest) => {
    console.log({ data })
    const result = await mutate(bookingData)
    console.log(result)

    if (error) {
      console.log('Create fail!')
    } else {
      console.log('Create success!')
    }
  }
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  const onChange = (value: number) => {
    console.log('changed', value)
  }
  return (
    <>
      <div className="grid grid-cols-10 pl-10 pt-2">
        <div className="col-span-4">
          <div className="relative w-[300px] h-[400px]">
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
          <p>Tên người được book</p>
          <Formik initialValues={booking} onSubmit={handleCreateBooking}>
            <Form>
              <div>
                <div className="flex flex-col">
                  <label htmlFor="providerSkillId">Chọn dịch vụ</label>
                  <Select
                    defaultValue="lucy"
                    style={{ width: 200 }}
                    onChange={handleChange}
                    options={[
                      {
                        label: 'Service',
                        options: [
                          { label: 'Jack', value: 'jack' },
                          { label: 'Lucy', value: 'lucy' },
                        ],
                      },
                    ]}
                  />
                  <ErrorMessage name="providerSkillId" component="div" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="bookingPeriod">Chọn thời gian</label>
                  <InputNumber
                    prefix={<Time className="pr-2" theme="outline" size="15" fill="#000000" strokeLinejoin="bevel" />}
                    placeholder="Chọn thời gian"
                    min={1}
                    max={10}
                    defaultValue={3}
                    onChange={onChange}
                  />
                  <ErrorMessage name="bookingPeriod" component="div" />
                </div>
              </div>
              <div>
                <label htmlFor="bookingPeriod">Mã giảm giá</label>
                <FormInput type="text" placeholder="Mã giảm giá" error={undefined} errorMessage={undefined} />
                <ErrorMessage name="bookingPeriod" component="div" />
              </div>
              <button type="submit">Create Booking</button>
            </Form>
          </Formik>
        </div>
      </div>
      <div className="flex gap-5">
        <button
          type="button"
          className="rounded-full w-full text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:scale-105 text-center"
        >
          Hủy
        </button>
        <button
          type="button"
          className="rounded-full w-full text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:scale-105 text-center"
        >
          Đặt
        </button>
      </div>
    </>
  )
}
export default BookingPlayer
