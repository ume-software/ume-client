import React from 'react'

import Head from 'next/head'

import DepositTransactionContainer from './deposit-transaction.container'
import WithdrawTransactionContainer from './withdraw-transaction.container'

const SwitchTransactionManager = ({ selectedTask }) => {
  switch (selectedTask) {
    case 'withdraw':
      return <WithdrawTransactionContainer />
    case 'deposit':
      return <DepositTransactionContainer />
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
