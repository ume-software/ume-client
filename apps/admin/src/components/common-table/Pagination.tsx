import { Left, Right } from '@icon-park/react'

import { Pagination as AntdPagination } from 'antd'

export type PaginationProps = {
  total?: number
  pageSize?: number
  current?: number
  page?: number
  setPage?: (page: any) => void
}

const Pagination: React.FC<PaginationProps> = ({ total = 1, pageSize = 10, page = 1, setPage }) => {
  const handleChangePage = (page) => {
    if (setPage) setPage(page)
  }
  const renderItem = (page, type) => {
    return (
      <div className="text-white">
        {type == 'prev' ? (
          <div className="mt-1.5 ml-1">
            <Left theme="outline" size="24" fill="#fff" />
          </div>
        ) : type == 'next' ? (
          <div className="mt-1.5">
            <Right theme="outline" size="24" fill="#fff" />
          </div>
        ) : (
          page
        )}
      </div>
    )
  }
  return (
    <AntdPagination
      total={total}
      pageSize={pageSize}
      current={page}
      onChange={(page) => {
        handleChangePage && handleChangePage(page)
      }}
      itemRender={renderItem}
    />
  )
}

export default Pagination
