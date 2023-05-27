import { ArrowRight, Search } from '@icon-park/react'
import { Button, TextInput } from '@ume/ui'

import React, { ReactNode, useState } from 'react'

import { Drawer } from 'antd'

interface DrawerProps {
  drawerTitle?: string
  children?: any
  isSearch?: boolean
  customOpenBtn?: string
  openBtn?: ReactNode
  footer?: ReactNode
}
export const CustomDrawer = ({
  customOpenBtn,
  openBtn,
  footer,
  isSearch,
  children,
  drawerTitle,
  ...props
}: DrawerProps) => {
  const [searchTex, setSearchText] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const onSearch = () => console.log(searchTex)
  console.log(open)
  const showDrawer = () => {
    setDrawerOpen(true)
  }
  const onClose = () => {
    setDrawerOpen(false)
  }
  const drawerFooter = () => {
    return (
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center gap-2">
          <span className="my-auto text-1xl font-bold">1 units total 4.75</span>
        </div>

        <div className="space-x-4 flex items-center self-end">
          <Button
            onClick={onClose}
            name="register"
            customCSS="bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[120px] text-[15px] font-nunito"
            type="button"
          >
            Thoát
          </Button>
          <Button
            name="register"
            customCSS="bg-[#7463F0] py-2 rounded-3xl max-h-10 w-[120px] hover:scale-105 text-[15px] font-nunito"
            type="button"
          >
            Thuê
          </Button>
        </div>
      </div>
    )
  }
  const drawerHeader = () => {
    return (
      <div className="grid grid-cols-2 p-6 space-x-5 text-white">
        <div className="flex items-center space-x-5">
          <div className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
            <ArrowRight onClick={onClose} theme="outline" size="24" fill="#fff" />
          </div>
          <span className="my-auto text-3xl font-bold">{drawerTitle}</span>
        </div>

        {isSearch && (
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
              type="text"
              name="categorySearch"
              onChange={(e) => setSearchText(e.target.value)}
              className="text-black w-[11rem]"
            />
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      <div onClick={showDrawer} className={customOpenBtn}>
        {openBtn}
      </div>
      <Drawer
        className="bg-black"
        title={drawerHeader()}
        // size="large"
        placement="right"
        footer={footer && drawerFooter()}
        closable={false}
        onClose={onClose}
        open={drawerOpen}
      >
        {children}
      </Drawer>
    </>
  )
}
