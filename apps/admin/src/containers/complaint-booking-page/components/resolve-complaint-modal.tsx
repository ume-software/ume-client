import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Image } from 'antd'

import ResolveConfirmModal from './resolve-confirm-modal'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

interface IModalProps {
  id: string
  closeFunction: any | undefined
  openValue: boolean
}

const mappingComplaintStatus = {
  all: 'Tất cả',
  REJECTED: 'Đã từ chối',
  RESOLVED: 'Đã chấp nhận',
  PENDING_PROCESSING: 'Chờ xử lý',
  AWAITING_PROVIDER_RESPONSE: 'Chờ nhà cung cấp phản hồi',
  PROVIDER_RESPONDED: 'Nhà cung cấp đã phản hồi',
}
const mappingComplaintType = {
  all: 'Tất cả',
  WRONG_SERVICE_PROVIDED: 'Sai dịch vụ đã thuê',
  FRAUD: 'Gian lận',
  DELAYED_SERVICE: 'Cung cấp dịch vụ chậm',
  OTHER: 'Khác',
}

const ResolveComplaintModal = ({ id, openValue, closeFunction }: IModalProps) => {
  const [complaintDetails, setComplaintDetails] = useState<any>()
  const [openResolve, setOpenResolve] = useState(false)
  const [action, setAction] = useState('')

  const SELECT = [
    '$all',
    { bookingComplaintResponses: ['$all'] },
    {
      booking: [
        '$all',
        { providerService: ['$all', { provider: ['$all'] }, { service: ['$all'] }] },
        { booker: ['$all'] },
      ],
    },
  ]
  trpc.useQuery(
    [
      'complaint.getComplaintDetails',
      {
        id: id,
        select: JSON.stringify(SELECT),
      },
    ],
    {
      onSuccess(data) {
        setComplaintDetails(data?.data as any)
      },
    },
  )
  function closeAllModals() {
    setOpenResolve(false)
    closeFunction()
  }

  function closeComfirmFormHandle() {
    setOpenResolve(false)
  }
  function openComfirmFormHandle(data) {
    if (data != action) setAction(data)
    setOpenResolve(true)
  }

  return (
    <ModalBase
      width={'50%'}
      titleValue="Duyệt đơn khiếu nại"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto text-white bg-black"
    >
      <div className="m-4 text-white">
        <div className="rounded-lg border-2 p-4 border-white my-5">
          <span className="font-bold text-xl">Thông tin khiếu nại</span>
          <div className="grid grid-cols-3 gap-2 m-3">
            <div>
              <p>
                <span className="font-bold">Người khiếu nại: </span>
                {complaintDetails?.booking?.booker?.name}
              </p>
              <p>
                <span className="font-bold">Loại khiếu nại: </span>
                {mappingComplaintType[complaintDetails?.complaintType!]}
              </p>
              <p>
                <span className="font-bold">Dịch vụ: </span>
                {complaintDetails?.booking?.providerService?.service?.name}
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold">Nhà cung cấp: </span>
                {complaintDetails?.booking?.providerService?.provider?.name}
              </p>
              <p>
                <span className="font-bold">Ngày khiếu nại: </span>
                {new Date(complaintDetails?.createdAt!).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold">Trạng thái xử lý: </span>
                {mappingComplaintStatus[complaintDetails?.complaintStatus]}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-2 p-4 border-white my-5">
          <span className="font-bold text-xl">Chi tiết khiếu nại</span>
          <div className="m-3">
            <span className="font-bold">Nội dung:</span>
            <div className="rounded-lg bg-gray-500 my-2 p-2 min-h-[5rem]">{complaintDetails?.complaintDescription}</div>
            <span className="font-bold">Ảnh đính kèm:</span>
            <div className="min-h-[10rem] my-2">
              {complaintDetails?.attachments?.length == 0 ? (
                <div className="w-full h-[10rem] flex justify-center items-center">Không có ảnh</div>
              ) : (
                <div className="grid grid-cols-5">
                  {complaintDetails?.attachments?.map((item) => {
                    return <Image key={item.url} src={item.url} width={100} height={130} alt="Image" />
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-2 border-gray-400" />
        <div className="rounded-lg border-2 p-4 border-white my-5">
          <span className="font-bold text-xl">Phản hồi từ nhà cung cấp</span>
          <div className="m-3">
            {complaintDetails?.complaintStatus == 'PENDING_PROCESSING' ||
            !complaintDetails?.bookingComplaintResponses!.some(
              (response) => response.bookingComplaintResponseType === 'PROVIDER_SEND_TO_ADMIN',
            ) ? (
              <div className="w-full h-[5rem] flex flex-col justify-center items-center">
                Chưa có phản hồi từ nhà cung cấp
              </div>
            ) : (
              <div className="m-3">
                {complaintDetails?.bookingComplaintResponses!.map((response) => {
                  if (response.bookingComplaintResponseType === 'PROVIDER_SEND_TO_ADMIN') {
                    return (
                      <div key={response.id}>
                        <span className="font-bold">Nội dung:</span>
                        <div className="rounded-lg bg-gray-500 my-2 p-2 min-h-[5rem]">{response?.responseMessage}</div>
                        <span className="font-bold">Ảnh đính kèm:</span>
                        <div className="min-h-[10rem] my-2">
                          {response?.attachments?.length == 0 ? (
                            <div className="w-full h-[10rem] flex justify-center items-center">Không có ảnh</div>
                          ) : (
                            <div className="grid grid-cols-5">
                              {response?.attachments?.map((item) => {
                                return <Image key={item.url} src={item.url} width={100} height={130} alt="Image" />
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            )}
          </div>
        </div>
        {!(complaintDetails?.complaintStatus === 'REJECTED' || complaintDetails?.complaintStatus === 'RESOLVED') && (
          <div className="flex w-full justify-around">
            {complaintDetails?.complaintStatus == 'AWAITING_PROVIDER_RESPONSE' ? (
              <Button isActive={false} customCSS="mx-6 px-4 py-1 border-2">
                {'Chấp nhận'}
              </Button>
            ) : (
              <>
                {complaintDetails?.complaintStatus == 'PENDING_PROCESSING' ? (
                  <Button
                    onClick={() => {
                      openComfirmFormHandle('AWAITING_PROVIDER_RESPONSE')
                    }}
                    isActive={false}
                    customCSS="mx-6 px-4 py-1 border-2 bg-green-500 hover:bg-green-600 active:bg-green-700"
                  >
                    Gửi tới nhà cung cấp
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      openComfirmFormHandle('RESOLVED')
                    }}
                    isActive={false}
                    customCSS="mx-6 px-4 py-1 border-2 bg-green-500 hover:bg-green-600 active:bg-green-700"
                  >
                    Chấp nhận
                  </Button>
                )}
              </>
            )}
            {complaintDetails?.complaintStatus == 'AWAITING_PROVIDER_RESPONSE' ? (
              <Button isActive={false} customCSS="mx-6 px-4 py-1 border-2">
                {'Từ chối'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  openComfirmFormHandle('REJECTED')
                }}
                isActive={false}
                customCSS="mx-6 px-4 py-1 border-2 bg-red-500 hover:bg-red-600 active:bg-red-700"
              >
                Từ chối
              </Button>
            )}
          </div>
        )}
      </div>
      {openResolve && (
        <ResolveConfirmModal
          action={action}
          complaintDetails={complaintDetails}
          openConfirm={openResolve}
          closeComfirmFormHandle={closeComfirmFormHandle}
          closeAllModals={closeAllModals}
        />
      )}
    </ModalBase>
  )
}

export default ResolveComplaintModal
