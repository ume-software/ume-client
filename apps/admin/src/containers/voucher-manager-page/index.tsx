import { Search } from '@icon-park/react'
import { Input } from '@ume/ui'

import React from 'react'

import Head from 'next/head'

import VoucherTable from './components/voucher-table'
import VoucherByAdmin from './voucher-by-admin.container'

const VoucherManager = ({ task }) => {
  const SwitchVoucherManager = ({ selectedTask }) => {
    console.log(selectedTask)

    switch (selectedTask) {
      case 'voucher-by-admin':
        return <VoucherByAdmin />
      case 'voucher-by-provider':
        return <>voucher-by-provider</>
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
