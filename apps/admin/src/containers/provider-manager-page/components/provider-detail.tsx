import * as React from 'react'

import { AdminGetProviderResponse } from 'ume-service-openapi'

import ProviderInfo from './provider-infor'

import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

// import PersionalInfo from '../persional-info'

export interface IProviderDetailProps {
  closeFunction: any | undefined
  openValue: boolean
  providerId: any
  providerInfo: any
}

export default function ProviderDetail({ providerInfo, providerId, openValue, closeFunction }: IProviderDetailProps) {
  function getProviderInfo(providerInfo, providerId) {
    if (providerId) {
      const result = providerInfo.filter((rec) => {
        if (rec['id'] === providerId) {
          return rec
        }
      })
      return result[0]
    }
  }

  const providerInfoHeader = getProviderInfo(providerInfo, providerId)
  return (
    <ModalBase
      titleValue="Thông tin tài khoản"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      <ProviderInfo providerInfo={providerInfoHeader} providerId={providerId} />
    </ModalBase>
  )
}
