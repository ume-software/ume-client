import { CSSProperties } from 'react'

interface IOptionFilterDataChart {
  optionsTop?: { name: string; isActivated: boolean; [key: string]: any }[]
  optionsTopItemStype?: CSSProperties
  defaultBackgroundColor?: 'black' | 'black-light'
  handleChangeOptionTop?: ((item: { name: string; isActivated: boolean; [key: string]: any }) => void) | undefined
}

export default function OptionFilterDataChart(props: IOptionFilterDataChart) {
  return (
    <>
      {props.optionsTop?.map((item, index) => {
        return (
          <button
            key={index}
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
