import { ArrowRight, Search } from '@icon-park/react'
import { CustomDrawer, TextInput } from '@ume/ui'

import React, { useContext } from 'react'

import Image from 'next/image'

import { DrawerContext } from '~/components/layouts/app-layout/app-layout'

function CategoryDrawer({ data }) {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)

  const handleAllServiceOpen = () => {
    setChildrenDrawer(
      <div className="w-full h-full px-6 overflow-y-auto">
        <div className="grid grid-cols-4 pb-8 mt-8 place-items-center ">
          {data.map((category, index) => (
            <div tabIndex={index} key={category.id} className="inline-block my-8 w-[10rem] ">
              <a href="#" className="flex-col justify-center">
                <Image
                  className="mb-4 rounded-lg pointer-events-none "
                  src={category.imageUrl}
                  alt={category.name}
                  width={170}
                  key={category.id}
                  height={250}
                />
                <span className="font-bold">{category.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>,
    )
  }
  return (
    <>
      <CustomDrawer
        drawerTitle="Tất cả dịch vụ"
        customOpenBtn="p-2 mr-2 rounded-full cursor-pointer justify-self-end active:bg-gray-200 hover:bg-gray-500"
        openBtn={<div onClick={handleAllServiceOpen}>Tất cả dịch vụ</div>}
      >
        {childrenDrawer}
      </CustomDrawer>
    </>
  )
}

export default CategoryDrawer
