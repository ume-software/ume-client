import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { notification } from 'antd'
import { BookingHandleRequestStatusEnum } from 'ume-service-openapi'

import ConfirmForm from '~/components/confirm-form/confirm-form'

import { trpc } from '~/utils/trpc'

const EndSoonModal = ({ isEndSoonModalVisible, setIsEndSoonModalVisible, bookingHistoryId }) => {
  const responeBooking = trpc.useMutation(['booking.putProviderResponeBooking'])
  const utils = trpc.useContext()

  const endSoonModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsEndSoonModalVisible(false),
    show: isEndSoonModalVisible,
    customModalCSS: 'top-32',
    form: (
      <>
        <ConfirmForm
          title={`Kết thúc sớm`}
          description={`Bạn có muốn kết thúc sớm phiên này hay không?`}
          onClose={() => setIsEndSoonModalVisible(false)}
          onOk={() => {
            try {
              responeBooking.mutate(
                {
                  bookingHistoryId: bookingHistoryId,
                  status: BookingHandleRequestStatusEnum.UserFinishSoon,
                },
                {
                  onSuccess: (data) => {
                    if (data.success) {
                      setIsEndSoonModalVisible(false)
                      notification.success({
                        message: 'Kết thúc phiên sớm',
                        description: `Kết thúc phiên thành công!`,
                        placement: 'bottomLeft',
                      })
                      utils.invalidateQueries('booking.getCurrentBookingForUser')
                      utils.invalidateQueries('booking.getCanFeedbackProvider')
                    }
                  },
                  onError: () => {
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
          }}
          isLoading={responeBooking.isLoading}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsEndSoonModalVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsEndSoonModalVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return <>{endSoonModal}</>
}
export default EndSoonModal
