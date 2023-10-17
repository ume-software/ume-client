import React, { useEffect, useState } from 'react'

import { CustomChart } from '~/components/custom-chart'

const ColumnChart = () => {
  const [dataCharts, setDataCharts] = useState<any[]>([
    {
      name: 'Chi hàng tháng',
      data: [57, 23, 84, 6, 42],
      color: '#F73164',
    },
    {
      name: 'Thu hàng tháng',
      data: [57, 23, 84, 6, 42],
      color: '#6F4EF2',
    },
  ])
  const [optionsTop, setToptionsTop] = useState([
    {
      key: '1M',
      name: '1 tháng',
      durationYear: 1,
      durationPeriod: 0,
      isActivated: true,
      pointInterval: 1, //3,
      pointIntervalUnit: 'month',
    },
    {
      key: '3M',
      name: '3 tháng',
      durationYear: 3,
      durationPeriod: 0,
      isActivated: false,
      pointInterval: 1, //3,
      pointIntervalUnit: 'month',
    },
    {
      key: '5Y',
      name: '5 năm',
      durationYear: 5,
      durationPeriod: 0,
      isActivated: false,
      pointInterval: 1, //6,
      pointIntervalUnit: 'month',
    },
    {
      key: 'All',
      name: 'Tất cả',
      durationYear: 10,
      durationPeriod: 0,
      isActivated: false,
      pointInterval: 1, //12,
      pointIntervalUnit: 'month',
    },
  ])

  const handleChangeOptionTop = (item: {
    name: string
    durationYear?: number
    durationPeriod?: number
    isActivated: boolean
  }) => {
    const newOptionsTop = optionsTop.map((option) => {
      option.isActivated = false
      if (option.name == item.name) {
        option.isActivated = true
      }
      return option
    })
    setToptionsTop([...newOptionsTop])
  }

  const tooltip = {
    formatter: function () {
      var currentPoint: any = { ...this },
        stackValues: any = `<span  style="font-size:14px"><b>Tháng</b></span><br/>`
      currentPoint.points.forEach(function (point: any) {
        const value = point.y?.valueOf() || 0

        stackValues +=
          `<div style={{display:"flex"}}>` +
          `<span style="font-size:30px;color:${point.color}">` +
          '\u25A0</span> ' +
          `<span style="font-size:14px">${point?.series?.name}(Triệu VND): </span>
                        <span style="font-size:14px; font-weight: 500"></span>
                    </div>`
      })
      return stackValues
    },
    shared: true,
    useHTML: true,
    backgroundColor: 'rgba(85, 0, 98, 0.45)',
    borderColor: 'none',
    borderRadius: 15,
    padding: 15,
    style: {
      color: '#fff',
    },
  }

  const customLegend = {
    enabled: true,
    // ...chartLegend
  }

  return (
    <div className="w-full">
      <CustomChart
        typeChart="column"
        plotOptions={{
          column: {
            dataLabels: {
              enabled: false,
            },
            borderWidth: 0,
            borderColor: 'none',
            groupPadding: 0.2,
            // borderRadius: 4,
            maxPointWidth: 50,
          },
        }}
        series={dataCharts}
        chart={{ height: 450 }}
        title={{
          text: 'Chi - Thu theo tháng',
        }}
        titleStyle={{
          fontWeight: 500,
          fontSize: '1.4rem',
        }}
        tooltip={tooltip}
        customLegend={customLegend}
        handleChangeOptionTop={handleChangeOptionTop}
        optionsTop={optionsTop}
        yAxis={{
          labels: {
            overflow: 'justify',
            style: {
              color: '#FFFFFF',
              fontSize: '1.2rem',
              fontFamily: 'Roboto',
            },
            formatter: function () {
              return (this as any).value
            },
          },
        }}
        xAxis={{ plotLines: [] }}
      />
    </div>
  )
}

export default ColumnChart
