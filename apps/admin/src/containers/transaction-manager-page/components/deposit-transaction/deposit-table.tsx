import React from 'react'

const tableDataMapping = (data?) => {
  const list: {}[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        ...item,
      }
      list.push(rowItem)
    })
  }
  return list
}
const DepositTable = (data) => {
  const tableList = tableDataMapping(data)
  return <div>DepositTable</div>
}

export default DepositTable
