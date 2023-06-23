import { useState } from 'react'

import { Select, Slider, Tooltip } from 'antd'
import type { SelectProps } from 'antd'

import { trpc } from '~/utils/trpc'

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

  let listSkill: any
  const { data: skills, isLoading: loadingSkill, isFetching } = trpc.useQuery(['booking.getListSkill'])
  if (loadingSkill) {
    return <></>
  }
  listSkill = skills?.data?.row

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
            <label htmlFor="gender" className=" font-medium text-2xl">
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
            <label htmlFor="serviceType" className=" font-medium text-2xl">
              Chọn thể loại dịch vụ:{' '}
            </label>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '500px' }}
              size="large"
              placeholder="Select service type"
              optionFilterProp="children"
              filterOption={(input, option) => ((option?.label as string) ?? '').toLowerCase().includes(input)}
              onChange={handleGameTypeChange}
              value={selectedGameType}
              options={listSkill.map((service) => ({
                value: service.id,
                label: service.name,
              }))}
            />
          </div>
          <div className="w-full flex justify-between">
            <label htmlFor="price" className=" font-medium text-2xl">
              Chọn mức giá:{' '}
            </label>
            <Tooltip
              className="bg-[#292734] text-white px-10 py-1 rounded-md hover:bg-gray-500"
              title={tooltipContent}
              placement="bottom"
              trigger="click"
            >
              {priceRange[0] != min || priceRange[1] != max ? (
                <button className="border border-light-50  font-medium text-xl">
                  {priceRange[0]}U - {priceRange[1]}U
                </button>
              ) : (
                <button className=" font-medium text-xl">Khoảng giá</button>
              )}
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-end items-end">
          <button
            type="button"
            className="rounded-xl text-white bg-purple-700 py-2 px-5  font-semibold text-2xl hover:scale-105"
            onClick={handleFilter}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </>
  )
}
