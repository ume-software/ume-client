import { Button } from '@ume/ui'

import { ReactNode } from 'react'

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
    <div className="flex flex-col justify-between gap-10 px-5 pb-5">
      <div className="pb-3 text-xl font-bold text-white border-b border-opacity-30">
        {props.title ? props.title : 'Bạn có đồng ý hay không?'}
      </div>
      <div className="text-white text-md">{props?.description}</div>
      <div className="flex items-center justify-around">
        {props.cancelButton ? (
          props.cancelButton
        ) : (
          <Button
            isActive={false}
            isOutlinedButton={true}
            customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
            onClick={() => {
              !props.isLoading && props.onClose()
            }}
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
            onClick={(e) => {
              !props.isLoading && props.onOk(e)
            }}
          >
            Chấp nhận
          </Button>
        )}
      </div>
    </div>
  )
}
export default ConfirmForm
