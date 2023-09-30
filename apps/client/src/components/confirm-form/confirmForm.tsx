import { Button } from '@ume/ui'

import { ReactNode, useState } from 'react'

interface ConfirmFormProps {
  title?: string
  description?: string
  confirmButton?: string | ReactNode
  cancelButton?: string | ReactNode
  isLoading?: boolean
  onClose: () => void
  onOk: (e?: any) => void
}

const ConfirmForm = (props: ConfirmFormProps) => {
  return (
    <>
      <div className="flex flex-col justify-between px-5 pb-5 gap-10">
        <div className="text-xl text-white font-bold pb-3 border-b border-opacity-30">
          {props.title ? props.title : 'Bạn có đồng ý hay không?'}
        </div>
        <div className="text-md text-white">{props.description && props.description}</div>
        <div className="flex justify-around items-center">
          {props.cancelButton ? (
            props.cancelButton
          ) : (
            <Button
              isActive={false}
              isOutlinedButton={true}
              customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
              onClick={props.onClose}
            >
              Hủy
            </Button>
          )}

          {props.confirmButton ? (
            props.confirmButton
          ) : (
            <Button
              customCSS="w-[150px] text-xl p-2 rounded-xl hover:scale-105"
              type="submit"
              isActive={true}
              isOutlinedButton={true}
              isLoading={props.isLoading}
              onClick={(e) => props.onOk(e)}
            >
              Chấp nhận
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
export default ConfirmForm
