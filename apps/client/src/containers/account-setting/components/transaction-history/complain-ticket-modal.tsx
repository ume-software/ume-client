import { CloseSmall, Down } from '@icon-park/react'
import { InputWithAffix, Modal } from '@ume/ui'

import { useState } from 'react'

import ConfirmForm from '~/components/confirm-form/confirm-form'

const ComplainTicketModal = ({ isModalComplainVisible, setIsModalComplainVisible }) => {
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }
  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <ConfirmForm
        title="Gửi khiếu nại"
        description="Bạn có chấp nhận gửi khiếu nại này hay không?"
        onClose={handleClose}
        onOk={() => {}}
      />
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const createComplainModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalComplainVisible(false),
    show: isModalComplainVisible,
    title: <p className="text-white">Khiếu nại</p>,
    form: (
      <>
        {isModalConfirmationVisible && confirmModal}
        <form>
          <div className="flex flex-col gap-5 p-5 text-white">
            <div>
              <label>Người bị khiếu nại:</label>
              <div>
                <InputWithAffix
                  placeholder={`Tên người bị khiếu nại`}
                  value={''}
                  type="text"
                  onChange={() => {}}
                  className="border border-white bg-zinc-800 rounded-xl border-opacity-30"
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
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalComplainVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return <>{createComplainModal}</>
}
export default ComplainTicketModal
