import React, { useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

interface IReportDetailsProps {
  closeFunction: any | undefined
  openValue: boolean
  id: string
  mappingReason: any
}

const ReportDetails = ({ id, openValue, closeFunction, mappingReason }: IReportDetailsProps) => {
  const [reportDetails, setReportDetail] = useState<any>()

  const SELECT = ['$all', { reportingUser: ['$all'], reportedUser: ['$all'] }]
  trpc.useQuery(
    [
      'report.getReportDetails',
      {
        id: id.toString(),
        select: JSON.stringify(SELECT),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        setReportDetail(data?.data as any)
      },
      onError(error: any) {
        notification.error({
          message: 'Lỗi khi lấy data',
          description: error.message,
        })
      },
    },
  )
  return (
    <ModalBase
      width={'70%'}
      titleValue="Thông tin báo cáo"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <div className="p-4 text-white">
        {reportDetails && (
          <>
            <div className="w-full flex justify-around px-5 mb-5">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">Người báo cáo</span>
                <div className="flex items-center mt-3">
                  <Image className="rounded-lg" src={reportDetails.reportingUser.avatarUrl} width={100} height={100} />
                  <span className="mx-3 font-bold">{reportDetails.reportingUser.name}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">Người bị báo cáo</span>
                <div className="flex items-center mt-3">
                  <Image className="rounded-lg" src={reportDetails.reportedUser.avatarUrl} width={100} height={100} />
                  <span className="mx-3 font-bold">{reportDetails.reportedUser.name}</span>
                </div>
              </div>
            </div>
            <div className="border-2 my-2"></div>
            <div className="w-full">
              <div>
                <span className="font-bold">Loại báo cáo: </span>
                {mappingReason[reportDetails.reasonType]}
              </div>
              <div>
                <span className="font-bold">Ngày báo cáo: </span>
                {new Date(reportDetails.createdAt).toLocaleDateString('en-GB')}
              </div>
              <span className="font-bold">Lý do: </span>
              <div className="min-h-[5rem] px-2 py-1 mt-1 bg-gray-600 rounded-lg">
                <p>{reportDetails.content}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </ModalBase>
  )
}

export default ReportDetails
