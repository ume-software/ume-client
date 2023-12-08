import { ComplainEnum } from '~/enumVariable/enumVariable'

import { useState } from 'react'

import Table from '~/components/table/table'

const ComplainTableHistory = (props: { typeTable }) => {
  const [page, setPage] = useState<string>('1')

  return (
    <>
      <div className="w-full px-10 mt-5">
        <div className="flex flex-col gap-5 mt-10 space-y-2">
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold">Chi tiết khiếu nại</p>
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
              contentItem={'khiếu nại'}
              watchAction={true}
              onWatch={() => {}}
              editAction={false}
              onEdit={() => {}}
              deleteAction={false}
              onDelete={() => {}}
              complainAction={props.typeTable == ComplainEnum.COMPLAIN_TO_ME}
              onComplain={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ComplainTableHistory
