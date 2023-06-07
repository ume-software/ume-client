import { memo } from 'react'

import Image from 'next/image'

import { trpc } from '~/utils/trpc'

const Notificate = () => {
  const {
    data: bookingProvider,
    isLoading: loadingBookingProvider,
    isFetching: fetching,
  } = trpc.useQuery(['booking.getBookingProvider'])

  if (loadingBookingProvider) {
    return <></>
  }
  let listBookingProvider: any = bookingProvider?.data?.row

  console.log(listBookingProvider)

  return (
    <>
      {listBookingProvider.length != 0 ? (
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
            <div className="flex justify-around gap-5 pt-3 px-3">
              <div className="rounded-lg w-full text-white bg-purple-700 py-1 font-normal text-md hover:scale-105 text-center">
                Chấp nhận
              </div>
              <div className="rounded-lg w-full text-purple-700 border-2 border-purple-700 py-1 font-normal text-md hover:scale-105 text-center">
                Từ chối
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Chưa có thông báo mới!</div>
      )}
    </>
  )
}
export default memo(Notificate)
