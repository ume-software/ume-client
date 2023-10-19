import * as React from 'react'

import { Avatar } from 'antd'

export interface IPersionalInfoProps {
  data: any
}

export default function PersionalInfo({ data }: IPersionalInfoProps) {
  return (
    <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
      <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
        <div className="pr-4 rounded-full">
          <Avatar src={data.avatarUrl} size={200} />
        </div>
        <div className="flex flex-col justify-end w-2/5 ">
          <div className="h-12 text-white">
            Tên: <span className="font-bold">{data.name}</span>
          </div>
          <div className="h-12 text-white">
            Ngày tham gia: <span className="font-bold">{new Date(data.createdAt).toLocaleDateString('en-GB')}</span>
          </div>
        </div>
        <div className="flex flex-col justify-end w-2/5 ">
          <div className="h-12 text-white">
            Gmail: <span className="font-bold">{data.email}</span>
          </div>
          <div className="h-12 text-white">
            Số Điện Thoại: <span className="font-bold">{data.phone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
