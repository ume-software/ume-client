import { useId } from 'react'

import Head from 'next/head'

import BookingTransactionContainer from './booking-transaction.container'
import DepositTransactionContainer from './deposit-transaction.container'
import DonationTransactionContainer from './donation-transaction.container'
import WithdrawalTransactionPage from './withdrawal-transaction.container'

const SwitchTransactionManager = ({ selectedTask }) => {
  const id = useId()
  switch (selectedTask) {
    case 'withdrawal':
      return <WithdrawalTransactionPage key={id} />
    case 'deposit':
      return <DepositTransactionContainer />
    case 'booking':
      return <BookingTransactionContainer />
    case 'donation':
      return <DonationTransactionContainer />
  }
}

const TransactionManagerPage = ({ task }) => {
  return (
    <div>
      <Head>
        <title>UME | Transaction Manager</title>
      </Head>
      <div className="h-full pb-10">
        <SwitchTransactionManager selectedTask={task} />
      </div>
    </div>
  )
}

export default TransactionManagerPage
