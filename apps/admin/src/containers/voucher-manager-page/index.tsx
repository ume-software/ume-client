import React from 'react'

import Head from 'next/head'

import ApproveProviderVoucher from './approve-provider-voucher.container'
import VoucherByAdmin from './voucher-by-admin.container'
import VoucherByProvider from './voucher-by-provider.container'

const VoucherManager = ({ task }) => {
  const SwitchVoucherManager = ({ selectedTask }) => {
    switch (selectedTask) {
      case 'voucher-by-admin':
        return <VoucherByAdmin />
      case 'voucher-by-provider':
        return <VoucherByProvider />
      case 'approve-provider-voucher':
        return <ApproveProviderVoucher />
    }
  }

  return (
    <div>
      <Head>
        <title>Admin | Voucher Manager</title>
      </Head>
      <div className="pb-10 h-full">
        <SwitchVoucherManager selectedTask={task} />
      </div>
    </div>
  )
}

export default VoucherManager
