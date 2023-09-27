import React from 'react'

import { Dropdown } from 'antd'

const FilterDropdown = ({ id, title, items, handleFilter }) => {
  const handleItemSelected: (typeof items)['onClick'] = (e) => {
    handleFilter(id, e.key)
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
        <button className="px-4 py-2 m-2 rounded-xl bg-umeHeader hover:bg-gray-700">{title}</button>
      </Dropdown>
    </div>
  )
}

export default FilterDropdown
