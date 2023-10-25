import React from 'react'

type StatusBlockProps = {
  status: string
}
const StatusBlock: React.FC<StatusBlockProps> = ({ status }) => {
  let bgColor = ''
  let textColor = ''
  let statusText = ''

  switch (status) {
    case 'PENDING':
      bgColor = 'bg-blue-500'
      textColor = 'text-white'
      statusText = 'Đang chờ'
      break
    case 'APPROVED':
      bgColor = 'bg-green-500'
      textColor = 'text-white'
      statusText = 'Đã duyệt'
      break
    case 'REJECTED':
      bgColor = 'bg-red-500'
      textColor = 'text-white'
      statusText = 'Đã từ chối'
      break
    default:
      bgColor = 'bg-gray-500'
      textColor = 'text-gray-800'
      statusText = 'Không xác định'
      break
  }

  return <div className={`font-bold py-2 px-4 rounded-full w-fit ${bgColor} ${textColor}`}>{statusText}</div>
}

export default StatusBlock
