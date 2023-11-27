import React from 'react'

import dynamic from 'next/dynamic'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const BookingTransaction = () => {
  return <TransactionManagerRender task={'booking'} />
}

export default BookingTransaction
