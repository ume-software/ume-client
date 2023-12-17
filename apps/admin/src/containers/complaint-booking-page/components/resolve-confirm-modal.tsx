import { FormInput, Input, TextArea } from '@ume/ui'

import React, { useState } from 'react'

import { notification } from 'antd'
import { useFormik } from 'formik'

import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

interface IModalProps {
  complaintDetails: any
  closeComfirmFormHandle: any | undefined
  openConfirm: boolean
  action: string
  closeAllModals: any
}

const ResolveConfirmModal = ({
  complaintDetails,
  openConfirm,
  closeComfirmFormHandle,
  action,
  closeAllModals,
}: IModalProps) => {
  const resolveComplaint = trpc.useMutation('complaint.updateComplaint')
  const [singleInput, setSingleInput] = useState('')
  const utils = trpc.useContext()
  const form = useFormik({
    initialValues: {
      contentToMember: '',
      contentToProvider: '',
    },
    onSubmit: () => {},
  })

  function handleSingleFormChange(e) {
    setSingleInput(e.target.value)
  }

  function handleResolveComplaint() {
    if (!resolveComplaint.isLoading) {
      let complaintStatus = {}
      try {
        switch (action) {
          case 'REJECTED':
            if (complaintDetails.complaintStatus === 'PENDING_PROCESSING') {
              complaintStatus = {
                bookingComplaintStatus: 'REJECTED',
                bookingComplaintResponseRequests: [
                  {
                    responseMessage: singleInput,
                    bookingComplaintResponseType: 'ADMIN_SEND_TO_BOOKER',
                  },
                ],
              }
            } else if (complaintDetails?.complaintStatus === 'PROVIDER_RESPONDED') {
              complaintStatus = {
                bookingComplaintStatus: 'REJECTED',
                bookingComplaintResponseRequests: [
                  {
                    responseMessage: form.values.contentToMember,
                    bookingComplaintResponseType: 'ADMIN_SEND_TO_BOOKER',
                  },
                  {
                    responseMessage: form.values.contentToProvider,
                    bookingComplaintResponseType: 'ADMIN_SEND_TO_PROVIDER',
                  },
                ],
              }
            }
            break
          case 'AWAITING_PROVIDER_RESPONSE':
            complaintStatus = {
              bookingComplaintStatus: 'AWAITING_PROVIDER_RESPONSE',
              bookingComplaintResponseRequests: [
                {
                  responseMessage: singleInput,
                  bookingComplaintResponseType: 'ADMIN_SEND_TO_PROVIDER',
                },
              ],
            }
            break
          case 'RESOLVED':
            complaintStatus = {
              bookingComplaintStatus: 'RESOLVED',
              bookingComplaintResponseRequests: [
                {
                  responseMessage: form.values.contentToMember,
                  bookingComplaintResponseType: 'ADMIN_SEND_TO_BOOKER',
                },
                {
                  responseMessage: form.values.contentToProvider,
                  bookingComplaintResponseType: 'ADMIN_SEND_TO_PROVIDER',
                },
              ],
            }
            break
        }

        resolveComplaint.mutate(
          {
            id: complaintDetails.id,
            complaintStatus: complaintStatus,
          },
          {
            onSuccess(data) {
              if (data.success) {
                if ((action = 'AWAITING_PROVIDER_RESPONSE')) {
                  notification.success({
                    message: 'Gửi khiếu nại thành công!',
                    description: 'Khiếu nại đã được gửi tới nhà cung cấp!.',
                  })
                } else {
                  notification.success({
                    message: 'Duyệt khiếu nại thành công!',
                    description: 'Khiếu nại đã được duyệt thành công!.',
                  })
                }

                utils.invalidateQueries('complaint.getAllComplaint')
                closeAllModals()
              }
            },
            onError: (err) => {
              notification.error({
                message: 'Hành động không thành công!',
                description: err.message,
              })
              closeComfirmFormHandle()
            },
          },
        )
      } catch (e) {
        notification.error({
          message: 'Hành Động không thành công!',
          description: e,
        })
        closeComfirmFormHandle()
      }
    }
  }

  return (
    <ComfirmModal
      closeFunction={closeComfirmFormHandle}
      openValue={openConfirm}
      isComfirmFunction={handleResolveComplaint}
      titleValue={`${
        action === 'AWAITING_PROVIDER_RESPONSE'
          ? 'Gửi khiếu nại tới nhà cung cấp'
          : action == 'RESOLVED'
          ? 'Xác nhận chấp nhận khiếu nại'
          : 'Xác nhận từ chối khiếu nại'
      }`}
    >
      <div className="text-white m-4">
        {(action === 'AWAITING_PROVIDER_RESPONSE' || action === 'REJECTED') &&
        complaintDetails?.complaintStatus == 'PENDING_PROCESSING' ? (
          <div className="w-full">
            <p className="font-bold text-lg">Nội dung:</p>
            <textarea
              value={singleInput}
              onChange={handleSingleFormChange}
              rows={4}
              className="p-2 rounded-lg bg-gray-500 w-full"
            />
          </div>
        ) : (
          <div className="w-full">
            <form>
              <label htmlFor="contentToMember" className="text-lg">
                Nội dung gửi người khiếu nại:
              </label>
              <TextArea
                name="contentToMember"
                className="bg-[#413F4D] w-4/5 max-h-[140px]"
                rows={4}
                value={form.values.contentToMember}
                onChange={form.handleChange}
              />
              <div className="border-2 border-gray-500 opacity-60 my-5" />
              <label htmlFor="contentToProvider" className="text-lg">
                Nội dung gửi nhà cung cấp:
              </label>
              <TextArea
                name="contentToProvider"
                className="bg-[#413F4D] w-4/5 max-h-[140px]"
                rows={4}
                value={form.values.contentToProvider}
                onChange={form.handleChange}
              />
            </form>
          </div>
        )}
      </div>
    </ComfirmModal>
  )
}

export default ResolveConfirmModal
