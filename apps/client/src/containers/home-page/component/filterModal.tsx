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

export const FilterModal = (props: { handleFilter; data }) => {
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [selectedGameType, setSelectedGameType] = useState<string[]>([])

  const max: number = props.data?.reduce((prevMax, obj) => Math.max(prevMax, obj.cost), -Infinity)
  const min: number = props.data?.reduce((prevMin, obj) => Math.min(prevMin, obj.cost), Infinity)

  const [priceRange, setPriceRange] = useState<[number, number]>([min, max])

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

  const tooltipContent = (
    <Slider className="w-[200px]" range min={min} max={max} defaultValue={priceRange} onChange={handlePriceChange} />
  )

  return (
    <>
      <div className="h-full p-10 flex flex-col justify-between">
        <div className="flex flex-col items-start gap-10">
          <div className="w-full flex justify-between">
            <label htmlFor="gender" className="font-nunito font-medium text-2xl">
              Chọn giới tính:{' '}
            </label>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '500px' }}
              size="large"
              placeholder="Select gender"
              value={selectedGender}
              onChange={handleGenderChange}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </div>
          <div className="w-full flex justify-between">
            <label htmlFor="serviceType" className="font-nunito font-medium text-2xl">
              Chọn thể loại dịch vụ:{' '}
            </label>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '500px' }}
              size="large"
              placeholder="Select service type"
              value={selectedGameType}
              onChange={handleGameTypeChange}
            >
              <Option value="action">Action</Option>
              <Option value="adventure">Adventure</Option>
              <Option value="strategy1">Strategy1</Option>
              <Option value="strategy2">Strategy2</Option>
              <Option value="strategy3">Strategy3</Option>
              <Option value="strategy4">Strategy4</Option>
            </Select>
          </div>
          <div className="w-full flex justify-between">
            <label htmlFor="price" className="font-nunito font-medium text-2xl">
              Chọn mức giá:{' '}
            </label>
            <Tooltip
              className="bg-[#292734] text-white px-10 py-1 rounded-md hover:bg-gray-500"
              title={tooltipContent}
              placement="bottom"
              trigger="click"
            >
              {priceRange[0] != min || priceRange[1] != max ? (
                <button className="border border-light-50 font-nunito font-medium text-xl">
                  {priceRange[0]}U - {priceRange[1]}U
                </button>
              ) : (
                <button className="font-nunito font-medium text-xl">Khoảng giá</button>
              )}
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-end items-end">
          <button
            type="button"
            className="rounded-xl text-white bg-purple-700 py-2 px-5 font-nunito font-semibold text-2xl hover:scale-105"
            onClick={handleFilter}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </>
  )
}
