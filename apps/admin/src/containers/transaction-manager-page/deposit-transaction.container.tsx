import { Eyes } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import ViewDepositDetail from './components/deposit-transaction/view-modal'

const DepositTransactionContainer = () => {
  const record = { id: '6b6dd973-0c00-4aef-b2c5-1cdba666026a' }
  const [requestDepositId, setRequestDepositId] = useState(null)
  const [openRequestDepositDetail, setOpenRequestDepositDetail] = useState(false)
  function openDepositDetailHandler(requestId) {
    setRequestDepositId(requestId)
    setOpenRequestDepositDetail(true)
  }
  function closeDepositDetailHandle() {
    setOpenRequestDepositDetail(false)
  }
  return (
    <div>
      <Button
        isActive={false}
        onClick={(e) => {
          openDepositDetailHandler(record.id)
        }}
      >
        <Eyes theme="outline" size="24" fill="#fff" />
      </Button>

      {openRequestDepositDetail && (
        <ViewDepositDetail
          requestId={requestDepositId}
          openValue={openRequestDepositDetail}
          closeFunction={closeDepositDetailHandle}
        />
      )}
    </div>
  )
}

export default DepositTransactionContainer
