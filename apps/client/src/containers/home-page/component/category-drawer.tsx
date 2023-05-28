import { ArrowRight, Search } from '@icon-park/react'
import { CustomDrawer, TextInput } from '@ume/ui'

import React, { useState } from 'react'

import Image from 'next/image'

function CategoryDrawer({ data }) {
  return (
    <>
      <CustomDrawer
        drawerTitle="Tất cả dịch vụ"
        customOpenBtn="p-2 mr-2 rounded-full cursor-pointer justify-self-end active:bg-gray-200 hover:bg-gray-500"
        openBtn={'Tất cả dịch vụ'}
      >
        <div className="w-full h-full px-6 overflow-y-auto">
          <div className="grid grid-cols-4 place-items-center pb-8 mt-8 ">
            {data.map((category, index) => (
              <div key={index} className="inline-block my-8 w-[10rem]">
                <a href="#" className="flex-col justify-center">
                  <Image
                    className="mb-4 rounded-lg pointer-events-none "
                    src={category.cateImg.src}
                    alt={category.cateName}
                    width={170}
                    height={250}
                  />
                  <span className="font-bold">{category.cateName}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </CustomDrawer>
    </>
  )
}

export default CategoryDrawer
