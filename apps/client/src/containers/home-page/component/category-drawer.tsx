import { ArrowRight, Search } from '@icon-park/react'
import { TextInput } from '@ume/ui'

import React, { useState } from 'react'

import { Drawer } from 'antd'
import Image from 'next/image'

function CategoryDrawer({ data }) {
  console.log(data)
  const [searchTex, setSearchText] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const showDrawer = () => {
    setDrawerOpen(true)
  }
  const onClose = () => {
    setDrawerOpen(false)
  }
  const onSearch = () => console.log(searchTex)
  const drawerHeader = () => {
    return (
      <div className="grid grid-cols-2 p-6 space-x-5 text-white">
        <div className="flex items-center space-x-5">
          <div className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
            <ArrowRight onClick={onClose} theme="outline" size="40" fill="#fff" />
          </div>
          <span className="my-auto text-3xl font-bold">Tất cả dịch vụ</span>
        </div>

        <div className="flex items-center self-end">
          <Search
            theme="outline"
            size="32"
            fill="#fff"
            className="p-2 mt-2 mr-2 rounded-full hover:bg-gray-700 active:bg-gray-500"
            onClick={onSearch}
          />
          <TextInput
            placeholder="Tìm kiếm..."
            value={searchTex}
            // icon={
            //   <Search
            //     theme="outline"
            //     size="32"
            //     fill="#fff"
            //     className="p-2 mt-2 mr-2 rounded-full hover:bg-gray-700 active:bg-gray-500"
            //     onClick={onSearch}
            //   />
            // }
            type="text"
            name="categorySearch"
            onChange={(e) => setSearchText(e.target.value)}
            className="text-black w-[11rem]"
          />
        </div>
      </div>
    )
  }
  return (
    <>
      <div
        onClick={showDrawer}
        className="p-2 mr-2 rounded-full cursor-pointer justify-self-end active:bg-gray-200 hover:bg-gray-500"
      >
        Tất cả dịch vụ
      </div>

      <Drawer
        className="bg-black"
        title={drawerHeader()}
        size="large"
        placement="right"
        closable={false}
        onClose={onClose}
        open={drawerOpen}
      >
        <div className="w-full px-6">
          <div className="grid grid-cols-3 pb-8 mt-8">
            {data.map((category, index) => (
              <div className="inline-block my-8 w-[10rem] ">
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
      </Drawer>
    </>
  )
}

export default CategoryDrawer
