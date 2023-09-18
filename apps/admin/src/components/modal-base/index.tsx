import * as React from 'react'

import { Modal } from 'antd'

export interface IModalBaseProps {
  closeFunction: any | undefined
  openValue: boolean
  children?: React.ReactNode
  titleValue?: string
  className?: any
  width?: any
}

export default function ModalBase({ titleValue, openValue, closeFunction, width, children }: IModalBaseProps) {
  const title = () => {
    return (
      <div className="bg-[#15151B] pt-4 pb-2">
        <div className="mx-4 text-left text-white border-b-2 border-[#FFFFFF80] border-solid text-2xl">
          {titleValue}
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal title={title()} open={openValue} onCancel={closeFunction} footer={null} width={width ? width : 1000}>
        {children}
      </Modal>
    </>
  )
}
