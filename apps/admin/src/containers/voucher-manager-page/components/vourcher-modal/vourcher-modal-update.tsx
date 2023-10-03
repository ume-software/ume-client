import * as React from 'react'

import anhURL from '../../../../../public/anh.jpg'

export interface IVourcherModalUpdateProps {
  closeFunction: any
  openValue: boolean
  vourcherId?: any
}

export default function VourcherModalUpdate({ vourcherId, closeFunction, openValue }: IVourcherModalUpdateProps) {
  const titleValue = 'Thông Tin Khuyến Mãi'
  const avatarUrl = anhURL.src
  const name = 'ABC'
  const vourcherCode = ''
  const issuer = 'ABC'
  const approver = 'ABC'
  const status = 'ABC'
  const createAt = 'ABC'
  const endDate = 'ABC'

  const numVoucher = 'ABC'
  const numUserCanUse = 'ABC'
  const typeVoucher = 'ABC'
  const applyTime = 'ABC'

  const numVoucherInDay = 'ABC'
  const numUserCanUseInDay = 'ABC'
  const minimize = 'ABC'
  const audience = 'ABC'

  const description = 'ABC'
  const content = 'SOME THING WRONG'
  function closeHandle() {
    closeFunction()
  }
  return <div></div>
}
