import { useState } from 'react'

import { notification } from 'antd'
import Image from 'next/image'
import { BookingHandleRequestStatusEnum } from 'ume-booking-service-openapi'

import { trpc } from '~/utils/trpc'

let result: string
const Notificate = (props: { responeBooking }) => {
  const [listBookingProvider, setListBookingProvider] = useState<any>([])
  const {
    data: bookingProvider,
    isLoading: loadingBookingProvider,
    isFetching: fetching,
  } = trpc.useQuery(['booking.getBookingProvider'], {
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setListBookingProvider(data?.data?.row)
    },
  })

  if (loadingBookingProvider) {
    return <></>
  }
  console.log(listBookingProvider)

  const handleAcceptBooking = (bookingHistoryId: string, bookerName: string) => {
    try {
      props.responeBooking.mutate(
        { bookingHistoryId: bookingHistoryId, status: BookingHandleRequestStatusEnum.ProviderAccept },
        {
          onSuccess: (data) => {
            if (data.success) {
              result = bookingHistoryId
              notification.success({
                message: 'Yêu cầu đã được chấp nhận!',
                description: `Bạn đã chấp nhận yêu cầu từ ${bookerName}`,
                placement: 'bottomLeft',
              })
            }
          },
          onError: (error, data) => {
            console.error(error)
            notification.error({
              message: 'Có lỗi!',
              description: 'Có lỗi trong quá trình chấp nhận. Vui lòng thử lại!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    } catch (error) {
      console.error('Failed to accept booking:', error)
    }
  }

  const handleUnacceptBooking = (bookingHistoryId: string, bookerName: string) => {
    try {
      props.responeBooking.mutate(
        { bookingHistoryId: bookingHistoryId, status: BookingHandleRequestStatusEnum.ProviderCancel },
        {
          onSuccess: (data) => {
            if (data.success) {
              result = bookingHistoryId
              notification.success({
                message: 'Yêu cầu đã được xóa!',
                description: `Bạn đã từ chối yêu cầu từ ${bookerName}`,
                placement: 'bottomLeft',
              })
            }
          },
          onError: (error, data) => {
            console.error(error)
            notification.error({
              message: 'Có lỗi!',
              description: 'Có lỗi trong quá trình hủy. Vui lòng thử lại!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  return (
    <>
      {listBookingProvider && listBookingProvider?.length != 0 ? (
        listBookingProvider.map((item) => (
          <div key={item.id} className="p-2 border-b-2 border-gray-200 rounded-lg hover:bg-violet-100">
            <div className="grid grid-cols-10">
              <div className="col-span-3">
                <div className="w-[90%] h-full relative rounded-lg">
                  <Image
                    className="rounded-lg"
                    src={item.booker.avatarUrl || item.providerSkill.skill.imageUrl}
                    alt="Game Image"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="col-span-7">
                <div className="flex flex-col gap-2">
                  <div className="font-bold truncate">{item.booker.name}</div>
                  <div>
                    Đã gửi yêu cầu chơi game <p className="inline font-bold">{item.providerSkill.skill.name}</p> cùng
                    bạn thời gian là: <p className="inline font-bold">{item.bookingPeriod}h</p>
                  </div>
                </div>
              </div>
            </div>
            {item.id === result ? (
              <div>Bạn đã xử lý yêu cầu này!</div>
            ) : (
              <div className="flex justify-around gap-5 pt-3 px-3">
                <div
                  className="rounded-lg w-full text-white bg-purple-700 py-1 font-normal text-md hover:scale-105 text-center cursor-pointer"
                  onClick={() => handleAcceptBooking(item.id, item.booker.name)}
                >
                  Chấp nhận
                </div>
                <div
                  className="rounded-lg w-full text-purple-700 border-2 border-purple-700 py-1 font-normal text-md hover:scale-105 text-center cursor-pointer"
                  onClick={() => handleUnacceptBooking(item.id, item.booker.name)}
                >
                  Từ chối
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>Chưa có thông báo mới!</div>
      )}
    </>
  )
}
export default Notificate
