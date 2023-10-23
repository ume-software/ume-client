import React from 'react'

import Head from 'next/head'

import { KYCTable } from './components/kyc-list'
import { PendingKYCTable } from './components/pending-kyc-table'

const SwitchKYCManager = ({ selectedTask }) => {
  switch (selectedTask) {
    case 'kyc-pending':
      return <PendingKYCTable />
    case 'kyc-all':
      return <KYCTable />
  }
}

const KYCManagerment = ({ task }) => {
  return (
    <div>
      <Head>
        <title>Admin | KYC Manager</title>
      </Head>
      <div className="h-full pb-10">
        <SwitchKYCManager selectedTask={task} />
      </div>
    </div>
  )
}

export default KYCManagerment
