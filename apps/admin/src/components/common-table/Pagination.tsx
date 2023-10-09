import { Pagination as AntdPagination } from 'antd'

import { LeftArrow, RightArrow } from '../icon-common'

export type PaginationProps = {
  total?: number
  pageSize?: number
  current?: number
  onChange?: (page: number, pageSize?: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ total = 1, pageSize = 10, current, onChange }) => {
  const renderItem = (page, type) => {
    return <div className="text-white">{type === 'prev' ? <LeftArrow /> : type === 'next' ? <RightArrow /> : page}</div>
  }
  return (
    <AntdPagination total={total} pageSize={pageSize} current={current} onChange={onChange} itemRender={renderItem} />
  )
}

export default Pagination
