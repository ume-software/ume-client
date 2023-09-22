import React from 'react'

import { Dropdown } from 'antd'

const FilterDropdown = ({ title, items, handleFilter }) => {
  const handleItemSelected: (typeof items)['onClick'] = (e) => {
    handleFilter(title, e.key)
  }
  return (
    <div>
      <Dropdown
        menu={{
          items,
          onClick: handleItemSelected,
        }}
        placement="bottomLeft"
      >
        <button className="rounded-xl py-2 px-4 bg-umeHeader hover:bg-gray-700 m-2">{title}</button>
      </Dropdown>
    </div>
  )
}

export default FilterDropdown
