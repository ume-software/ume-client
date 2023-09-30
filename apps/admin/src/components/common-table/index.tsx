import React from 'react'

import { Table } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'

export interface ICommonTableProps {
  columns: ColumnsType<any>
  data: any
  loading: boolean
  pagination: number
  onChange: any
}
const CommonTable = ({ columns, data, pagination = 10 }: ICommonTableProps) => {
  return <Table dataSource={data} columns={columns} pagination={{ pageSize: pagination }} size="middle" />
}

export default CommonTable
