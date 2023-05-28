import { useState } from 'react'

import { Select, Slider, Tooltip } from 'antd'
import type { SelectProps } from 'antd'

const { Option } = Select

const selectStyles = {
  width: '200px',
  backgroundColor: '#F3F4F6',
  borderRadius: '4px',
  padding: '8px',
}

export const FilterModal = (props: { handleFilter }) => {
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [selectedGameType, setSelectedGameType] = useState<string[]>([])

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

  const handleGenderChange = (value: string[]) => {
    setSelectedGender(value)
  }

  const handleGameTypeChange = (value: string[]) => {
    setSelectedGameType(value)
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  const handleFilter = () => {
    const filterData = { Gender: selectedGender, GameType: selectedGameType, PriceRange: priceRange }
    props.handleFilter(filterData)
  }

  const tooltipContent = <Slider className="w-[200px]" range defaultValue={[0, 100]} onChange={handlePriceChange} />

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '180px' }}
              placeholder="Select gender"
              value={selectedGender}
              onChange={handleGenderChange}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </div>
          <div>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '200px' }}
              placeholder="Select game type"
              value={selectedGameType}
              onChange={handleGameTypeChange}
            >
              <Option value="action">Action</Option>
              <Option value="adventure">Adventure</Option>
              <Option value="strategy">Strategy</Option>
            </Select>
          </div>
          <div>
            <Tooltip
              className="bg-[#292734] text-white px-3 py-1 rounded-md hover:bg-gray-500"
              title={tooltipContent}
              placement="bottom"
              trigger="click"
            >
              {priceRange[0] != 0 || priceRange[1] != 100 ? (
                <button className="border border-light-50">
                  {priceRange[0]}coin - {priceRange[1]}coin
                </button>
              ) : (
                <button>Khoảng giá</button>
              )}
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-xl text-white bg-purple-700 py-1 px-4 font-nunito font-semibold text-lg hover:scale-105"
            onClick={handleFilter}
          >
            Lọc
          </button>
        </div>
      </div>
    </>
  )
}
