import { ArrowRight, Search } from '@icon-park/react'
import { Button } from '~/button'
import { InputWithAffix } from '~/input'

import { ReactNode, useState } from 'react'

import { Drawer } from 'antd'

interface DrawerProps {
  drawerTitle?: string
  children?: ReactNode
  isSearch?: boolean
  customOpenBtn?: string
  openBtn?: ReactNode
  textInputStyle?: string
  token?: boolean
  footer?: ReactNode
}
const CustomDrawer = ({
  customOpenBtn,
  openBtn,
  textInputStyle,
  token,
  footer,
  isSearch,
  children,
  drawerTitle,
  ...props
}: DrawerProps) => {
  const [searchText, setSearchText] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const onSearch = () => console.log(searchText)
  const showDrawer = () => {
    if (token == undefined) {
      setDrawerOpen(true)
    } else {
      setDrawerOpen(token.valueOf())
    }
  }
  const onClose = () => {
    setDrawerOpen(false)
  }

  const drawerFooter = () => {
    return (
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center gap-2">
          <span className="my-auto font-bold text-1xl">1 units total 4.75</span>
        </div>

        <div className="flex items-center self-end space-x-4">
          <Button
            onClick={onClose}
            name="register"
            customCSS="bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[120px] text-[15px] "
            type="button"
          >
            Thoát
          </Button>
          <Button
            name="register"
            customCSS="bg-[#7463F0] py-2 rounded-3xl max-h-10 w-[120px] hover:scale-105 text-[15px] "
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
      <div className="flex flex-col gap-5 pt-3 pl-3 text-white">
        <div className="flex items-center space-x-5">
          <div
            className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400"
            onClick={onClose}
            onKeyDown={() => {}}
          >
            <ArrowRight theme="outline" size="30" fill="#fff" />
          </div>
          <span className="my-auto text-2xl font-bold">{drawerTitle}</span>
        </div>

        {isSearch && (
          <div className="flex items-center">
            <InputWithAffix
              placeholder="Tìm kiếm..."
              value={searchText}
              type="text"
              name="categorySearch"
              onChange={(e: any) => setSearchText(e.target.value)}
              position="left"
              component={<Search theme="outline" size="32" fill="#fff" onClick={onSearch} />}
            />
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      <div onClick={showDrawer} className={`w-fit h-fit cursor-pointer ${customOpenBtn}`} onKeyDown={() => {}}>
        {openBtn}
      </div>
      <Drawer
        className="bg-black"
        title={drawerHeader()}
        zIndex={30}
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
export { CustomDrawer }
