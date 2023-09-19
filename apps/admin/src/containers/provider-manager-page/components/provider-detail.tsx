import * as React from 'react'

import ProviderInfo from './provider-infor'

import ModalBase from '~/components/modal-base'

// import PersionalInfo from '../persional-info'

export interface IProviderDetailProps {
  closeFunction: any | undefined
  openValue: boolean
  providerId: any
}

export default function ProviderDetail({ providerId, openValue, closeFunction }: IProviderDetailProps) {
  // call API dua theo providerId get provider info by providerId
  const providerInfo = ''
  const [switchTable, setSwitchTable] = React.useState(true)
  return (
    <ModalBase
      titleValue="Thông tin tài khoản"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <ProviderInfo providerInfo={providerInfo} providerId={providerId} />
    </ModalBase>
  )
}
