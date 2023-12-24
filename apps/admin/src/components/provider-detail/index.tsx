import * as React from 'react'

import ModalBase from '../modal-base'
import PersionalInfo from '../persional-info'

export interface IProviderDetailProps {
  closeFunction: any
  openValue: boolean
  providerId: any
}

export default function ProviderDetail({ providerId, openValue, closeFunction }: IProviderDetailProps) {
  const data = ''
  return (
    <ModalBase
      titleValue="Thông tin tài khoản"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <PersionalInfo data={data} />
    </ModalBase>
  )
}
