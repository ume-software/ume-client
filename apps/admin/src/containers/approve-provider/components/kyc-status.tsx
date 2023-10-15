import React from 'react'

type StatusBlockProps = {
  status: string
}
const StatusBlock: React.FC<StatusBlockProps> = ({ status }) => {
  let bgColor = ''
  let textColor = ''

  switch (status) {
    case 'PENDING':
      bgColor = 'bg-blue-500'
      textColor = 'text-white'
      break
    case 'APPROVED':
      bgColor = 'bg-green-500'
      textColor = 'text-white'
      break
    case 'REJECTED':
      bgColor = 'bg-red-500'
      textColor = 'text-white'
      break
    default:
      bgColor = 'bg-gray-500'
      textColor = 'text-gray-800'
      break
  }

  return <div className={`font-bold py-2 px-4 rounded-full w-fit ${bgColor} ${textColor}`}>{status}</div>
}

export default StatusBlock
