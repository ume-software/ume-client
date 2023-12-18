import { BookingHistoryEnum, BookingHistoryStatusEnum } from '~/enumVariable/enumVariable'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { BookingHistoryResponse } from 'ume-service-openapi'

import BookingHistoryDetailModal from './booking-history-modal'
import ComplainTicketModal from './complain-ticket-modal'

import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const mappingBookingHistoryContent: IEnumType[] = [
  { key: BookingHistoryStatusEnum.PROVIDER_ACCEPT, label: 'Chấp nhận', color: '#008000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.INIT, label: 'Mới tạo', color: '#008000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.PROVIDER_CANCEL, label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.USER_FINISH_SOON, label: 'Kết thúc sớm', color: '#FFFF00', textColor: '#000' },
]

const BookingTableHistory = (props: { typeTable }) => {
  const userInfo = JSON.parse(localStorage.getItem('user') ?? 'null')

  const limit = '10'
  const [page, setPage] = useState<string>('1')

  const [isModalBookingHistoryDetailVisible, setIsModalBookingHistoryDetailVisible] = useState<boolean>(false)
  const [isModalComplainVisible, setIsModalComplainVisible] = useState<boolean>(false)
  const [selectedBookingHistory, setSelectedBookingHistory] = useState<BookingHistoryResponse | undefined>(undefined)

  const [bookingHistoryForUserArray, setBookingHistoryForUserArray] = useState<any[] | undefined>(undefined)
  const [bookingHistoryForProviderArray, setBookingHistoryForProviderArray] = useState<any[] | undefined>(undefined)

  const { data: bookingHistoryForUserData, isLoading: isBookingHistoryForUserLoading } = trpc.useQuery(
    ['identity.bookingHistoryForUser', { limit: limit, page: page }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
    },
  )

  const { data: bookingHistoryForProviderData, isLoading: isBookingHistoryForProviderLoading } = trpc.useQuery(
    ['identity.bookingHistoryForProvider', { limit: limit, page: page }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: userInfo?.isProvider && props.typeTable == BookingHistoryEnum.BOOKING_FOR_PROVIDER,
    },
  )

  const convertSendDate = (inputTimestamp: string) => {
    const date = new Date(inputTimestamp)

    const options = { timeZone: 'Asia/Ho_Chi_Minh' }

    const formattedDate = date.toLocaleString('en-US', {
      ...options,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return formattedDate
  }

  useEffect(() => {
    const bookingHistoryForUserArray = bookingHistoryForUserData?.data.row?.map((bookignHistory) => {
      const bookingHistoryArray = Object.values(bookignHistory)

      const newBookingHistoryArray = [
        <Link
          key={bookingHistoryArray[1] + 'link'}
          href={`/profile/${bookingHistoryArray[14]?.provider?.slug ?? bookingHistoryArray[14]?.provider?.id}`}
          className="hover:underline"
        >
          {bookingHistoryArray[14]?.provider?.name}
        </Link>,
        bookingHistoryArray[13]?.service?.name,
        bookingHistoryArray[9] + 'h',
        <div key={bookingHistoryArray[1] + 'price'} className="flex items-center justify-center gap-2">
          {bookingHistoryArray[11]?.toLocaleString()}
          <span className="text-xs italic"> đ</span>
        </div>,
        <>{convertSendDate(bookingHistoryArray[2])}</>,
      ]

      return newBookingHistoryArray
    })
    setBookingHistoryForUserArray(bookingHistoryForUserArray)
  }, [bookingHistoryForUserData])

  useEffect(() => {
    const bookingHistoryForProviderArray = bookingHistoryForProviderData?.data.row?.map((bookignHistory) => {
      const bookingHistoryArray = Object.values(bookignHistory)

      const newBookingHistoryArray = [
        <Link
          key={bookingHistoryArray[1] + 'link'}
          href={`/profile/${bookingHistoryArray[15]?.slug ?? bookingHistoryArray[15]?.id}`}
          className="hover:underline"
        >
          {bookingHistoryArray[15]?.name}
        </Link>,
        bookingHistoryArray[13]?.service?.name,
        <div className="flex justify-center" key={bookingHistoryArray[1] + 'status'}>
          <p
            className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl`}
            style={{
              background: `${
                mappingBookingHistoryContent.find((statusType) => statusType.key == bookingHistoryArray[4])?.color
              }`,
              color: `${
                mappingBookingHistoryContent.find((statusType) => statusType.key == bookingHistoryArray[4])?.textColor
              }`,
            }}
          >
            {mappingBookingHistoryContent.find((statusType) => statusType.key == bookingHistoryArray[4])?.label}
          </p>
        </div>,
        <div key={bookingHistoryArray[1] + 'price'} className="flex items-center justify-center gap-2">
          {bookingHistoryArray[11]?.toLocaleString()}
          <span className="text-xs italic"> đ</span>
        </div>,
        <>{convertSendDate(bookingHistoryArray[2])}</>,
      ]

      return newBookingHistoryArray
    })
    setBookingHistoryForProviderArray(bookingHistoryForProviderArray)
  }, [bookingHistoryForProviderData])

  const handleViewBookingHistory = (item: BookingHistoryResponse | undefined) => {
    if (item) {
      setSelectedBookingHistory(item)
      setIsModalBookingHistoryDetailVisible(true)
    }
  }

  const handleCreateComplain = (item: BookingHistoryResponse | undefined) => {
    if (item) {
      setSelectedBookingHistory(item)
      setIsModalComplainVisible(true)
    }
  }

  return (
    <>
      <BookingHistoryDetailModal
        isModalBookingHistoryDetailVisible={isModalBookingHistoryDetailVisible}
        setIsModalBookingHistoryDetailVisible={setIsModalBookingHistoryDetailVisible}
        bookingSelected={selectedBookingHistory}
      />
      <ComplainTicketModal
        isModalComplainVisible={isModalComplainVisible}
        setIsModalComplainVisible={setIsModalComplainVisible}
        bookingSelected={selectedBookingHistory}
      />
      <div className="w-full px-10 mt-5">
        <div className="flex flex-col gap-5 mt-10 space-y-2">
          {(!isBookingHistoryForUserLoading && bookingHistoryForUserArray) ||
          (!isBookingHistoryForProviderLoading && bookingHistoryForProviderArray) ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-bold">Chi tiết đơn</p>
              <p className="text-md font-normal text-red-500 opacity-80">
                {props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER
                  ? '*Thời gian để khiếu nại là trước 12h kể từ khi thuê'
                  : '*Thời gian để phản hồi khiếu nại là 7 ngày từ khi có khiếu nại được gửi tới'}
              </p>
              <Table
                dataHeader={[
                  `${props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER ? 'Người nhận' : 'Người thuê'}`,
                  'Dịch vụ',
                  `${props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER ? 'Thời gian' : 'Trạng thái'}`,
                  'Giá',
                  'Thời gian bắt đầu',
                ]}
                dataBody={
                  (props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER
                    ? bookingHistoryForUserArray
                    : bookingHistoryForProviderArray) ?? [[undefined]]
                }
                page={page}
                setPage={setPage}
                limit={limit}
                totalItem={
                  props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER
                    ? bookingHistoryForUserData?.data.count ?? 0
                    : bookingHistoryForProviderData?.data.count ?? 0
                }
                contentItem={'đơn'}
                watchAction={true}
                onWatch={(index) => {
                  handleViewBookingHistory(
                    props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER
                      ? bookingHistoryForUserData?.data?.row && bookingHistoryForUserData?.data?.row[index ?? 0]
                      : bookingHistoryForProviderData?.data?.row &&
                          bookingHistoryForProviderData?.data?.row[index ?? 0],
                  )
                }}
                editAction={false}
                onEdit={() => {}}
                deleteAction={false}
                onDelete={() => {}}
                complainAction={props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER}
                onComplain={(index) => {
                  handleCreateComplain(
                    props.typeTable == BookingHistoryEnum.BOOKING_FOR_USER
                      ? bookingHistoryForUserData?.data.row && bookingHistoryForUserData?.data.row[index ?? 0]
                      : bookingHistoryForProviderData?.data.row && bookingHistoryForProviderData?.data.row[index ?? 0],
                  )
                }}
              />
            </div>
          ) : (
            <TableSkeletonLoader />
          )}
        </div>
      </div>
    </>
  )
}
export default BookingTableHistory
