import React from 'react'

import { Dropdown } from 'antd'

export interface IFilterDropdownProps {
  id: any | undefined
  title: string
  handleFilter: any
  CustomCss?: string
  items: any
}

const FilterDropdown = ({ CustomCss, id, title, items, handleFilter }: IFilterDropdownProps) => {
  const handleItemSelected: (typeof items)['onClick'] = (e) => {
    handleFilter(id, e.key)
  }
  let filterBtnCss = `px-4 py-2 m-2 rounded-xl truncate bg-umeHeader hover:bg-gray-700 ${CustomCss}`
  return (
    <div className="mr-5">
      <Dropdown
        menu={{
          items,
          onClick: handleItemSelected,
        }}
        placement="bottomLeft"
      >
        <button className={filterBtnCss}>{title}</button>
      </Dropdown>
    </div>
  )
}

export default FilterDropdown
