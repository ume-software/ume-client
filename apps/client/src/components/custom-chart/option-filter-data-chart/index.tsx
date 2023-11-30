import { CSSProperties } from 'react'

interface IOptionFilterDataChart {
  readonly optionsTop?: { name: string; isActivated: boolean; [key: string]: any }[]
  readonly optionsTopItemStype?: CSSProperties
  readonly defaultBackgroundColor?: 'black' | 'black-light'
  readonly handleChangeOptionTop?: (item: { name: string; isActivated: boolean; [key: string]: any }) => void
}

export default function OptionFilterDataChart(props: Readonly<IOptionFilterDataChart>) {
  return (
    <>
      {props.optionsTop?.map((item) => {
        return (
          <button
            key={`filter-${item.name}`}
            className={`leading-2 px-2 py-1 rounded-md min-w-24 mx-1 cursor-pointer box-border transition duration-300 hover:bg-gray-700 ${
              item.isActivated && 'bg-purple-600 text-white'
            }`}
            onClick={() => {
              if (props.handleChangeOptionTop) props.handleChangeOptionTop(item)
            }}
            style={props.optionsTopItemStype}
          >
            {item.name}
          </button>
        )
      })}
    </>
  )
}
