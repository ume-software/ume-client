import { useEffect, useState } from 'react'

import Link from 'next/link'
import {
  BookingComplaintResponse,
  BookingComplaintResponseComplaintStatusEnum,
  CreateBookingComplaintRequestComplaintTypeEnum,
} from 'ume-service-openapi'

import ComplainDetailModal from './complain-detail-modal'
import ResponseComplainTicketModal from './response-complain'

import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { ComplainEnum } from '~/utils/enumVariable'
import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const mappingBookingComplainStatusForUser: IEnumType[] = [
  {
    key: BookingComplaintResponseComplaintStatusEnum.AwaitingProviderResponse,
    label: 'Đợi phản hồi',
    color: '#FFFF00',
    textColor: '#000',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.PendingProcessing,
    label: 'Đợi duyệt',
    color: '#FFFF00',
    textColor: '#000',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.ProviderResponded,
    label: 'Đã được phản hồi',
    color: '#008000',
    textColor: '#FFF',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.Rejected,
    label: 'Từ chối',
    color: '#FF0000',
    textColor: '#FFF',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.Resolved,
    label: 'Đã giải quyết',
    color: '#008000',
    textColor: '#FFF',
  },
]

const mappingBookingComplainStatusForProvider: IEnumType[] = [
  {
    key: BookingComplaintResponseComplaintStatusEnum.AwaitingProviderResponse,
    label: 'Đợi phản hồi',
    color: '#FFFF00',
    textColor: '#000',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.PendingProcessing,
    label: 'Đợi duyệt',
    color: '#FFFF00',
    textColor: '#000',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.ProviderResponded,
    label: 'Đã phản hồi',
    color: '#008000',
    textColor: '#FFF',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.Rejected,
    label: 'Đã được chấp nhận',
    color: '#008000',
    textColor: '#FFF',
  },
  {
    key: BookingComplaintResponseComplaintStatusEnum.Resolved,
    label: 'Đã giải quyết',
    color: '#008000',
    textColor: '#FFF',
  },
]

const mappingComplainTypes: IEnumType[] = [
  { key: CreateBookingComplaintRequestComplaintTypeEnum.WrongServiceProvided, label: 'Sai dịch vụ' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.Fraud, label: 'Lừa đảo' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.DelayedService, label: 'Phục vụ trễ giờ' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.Other, label: 'Khác' },
]

const ComplainTableHistory = (props: { typeTable }) => {
  const userInfo = JSON.parse(localStorage.getItem('user') ?? 'null')

  const limit = '10'
  const [page, setPage] = useState<string>('1')

  const [isModalComplainDetailVisible, setIsModalComplainDetailVisible] = useState<boolean>(false)
  const [isModalComplainVisible, setIsModalComplainVisible] = useState<boolean>(false)
  const [selectedBookingComplain, setSelectedBookingComplain] = useState<BookingComplaintResponse | undefined>(
    undefined,
  )

  const [bookingComplainForUserArray, setBookingComplainForUserArray] = useState<any[] | undefined>(undefined)
  const [bookingComplainForProviderArray, setBookingComplainForProviderArray] = useState<any[] | undefined>(undefined)

  const { data: bookingComplainForUserData, isLoading: isBookingComplainForUserLoading } = trpc.useQuery(
    ['identity.getBookerHistoryComplain', { limit: limit, page: page }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
    },
  )

  const { data: bookingComplainForProviderData, isLoading: isBookingComplainForProviderLoading } = trpc.useQuery(
    ['identity.getProviderHistoryComplain', { limit: limit, page: page }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: userInfo?.isProvider && props.typeTable == ComplainEnum.COMPLAIN_TO_ME,
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
    const bookingComplainHistoryForUserArray = bookingComplainForUserData?.data.row?.map((bookignComplainHistory) => {
      const bookingComplainHistoryArray = Object.values(bookignComplainHistory)

      const newBookingComplainHistoryArray = [
        <Link
          key={bookingComplainHistoryArray[1] + 'link'}
          href={`/profile/${
            bookingComplainHistoryArray[10]?.providerService?.provider?.slug ??
            bookingComplainHistoryArray[10]?.providerService?.provider?.id
          }`}
          className="hover:underline"
        >
          {bookingComplainHistoryArray[10]?.providerService?.provider?.name}
        </Link>,
        bookingComplainHistoryArray[11]?.service?.name,
        <span key={bookingComplainHistoryArray[0] + 'description'} className="max-w-96 line-clamp-3">
          {bookingComplainHistoryArray[5]}
        </span>,
        <div key={bookingComplainHistoryArray[0] + 'type'} className="flex items-center justify-center gap-2">
          {mappingComplainTypes.find((complainStatus) => complainStatus.key == bookingComplainHistoryArray[7])?.label}
        </div>,
        <div className="flex justify-center" key={bookingComplainHistoryArray[0] + 'status'}>
          <p
            className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl`}
            style={{
              background: `${
                mappingBookingComplainStatusForUser.find(
                  (statusType) => statusType.key == bookingComplainHistoryArray[6],
                )?.color
              }`,
              color: `${
                mappingBookingComplainStatusForUser.find(
                  (statusType) => statusType.key == bookingComplainHistoryArray[6],
                )?.textColor
              }`,
            }}
          >
            {
              mappingBookingComplainStatusForUser.find((statusType) => statusType.key == bookingComplainHistoryArray[6])
                ?.label
            }
          </p>
        </div>,

        <>{convertSendDate(bookingComplainHistoryArray[1])}</>,
      ]

      return newBookingComplainHistoryArray
    })
    setBookingComplainForUserArray(bookingComplainHistoryForUserArray)
  }, [bookingComplainForUserData])

  useEffect(() => {
    const bookingComplainHistoryForProviderArray = bookingComplainForProviderData?.data.row?.map(
      (bookignComplainHistory) => {
        const bookingComplainHistoryArray = Object.values(bookignComplainHistory)

        const newBookingComplainHistoryArray = [
          <Link
            key={bookingComplainHistoryArray[1] + 'link'}
            href={`/profile/${
              bookingComplainHistoryArray[10]?.booker?.slug ?? bookingComplainHistoryArray[10]?.booker?.id
            }`}
            className="hover:underline"
          >
            {bookingComplainHistoryArray[10]?.booker?.name}
          </Link>,
          bookingComplainHistoryArray[11]?.booking?.service?.name,
          <span key={bookingComplainHistoryArray[0] + 'description'} className="max-w-96 line-clamp-3">
            {bookingComplainHistoryArray[5]}
          </span>,
          <div key={bookingComplainHistoryArray[0] + 'type'} className="flex items-center justify-center gap-2">
            {mappingComplainTypes.find((complainStatus) => complainStatus.key == bookingComplainHistoryArray[7])?.label}
          </div>,
          <div className="flex justify-center" key={bookingComplainHistoryArray[0] + 'status'}>
            <p
              className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl`}
              style={{
                background: `${
                  mappingBookingComplainStatusForProvider.find(
                    (statusType) => statusType.key == bookingComplainHistoryArray[6],
                  )?.color
                }`,
                color: `${
                  mappingBookingComplainStatusForProvider.find(
                    (statusType) => statusType.key == bookingComplainHistoryArray[6],
                  )?.textColor
                }`,
              }}
            >
              {
                mappingBookingComplainStatusForProvider.find(
                  (statusType) => statusType.key == bookingComplainHistoryArray[6],
                )?.label
              }
            </p>
          </div>,

          <>{convertSendDate(bookingComplainHistoryArray[1])}</>,
        ]

        return newBookingComplainHistoryArray
      },
    )
    setBookingComplainForProviderArray(bookingComplainHistoryForProviderArray)
  }, [bookingComplainForProviderData])

  const handleDetailConplain = (item: BookingComplaintResponse | undefined) => {
    if (item) {
      setSelectedBookingComplain(item)
      setIsModalComplainDetailVisible(true)
    }
  }

  const handleCreateComplain = (item: BookingComplaintResponse | undefined) => {
    if (item) {
      setSelectedBookingComplain(item)
      setIsModalComplainVisible(true)
    }
  }
  return (
    <>
      <ComplainDetailModal
        isModalComplainDetailVisible={isModalComplainDetailVisible}
        setIsModalComplainDetailVisible={setIsModalComplainDetailVisible}
        bookingSelected={selectedBookingComplain}
        complainType={props.typeTable}
      />
      <ResponseComplainTicketModal
        isModalComplainVisible={isModalComplainVisible}
        setIsModalComplainVisible={setIsModalComplainVisible}
        bookingSelected={selectedBookingComplain}
      />
      <div className="w-full px-10 mt-5">
        <div className="flex flex-col gap-5 mt-10 space-y-2">
          {(!isBookingComplainForUserLoading && bookingComplainForUserArray) ||
          (!isBookingComplainForProviderLoading && bookingComplainForProviderArray) ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-bold">Chi tiết khiếu nại</p>
              <Table
                dataHeader={['Tên', 'Dịch vụ', 'Nội dung', 'Kiểu', 'Trạng thái', 'Ngày tạo']}
                dataBody={
                  (props.typeTable == ComplainEnum.COMPLAIN_OF_ME
                    ? bookingComplainForUserArray
                    : bookingComplainForProviderArray) ?? [[undefined]]
                }
                page={page}
                setPage={setPage}
                limit={limit}
                totalItem={
                  props.typeTable == ComplainEnum.COMPLAIN_OF_ME
                    ? bookingComplainForUserData?.data.count ?? 0
                    : bookingComplainForProviderData?.data.count ?? 0
                }
                contentItem={'khiếu nại'}
                watchAction={true}
                onWatch={(index) => {
                  handleDetailConplain(
                    props.typeTable == ComplainEnum.COMPLAIN_OF_ME
                      ? bookingComplainForUserData?.data.row && bookingComplainForUserData?.data.row[index ?? 0]
                      : bookingComplainForProviderData?.data.row &&
                          bookingComplainForProviderData?.data.row[index ?? 0],
                  )
                }}
                editAction={false}
                onEdit={() => {}}
                deleteAction={false}
                onDelete={() => {}}
                complainAction={props.typeTable == ComplainEnum.COMPLAIN_TO_ME}
                onComplain={(index) => {
                  handleCreateComplain(
                    bookingComplainForProviderData?.data.row && bookingComplainForProviderData?.data.row[index ?? 0],
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
export default ComplainTableHistory
