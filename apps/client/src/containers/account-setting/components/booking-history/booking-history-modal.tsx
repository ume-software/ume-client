import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { BookingHistoryStatusEnum } from '~/enumVariable/enumVariable'

import { Dispatch, SetStateAction } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { BookingHistoryResponse } from 'ume-service-openapi'

interface ComplainTicketProps {
  isModalBookingHistoryDetailVisible: boolean
  setIsModalBookingHistoryDetailVisible: Dispatch<SetStateAction<boolean>>
  bookingSelected: BookingHistoryResponse | undefined
}

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const mappingBookingHistoryContent: IEnumType[] = [
  { key: BookingHistoryStatusEnum.PROVIDER_ACCEPT, label: 'Chấp nhận', color: '#008000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.PROVIDER_CANCEL, label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: BookingHistoryStatusEnum.USER_FINISH_SOON, label: 'Kết thúc sớm', color: '#FFFF00', textColor: '#000' },
]

const BookingHistoryDetailModal = ({
  isModalBookingHistoryDetailVisible,
  setIsModalBookingHistoryDetailVisible,
  bookingSelected,
}: ComplainTicketProps) => {
  const isTimeMoreThan12Hours = () => {
    const bookingTime = new Date(bookingSelected?.updatedAt ?? 0)
    const timestampFromIso = bookingTime.getTime()
    const currentTimestamp = Date.now()

    const twelveHoursAgoTimestamp = currentTimestamp - 12 * 60 * 60 * 1000

    if (timestampFromIso < twelveHoursAgoTimestamp) {
      return true
    } else {
      return false
    }
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

  const bookingHistoryDetailModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalBookingHistoryDetailVisible(false),
    show: isModalBookingHistoryDetailVisible,
    title: <p className="text-white">Chi tiết đơn</p>,
    customModalCSS: 'top-32 h-fit max-h-[80%] overflow-y-auto custom-scrollbar',
    form: (
      <div className="max-h-[90vh] px-10 pt-5 pb-28 text-white space-y-5 overflow-y-auto custom-scrollbar">
        <div className={`flex ${(bookingSelected as any)?.isProcessingComplaint ? 'justify-end' : 'justify-center'}`}>
          {bookingSelected?.status == BookingHistoryStatusEnum.PROVIDER_CANCEL ? (
            <p className="text-lg font-bold text-yellow-500">Đơn này không thể khiếu nại</p>
          ) : (bookingSelected as any)?.isProcessingComplaint ? (
            <div className="w-fit p-3 bg-red-700 rounded-lg text-white font-semibold">Đã gửi khiếu nại</div>
          ) : (bookingSelected as any)?.isRefund ? (
            <div className="w-fit p-3 bg-green-600 rounded-lg text-white font-semibold">Đã được hoàn tiền</div>
          ) : isTimeMoreThan12Hours() ? (
            <p className="text-lg font-bold text-red-500">Đơn này đã quá hạn khiếu nại</p>
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-semibold opacity-30">{bookingSelected?.booker ? 'Người thuê:' : 'Người nhận:'}</label>
          <Link
            href={`/profile/${
              (bookingSelected?.providerService?.provider as any)?.slug ??
              (bookingSelected?.providerService?.provider as any)?.id ??
              bookingSelected?.booker?.slug ??
              bookingSelected?.booker?.id
            }`}
            className="pl-5 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px]">
                <Image
                  className="absolute rounded-full"
                  layout="fill"
                  objectFit="cover"
                  src={
                    (bookingSelected?.providerService?.provider as any)?.avatarUrl ??
                    bookingSelected?.booker?.avatarUrl ??
                    ImgForEmpty
                  }
                  alt="Avatar"
                />
              </div>
              <span className="text-lg font-semibold text-white truncate group-hover:underline">
                {(bookingSelected?.providerService?.provider as any)?.name ?? bookingSelected?.booker?.name}
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-semibold opacity-30">Dịch vụ:</label>
          <div className="pl-5 flex items-center gap-3">
            <div className="relative min-w-[30px] min-h-[50px] max-w-[30px] max-h-[50px]">
              <Image
                className="absolute rounded-lg"
                layout="fill"
                objectFit="cover"
                src={bookingSelected?.providerService?.service?.imageUrl ?? ImgForEmpty}
                alt="Avatar"
              />
            </div>
            <span className="text-lg font-semibold text-white truncate group-hover:underline">
              {bookingSelected?.providerService?.service?.name}
            </span>
          </div>
        </div>

        <div className="border-t border-light-900 w-full my-4 opacity-30"></div>
        <div className="flex items-center gap-3">
          <label className="font-semibold opacity-30">Trạng thái: </label>
          <div className="flex justify-end">
            <p
              className={`w-fit px-2 py-1 text-md font-semibold rounded-lg`}
              style={{
                background: `${
                  mappingBookingHistoryContent.find((statusType) => statusType.key == bookingSelected?.status)?.color
                }`,
                color: `${
                  mappingBookingHistoryContent.find((statusType) => statusType.key == bookingSelected?.status)
                    ?.textColor
                }`,
              }}
            >
              {mappingBookingHistoryContent.find((statusType) => statusType.key == bookingSelected?.status)?.label}
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
            <p>{(bookingSelected as any)?.bookingPeriod}h</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold opacity-30">Số tiền: </label>
            <div className="flex items-center gap-2">
              {(bookingSelected as any)?.totalCost?.toLocaleString()}
              <span className="text-xs italic"> đ</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="font-semibold opacity-30">Khuyến mãi đã dùng:</label>
          <p>{(bookingSelected as any)?.appliedVoucherIds[0] ?? 'Không dùng'}</p>
        </div>
      </div>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalBookingHistoryDetailVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalBookingHistoryDetailVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{bookingHistoryDetailModal}</>
}
export default BookingHistoryDetailModal
