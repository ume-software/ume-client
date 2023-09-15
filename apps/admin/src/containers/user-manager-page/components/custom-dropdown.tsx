import React from 'react'

import { Dropdown } from 'antd'

const CustomDropdown = (props) => {
  console.log(props)

  const items = props.items
  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
      >
        <button className="rounded-xl py-2 px-4 bg-umeHeader hover:bg-gray-700 m-2">{props.title}</button>
      </Dropdown>
    </div>
  )
}

export default CustomDropdown
