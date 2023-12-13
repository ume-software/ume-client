import React from 'react'

import { Tooltip } from 'antd'

interface TimeUnitProps {
  unit: number
  setUnit: (amount: number) => void
}

export const TimeUnit = ({ unit, setUnit }: TimeUnitProps) => {
  return (
    <div className="flex flex-row gap-4">
      <Tooltip title=" Chu kì 3 tháng" placement="top">
        <div
          onClick={() => setUnit(3)}
          className={`rounded-[10px] w-10 h-10 text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            unit === 3 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          3
        </div>
      </Tooltip>
      <Tooltip title="Chu kì 6 tháng" placement="top">
        <div
          onClick={() => setUnit(6)}
          className={`rounded-[10px] w-10 h-10 text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            unit === 6 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          6
        </div>
      </Tooltip>
      <Tooltip title=" Chu kì 12 tháng" placement="top">
        <div
          onClick={() => setUnit(12)}
          className={`rounded-[10px] w-10 h-10 text-2xl font-medium text-white text-center flex flex-cols items-center justify-center ${
            unit === 12 ? 'bg-[#6bd86d]' : 'bg-[#292734]'
          } cursor-pointer`}
        >
          12
        </div>
      </Tooltip>
    </div>
  )
}
