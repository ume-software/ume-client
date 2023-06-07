import { useEffect, useState } from 'react'

import { trpc } from '~/utils/trpc'

const Notificate = (props) => {
  let listBookingProvider: any
  const {
    data: bookingProvider,
    isLoading: loadingBookingProvider,
    isFetching: fetching,
  } = trpc.useQuery(['booking.getBookingProvider'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })

  if (loadingBookingProvider) {
    return <></>
  }
  listBookingProvider = bookingProvider?.data?.row
  console.log(listBookingProvider)

  // useEffect(() => {
  //   listBookingProvider = [...listBookingProvider, props?.data]
  // }, [props?.data])

  return (
    <>
      <div className="grid grid-cols-10">
        <div className="col-span-3">Image here</div>
        <div className="col-span-7">
          <div className="flex flex-col gap-2">
            <div>Name here</div>
            <div>Game Name && Time booking</div>
          </div>
        </div>
      </div>
      <div className="flex justify-around gap-5 pt-3">
        <div className="rounded-full w-full text-white bg-purple-700 py-1 font-normal text-md hover:scale-105 text-center">
          Chấp nhận
        </div>
        <div className="rounded-full w-full text-purple-700 border-2 border-purple-700 py-1 font-normal text-md hover:scale-105 text-center">
          Từ chối
        </div>
      </div>
    </>
  )
}
export default Notificate
