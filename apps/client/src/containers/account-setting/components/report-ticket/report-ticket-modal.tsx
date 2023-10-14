import { CloseSmall, Down } from '@icon-park/react'
import { Input, InputWithAffix, Modal } from '@ume/ui'

import { useState } from 'react'

import ConfirmForm from '~/components/confirm-form/confirmForm'

const ReportTicketModal = () => {
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }
  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Tạo khuyến mãi mới"
          description="Bạn có chấp nhận tạo khuyến mãi mới hay không?"
          onClose={handleClose}
          onOk={() => {}}
        />
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
      {isModalConfirmationVisible && confirmModal}
      <>
        <form>
          <div className="text-white flex flex-col gap-5 p-5">
            <div>
              <label>Người bị tố cáo:</label>
              <div>
                <InputWithAffix
                  placeholder={`Tên người bị tố cáo`}
                  value={''}
                  type="text"
                  onChange={() => {}}
                  className="bg-zinc-800 rounded-xl border border-white border-opacity-30"
                  styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                  iconStyle="border-none"
                  position="right"
                  component={
                    <Down theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" className="cursor-pointer" />
                  }
                />
              </div>
            </div>

            <div>
              <label>Hình ảnh:</label>
              <div></div>
            </div>
            <div>
              <label>Mô tả chi tiết:</label>
              <div></div>
            </div>
          </div>
        </form>
      </>
    </>
  )
}
export default ReportTicketModal
