import React from 'react'

import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import Pagination, { PaginationProps } from './pagination'

export type ICommonTableProps = PaginationProps & {
  columns: ColumnsType<any>
  data: any
  loading?: boolean
  page?: number
  locate?: any
}

const CommonTable = ({ columns, data, total, pageSize, page, loading, setPage, locate }: ICommonTableProps) => {
  return (
    <div>
      <Table locale={locate} dataSource={data} columns={columns} pagination={false} size="middle" loading={loading} />
      <div className="flex justify-center w-full">
        <Pagination total={total} pageSize={pageSize} current={page} setPage={setPage} page={page} />
      </div>
    </div>
  )
}

export default CommonTable
