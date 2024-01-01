import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { Dispatch, SetStateAction } from 'react'

import { Image } from 'antd'
import Link from 'next/link'
import {
  BookingComplaintResponse,
  BookingComplaintResponseComplaintStatusEnum,
  CreateBookingComplaintRequestComplaintTypeEnum,
} from 'ume-service-openapi'

import { BookingHistoryStatusEnum, ComplainEnum } from '~/utils/enumVariable'

interface ComplainTicketProps {
  isModalComplainDetailVisible: boolean
  setIsModalComplainDetailVisible: Dispatch<SetStateAction<boolean>>
  bookingSelected: BookingComplaintResponse | undefined
  complainType: string
}

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const mappingComplainTypes: IEnumType[] = [
  { key: CreateBookingComplaintRequestComplaintTypeEnum.WrongServiceProvided, label: 'Sai dịch vụ' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.Fraud, label: 'Lừa đảo' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.DelayedService, label: 'Phục vụ trễ giờ' },
  { key: CreateBookingComplaintRequestComplaintTypeEnum.Other, label: 'Khác' },
]
const mappingBookingHistoryContent: IEnumType[] = [
  { key: BookingHistoryStatusEnum.PROVIDER_ACCEPT, label: 'Chấp nhận', color: '#008000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.PROVIDER_CANCEL, label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.USER_FINISH_SOON, label: 'Kết thúc sớm', color: '#FFFF00', textColor: '#000' },
]

const ComplainDetailModal = ({
  isModalComplainDetailVisible,
  setIsModalComplainDetailVisible,
  bookingSelected,
  complainType,
}: ComplainTicketProps) => {
  const isTimeMoreThan7Days = () => {
    const bookingTime = new Date(bookingSelected?.updatedAt ?? 0)
    const timestampFromIso = bookingTime.getTime()
    const currentTimestamp = Date.now()

    const daysLeft = 6 - Math.ceil((timestampFromIso - currentTimestamp) / (24 * 60 * 60 * 1000))

    return daysLeft
  }

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

  const complainDetailModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalComplainDetailVisible(false),
    show: isModalComplainDetailVisible,
    title: <p className="text-white">Chi tiết đơn</p>,
    customModalCSS: `${
      (bookingSelected?.bookingComplaintResponses?.length ?? 0) > 0 ? 'top-5 max-h-[95%]' : 'top-20 max-h-[80%]'
    } h-fit  overflow-y-auto custom-scrollbar`,
    form: (
      <>
        <div className="max-h-[90vh] px-10 pt-5 pb-10 text-white space-y-5 overflow-y-auto custom-scrollbar">
          <div className={`flex ${(bookingSelected as any)?.isProcessingComplaint ? 'justify-end' : 'justify-center'}`}>
            {(bookingSelected?.bookingComplaintResponses?.length ?? 1) > 1 ? (
              <div className="w-fit p-3 bg-red-700 rounded-lg text-white font-semibold">Đã phản hồi khiếu nại</div>
            ) : isTimeMoreThan7Days() < 1 ? (
              <p className="text-lg font-bold text-red-500">Đơn này đã quá hạn phản hồi</p>
            ) : bookingSelected?.complaintStatus ==
              BookingComplaintResponseComplaintStatusEnum.AwaitingProviderResponse ? (
              <p className="text-lg font-bold text-red-500">
                Bạn còn {isTimeMoreThan7Days()} ngày để {complainType == ComplainEnum.COMPLAIN_OF_ME && 'được'} phản hồi
              </p>
            ) : (
              <p className="text-lg font-bold text-yellow-500">Đợi admin duyệt đơn</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <label className="font-semibold opacity-30">
                {complainType == ComplainEnum.COMPLAIN_OF_ME ? 'Người nhận:' : 'Người khiếu nại:'}
              </label>
              <Link
                href={`/profile/${
                  complainType == ComplainEnum.COMPLAIN_OF_ME
                    ? (bookingSelected?.booking?.providerService?.provider as any)?.slug ??
                      (bookingSelected?.booking?.providerService?.provider as any)?.id
                    : bookingSelected?.booking?.booker?.slug ?? bookingSelected?.booking?.booker?.id
                }`}
                className="pl-5 group"
              >
                <div className="flex items-center gap-3">
                  <Image
                    className="rounded-full"
                    width={50}
                    height={50}
                    src={
                      (bookingSelected?.booking?.providerService?.provider as any)?.avatarUrl ??
                      bookingSelected?.booking?.booker?.avatarUrl ??
                      'public/img-for-empty.png'
                    }
                    alt="Avatar"
                  />
                  <span className="text-lg font-semibold text-white truncate group-hover:underline">
                    {bookingSelected?.booking?.booker?.name}
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-semibold opacity-30">Trạng thái:</label>
              <p
                className={`w-fit px-2 py-1 text-md font-semibold rounded-lg`}
                style={{
                  background: `${
                    mappingBookingHistoryContent.find(
                      (statusType) => statusType.key == bookingSelected?.booking?.status,
                    )?.color
                  }`,
                  color: `${
                    mappingBookingHistoryContent.find(
                      (statusType) => statusType.key == bookingSelected?.booking?.status,
                    )?.textColor
                  }`,
                }}
              >
                {
                  mappingBookingHistoryContent.find((statusType) => statusType.key == bookingSelected?.booking?.status)
                    ?.label
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold opacity-30">Thời gian tạo: </label>
            <p>{convertSendDate(bookingSelected?.updatedAt ?? '')}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <label className="font-semibold opacity-30">Thời gian thuê: </label>
              <p>{bookingSelected?.booking?.bookingPeriod}h</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-semibold opacity-30">Số tiền: </label>
              <div className="flex items-center gap-2">
                {bookingSelected?.booking?.totalCost?.toLocaleString()}
                <span className="text-xs italic"> đ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-light-900 w-full my-4 opacity-30"></div>

          <div className="flex items-center gap-3">
            <label className="font-semibold opacity-30">Loại khiếu nại: </label>
            <p>
              {
                mappingComplainTypes.find((complainStatus) => complainStatus.key == bookingSelected?.complaintType)
                  ?.label
              }
            </p>
          </div>
          <div className="space-y-2">
            <label className="font-semibold opacity-30">Nội dung: </label>
            <p className="pl-5">{bookingSelected?.complaintDescription}</p>
          </div>
          <div className="space-y-2">
            <label className="font-semibold opacity-30">Hình ảnh: </label>
            <div className="pl-5 grid grid-cols-3">
              {(bookingSelected?.attachments?.length ?? 0) > 0 &&
                bookingSelected?.attachments?.map((attachment, index) => (
                  <div key={index} className="col-span-1 mb-3">
                    <Image
                      className="rounded-lg"
                      width={70}
                      height={90}
                      src={attachment?.url ?? 'public/img-for-empty.png'}
                      alt="Avatar"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-3">
            {bookingSelected?.bookingComplaintResponses &&
              (bookingSelected?.bookingComplaintResponses?.length ?? 0) > 0 && (
                <>
                  <div className="border-t border-light-900 w-full my-4 opacity-30"></div>
                  <label className="text-lg font-semibold">Phản hồi: </label>
                  <div className="space-y-2 pl-5">
                    <label className="font-semibold opacity-30">Nội dung: </label>
                    <p className="pl-5">{bookingSelected?.bookingComplaintResponses[0]?.responseMessage}</p>
                  </div>
                  <div className="space-y-2 pl-5">
                    <label className="font-semibold opacity-30">Hình ảnh: </label>
                    <div className="pl-5 grid grid-cols-3">
                      {(bookingSelected?.bookingComplaintResponses[0].attachments?.length ?? 0) > 0 &&
                        bookingSelected?.bookingComplaintResponses[0].attachments?.map((attachment, index) => (
                          <div key={index} className="col-span-1 mb-3">
                            <Image
                              className="rounded-lg"
                              width={70}
                              height={90}
                              src={attachment?.url ?? 'public/img-for-empty.png'}
                              alt="Avatar"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalComplainDetailVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalComplainDetailVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{complainDetailModal}</>
}
export default ComplainDetailModal
