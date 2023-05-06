import { ArrowRight, Search } from '@icon-park/react'
import { TextInput } from '@ume/ui'

import React, { useState } from 'react'

import { Drawer, Input } from 'antd'
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
      <div className="grid grid-cols-2 text-white p-6 space-x-5">
        <div className="space-x-5 flex items-center">
          <div className="inline-block rounded-full cursor-pointer bg-gray-700 hover:bg-gray-500 active:bg-gray-400 p-2">
            <ArrowRight onClick={onClose} theme="outline" size="24" fill="#fff" />
          </div>
          <span className="my-auto text-3xl font-bold">Tất cả dịch vụ</span>
        </div>

        <div className="flex items-center self-end">
          <Search
            theme="outline"
            size="32"
            fill="#fff"
            className="rounded-full hover:bg-gray-700 active:bg-gray-500 mr-2 mt-2 p-2"
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
            //     className="rounded-full hover:bg-gray-700 active:bg-gray-500 mr-2 mt-2 p-2"
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
        className="p-2 mr-2 justify-self-end rounded-full cursor-pointer active:bg-gray-200 hover:bg-gray-500"
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
          <div className="mt-8 pb-8 grid grid-cols-3">
            {data.map((category, index) => (
              <div className="inline-block my-8 w-[10rem] ">
                <a href="#" className="flex-col justify-center">
                  <Image
                    className="rounded-lg mb-4 pointer-events-none "
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
