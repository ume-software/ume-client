import { useId } from 'react'

import Head from 'next/head'

import DepositTransactionPage from './deposit-transaction'
import WithdrawTransactionPage from './withdraw-transaction'

const SwitchTransactionManager = ({ selectedTask }) => {
  const id = useId()
  switch (selectedTask) {
    case 'withdraw':
      return <WithdrawTransactionPage key={id} />
    case 'deposit':
      return <DepositTransactionPage key={id} />
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
