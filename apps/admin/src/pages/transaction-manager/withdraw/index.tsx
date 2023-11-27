import React from 'react'

import dynamic from 'next/dynamic'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const WithdrawTransactionManager = () => {
  return <TransactionManagerRender task={'withdraw'} />
}

export default WithdrawTransactionManager
