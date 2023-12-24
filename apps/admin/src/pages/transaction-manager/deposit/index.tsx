import React from 'react'

import dynamic from 'next/dynamic'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const DepositTransactionManager = () => {
  return <TransactionManagerRender task={'deposit'} />
}

export default DepositTransactionManager
