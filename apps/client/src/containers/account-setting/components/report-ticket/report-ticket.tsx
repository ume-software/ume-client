import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import { useState } from 'react'

import ReportTicketModal from './report-ticket-modal'

import Table from '~/components/table/table'

const ReportTicket = () => {
  const [page, setPage] = useState<string>('1')
  const [isModalReportVisible, setIsModalReportVisible] = useState<boolean>(false)

  const handleClose = () => {
    setIsModalReportVisible(false)
  }
  const createReportModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalReportVisible,
    title: <p className="text-white">Tố cáo</p>,
    form: (
      <>
        <ReportTicketModal />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })
  return (
    <>
      {isModalReportVisible && createReportModal}
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Tố cáo</p>

        <div className="flex flex-col gap-5 mt-10 space-y-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold">Chi tiết tố cáo</p>
              <Button
                isActive={true}
                isOutlinedButton={true}
                customCSS="py-2 px-7 rounded-xl hover:scale-105"
                type="button"
                onClick={() => setIsModalReportVisible(true)}
              >
                Tạo tố cáo
              </Button>
            </div>
            <Table
              dataHeader={['1', '2', '3']}
              dataBody={[
                ['apple', 'banana', 'cherry'],
                ['dog', 'cat', undefined],
                ['elephant', 'lion', 'zebra'],
              ]}
              page={page}
              setPage={setPage}
              limit={'5'}
              totalItem={50}
              contentItem={'tố cáo'}
              watchAction={true}
              onWatch={() => {}}
              editAction={true}
              onEdit={() => {}}
              deleteAction={false}
              onDelete={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ReportTicket
