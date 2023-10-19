import { Menu, Transition } from '@headlessui/react'
import { Down } from '@icon-park/react'

import { Fragment, ReactNode } from 'react'

interface MenuForVoucherProps {
  buttonTitle: ReactNode
  buttonCustomCss?: string
  isDisplayDownButton?: boolean
  datas: { key: string | number; label: string; [key: string]: any }[]
  styleData?: string
  onChange: (e: any) => void
  chooseData: { key: string | number; label: string; [key: string]: any }[]
}

const MenuForVoucher = ({
  buttonTitle,
  buttonCustomCss,
  isDisplayDownButton,
  datas,
  styleData,
  onChange,
  chooseData,
}: MenuForVoucherProps) => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <button
            className={`flex justify-between items-center gap-3 ${
              buttonCustomCss ? buttonCustomCss : 'min-w-[110px]'
            } text-lg font-semibold px-3 py-2 hover:bg-gray-700 rounded-xl`}
            type="button"
          >
            {buttonTitle + ''}
            {isDisplayDownButton && <Down theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />}
          </button>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-400"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-400"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 left-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[200px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
            style={{ zIndex: 5 }}
          >
            <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
              {datas.map((data, index) => (
                <div
                  className={`flex gap-5 items-center ${styleData} ${
                    chooseData.find((dataChoose) => dataChoose.key == data.key) && 'bg-gray-500'
                  } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                  key={index}
                  onClick={() => onChange(data)}
                >
                  <p className="text-md font-semibold">{data.label}</p>
                </div>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
export default MenuForVoucher
