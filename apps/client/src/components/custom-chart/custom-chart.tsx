import { Fragment } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import OptionFilterDataChart from './OptionFilterDataChart'

export interface ICustomChart {
  typeChart: string
  series: Highcharts.SeriesOptionsType[]
  category?: string[]
  title?: object
  titleStyle?: object
  tooltip?: object
  customLegend?: object
  optionsTop?: {
    name: string
    durationYear: number
    durationPeriod: number
    isActivated: boolean
  }[]
  handleChangeOptionTop?: (item: {
    name: string
    durationYear?: number
    durationPeriod?: number
    isActivated: boolean
  }) => void
  xAxisFormat?: string
  optionCustomNode?: any
  handleChangeOptionCustom?: any
  xAxis?: object
  yAxis?: object
  yAxisOther?: object[]
  plotOptions?: object
  htmlAppened?: any
  chart?: object
}

export type ISelectors = {
  value: string
  durationYear?: number
  durationPeriod?: number
  selected: boolean
}

export const CustomChart = ({
  typeChart,
  series,
  category,
  title,
  tooltip,
  customLegend,
  optionsTop,
  htmlAppened,
  optionCustomNode,
  handleChangeOptionCustom,
  chart,
  plotOptions,
  xAxis,
  yAxis,
  yAxisOther,
  titleStyle,
  xAxisFormat,
  handleChangeOptionTop,
}: ICustomChart) => {
  const options = {
    chart: {
      type: typeChart,
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
      backgroundColor: '#292734',
      height: 450,
      borderRadius: 16,
      spacingBottom: 20,
      spacingRight: 20,
      spacingLeft: 20,
      spacingTop: !!title ? 24 : 120,
      ...chart,
    },
    title: {
      margin: 50,
      align: 'left',
      style: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontFamily: 'Roboto',
        fontSize: '14px',
        lineHeight: '20px',
        ...titleStyle,
      },
      ...title,
    },
    xAxis: {
      categories: category,
      zeroCrossing: true,
      labels: {
        overflow: 'justify',
        style: {
          color: '#FFFFFF',
          fontSize: '1.2rem',
          fontFamily: 'Roboto',
          lineHeight: '2rem',
        },
        format: xAxisFormat || '{value: %m/%Y}',
      },
      lineWidth: 1,
      tickLength: 0,
      type: 'datetime',
      dateTimeLableFormats: {
        day: '%e. %b',
        hour: '%H',
        month: "%b '%Y",
        year: '%Y',
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: '#FAFAFA',
          zIndex: 1,
          dashStyle: 'Solid',
        },
      ],
      ...xAxis,
    },
    yAxis: [
      {
        title: {
          text: '',
          margin: 0,
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
        labels: {
          overflow: 'justify',
          style: {
            color: '#FFFFFF',
            fontSize: '1.2rem',
            fontFamily: 'Roboto',
            fontWeight: 500,
            lineHeight: 2,
          },
          formatter: function () {
            return +((this as any).value | 0).toFixed(2)
          },
        },
        ...yAxis,
      },
      ...(yAxisOther || []),
    ],
    tooltip: {
      ...tooltip,
      positioner: function (labelWidth: any, labelHeight: any, point: any) {
        const { chart } = this as any
        const { chartWidth } = chart
        let { plotX, plotY } = point
        // plotY += plotY <= 30 ? 50 : 0;
        // plotY = plotY > labelHeight ? labelHeight - 100 : plotY
        plotY = plotY <= 70 ? 70 : plotY
        if (labelWidth + plotX > chartWidth) {
          plotX = chartWidth - labelWidth - 10
        } else if (plotX < 0) {
          plotX = 10
        }
        return {
          x: plotX,
          y: plotY,
        }
      },
      zIndex: 100000,
    },
    plotOptions: {
      spline: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        marker: {
          enabled: false,
        },
      },
      series: {
        hideEmptySeries: true,
      },
      ...plotOptions,
    },

    legend: {
      useHTML: true,
      symbolPadding: -3,
      symbolHeight: 0.001,
      symbolWidth: 0.001,
      symbolRadius: 0.001,
      itemDistance: 24,
      itemMarginBottom: 5,
      itemMarginTop: 5,
      itemHoverStyle: {
        color: '#fff',
      },
      itemStyle: {
        color: '#f5f5f5',
        fontSize: '1.2rem',
      },
      labelFormatter: function () {
        const point: any = this
        const isVisible = point?.visible
        const color = isVisible ? point.color : 'rgb(78 78 78)'

        return `<div style="display: flex; justify-content: center; align-items: end;">
              <div style="margin-right:5px;">
                <div style="width: 25px; height: 25px; border-radius: 3px; background-color:${color};"></div>
              </div>
              <span style="color: '#FFFFF'; font-weight: 400; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"> ${point.name}</span>
          </div>`
      },
      ...customLegend,
    },
    series: series,
    navigation: {
      menuItemStyle: {
        fontSize: '1rem',
      },
    },
    credits: {
      enabled: false,
    },
  }

  return (
    <Fragment>
      <div
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        {!!optionsTop?.length && (
          <div className={`absolute top-5 right-5 bg-[#15151B] p-1 rounded-md z-2`}>
            {<OptionFilterDataChart handleChangeOptionTop={handleChangeOptionTop} optionsTop={optionsTop} />}
          </div>
        )}
        {!!htmlAppened && htmlAppened}
        {optionCustomNode}
        <div className={`relative rounded-xl shadow-md`}>
          <HighchartsReact
            style={{
              width: '100%',
              position: 'inherit !important',
            }}
            className={`relative rounded-xl shadow-md text-white`}
            highcharts={Highcharts}
            options={options}
            optionTop={optionsTop}
            handleChangeOptionTop={handleChangeOptionTop}
          />
        </div>
      </div>
    </Fragment>
  )
}
