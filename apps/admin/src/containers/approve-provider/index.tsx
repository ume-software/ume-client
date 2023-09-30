import { useState } from 'react'

import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'

import CommonTable from '~/components/common-table'

import { trpc } from '~/utils/trpc'

type KYCTableProps = {
  id: number
  email: string
  name: string
  phone: string
  address: string
  status: string
  action: string
}

const ApproveProvider = () => {
  const [kycList, setKYCList] = useState<any>([])
  trpc.useQuery(['provider.getListRequestKYC', {}], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setKYCList(data.data)
    },
  })

  const column: ColumnsType<KYCTableProps> = []
  console.log(kycList)
  return (
    <div>
      <Head>
        <title>Admin | KYC</title>
      </Head>
      <div>
        <span className="content-title">List KYC</span>
        {/* <CommonTable /> */}
      </div>
    </div>
  )
}

export default ApproveProvider
