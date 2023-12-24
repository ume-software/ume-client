import React from 'react'

import dynamic from 'next/dynamic'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const DonationTransactionManager = () => {
  return <TransactionManagerRender task={'donation'} />
}

export default DonationTransactionManager
