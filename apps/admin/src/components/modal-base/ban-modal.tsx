import { Button, TextArea } from '@ume/ui'

import * as React from 'react'

import ModalBase from '.'
import ComfirmModal from './comfirm-modal'

export interface IBanModalProps {
  providerId?: any
  name?: any
  closeFunction: any | undefined
  openValue: boolean
  className?: any
}

export default function BanModal({ providerId, name, openValue, closeFunction }: IBanModalProps) {
  const titleValue = `Chặn [${name}]`
  const [content, setContent] = React.useState<string>('')
  const [openConfirm, setOpenConfirm] = React.useState(false)
  function handleBanProvider() {
    //call API ban provider
    console.log(providerId)
    console.log(content)
    setOpenConfirm(false)
    closeHandle()
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
  }

  function closeHandle() {
    closeFunction()
    setContent('')
  }
  function createHandle() {
    setOpenConfirm(true)
  }

  return (
    <>
      <ModalBase titleValue={titleValue} closeFunction={closeHandle} openValue={openValue} width={600}>
        <div className="flex flex-col gap-3 mx-4 mt-4">
          <label className="text-white">Lý do chặn:</label>
          <TextArea
            className="bg-[#413F4D] border-2 text-white"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-center mt-6">
            <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-105" onClick={closeHandle}>
              Hủy
            </Button>
            <Button
              customCSS="mx-6 px-4 py-1 border-2 bg-[#7463F0] border-[#7463F0] hover:scale-105"
              onClick={createHandle}
            >
              Chặn
            </Button>
          </div>
        </div>
      </ModalBase>
      <ComfirmModal
        closeFunction={closeComfirmFormHandle}
        openValue={openConfirm}
        isComfirmFunction={handleBanProvider}
        titleValue="Xác Nhận Chặn"
      >
        {content === '' && <div className="mx-4 text-yellow-500">Lý do chặn trống</div>}
      </ComfirmModal>
    </>
  )
}