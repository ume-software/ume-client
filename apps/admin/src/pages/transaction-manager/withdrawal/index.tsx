import React from 'react'

import dynamic from 'next/dynamic'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const WithdrawalTransactionManager = () => {
  return <TransactionManagerRender task={'withdrawal'} />
}

export default WithdrawalTransactionManager
