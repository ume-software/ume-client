import React from 'react'

import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import Pagination, { PaginationProps } from './Pagination'

export type ICommonTableProps = PaginationProps & {
  columns: ColumnsType<any>
  data: any
  loading?: boolean
  onChange?: any
}

const CommonTable = ({ columns, data }: ICommonTableProps) => {
  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={false} size="middle" />
      <div className="flex w-full justify-center pb-[200px] ">
        <Pagination total={0} pageSize={0} current={0} onChange={() => {}} />
      </div>
    </div>
  )
}

export default CommonTable
