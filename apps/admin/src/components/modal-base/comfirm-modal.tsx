import { Button } from '@ume/ui'

import * as React from 'react'

import ModalBase from '.'

export interface IComfirmModalProps {
  closeFunction: any
  openValue: boolean
  isComfirmFunction: any
  titleValue?: any
  children?: React.ReactNode
}

export default function ComfirmModal({
  openValue,
  closeFunction,
  isComfirmFunction,
  titleValue,
  children,
}: IComfirmModalProps) {
  return (
    <>
      <ModalBase closeFunction={closeFunction} openValue={openValue} titleValue={titleValue} width={400}>
        {children}
        <div className="flex justify-center pb-6 mt-6">
          <Button isActive={false} customCSS="mx-6 px-4 py-1 bg-red-500 hover:scale-105" onClick={closeFunction}>
            Hủy
          </Button>
          <Button
            isActive={false}
            customCSS="mx-6 px-4 py-1 border-2 bg-[#7463F0] border-[#7463F0] hover:scale-105"
            onClick={isComfirmFunction}
          >
            Xác nhận
          </Button>
        </div>
      </ModalBase>
    </>
  )
}
