import { useState } from 'react'

import Table from '~/components/table/table'

const BookingHistory = () => {
  const [page, setPage] = useState<string>('1')

  return (
    <>
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Lịch sử giao dịch</p>

        <div className="flex flex-col gap-5 mt-10 space-y-10">
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold">Chi tiết giao dịch</p>
            <Table
              dataHeader={['1', '2', '3']}
              dataBody={[
                ['apple', 'banana', 'cherry'],
                ['dog', 'cat', undefined],
                ['elephant', 'lion', 'zebra'],
              ]}
              page={page}
              setPage={setPage}
              limit={'10'}
              totalItem={51}
              contentItem={'giao dịch'}
              watchAction={true}
              onWatch={() => {}}
              editAction={false}
              onEdit={() => {}}
              deleteAction={false}
              onDelete={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default BookingHistory
