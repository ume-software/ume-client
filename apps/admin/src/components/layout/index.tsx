import useWindowDimensions from '~/hooks/windownDimensions'

import { PropsWithChildren, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Header } from '../header'
import Sidebar from '../sidebar'

interface ILayout {
  children: React.ReactNode
}

type IContentRender = PropsWithChildren & {
  width: number
  openSideBar: boolean
}

const ContentRender = ({ width, openSideBar, children }: IContentRender) => {
  if (width >= 900) {
    if (width <= 1919 && width >= 1707 && openSideBar) {
      return <div className={`pl-[19%] mt-16 w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white`}>{children}</div>
    } else if (((width >= 1200 && width <= 1537) || width <= 1720 || width > 1920) && openSideBar) {
      return <div className={`pl-[21%] mt-16 w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white`}>{children}</div>
    } else if (width >= 1800 && width <= 1920 && openSideBar) {
      return <div className={`pl-[17%] mt-16 w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white`}>{children}</div>
    } else {
      return <div className={`pl-[9%] mt-16 w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white`}>{children}</div>
    }
  } else
    return (
      <div className={` mt-16 w-full p-[2%] py-5 min-h-screen bg-[#15151b] text-white flex justify-center`}>
        {children}
      </div>
    )
}

const Layout = ({ children }: ILayout) => {
  const [openSideBar, setOpenSideBar] = useState(true)
  const [openPopupSideBar, setOpenPopupSideBar] = useState(false)
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (width <= 1200) {
      setOpenSideBar(false)
    } else {
      setOpenSideBar(true)
    }
  }, [width])
  function handleOpen() {
    setOpenSideBar(!openSideBar)
  }

  const router = useRouter()
  if (router.pathname == '/signin') {
    return <>{children}</>
  }

  return (
    <>
      <div className="max-w-full max-h-full">
        <Header openSideBar={openSideBar} handleOpen={handleOpen} setOpenPopupSideBar={setOpenPopupSideBar} />
      </div>
      <div>
        <Sidebar
          openSideBar={openSideBar}
          handleOpen={handleOpen}
          setOpenPopupSideBar={setOpenPopupSideBar}
          openPopupSideBar={openPopupSideBar}
        />
        <ContentRender width={width} openSideBar={openSideBar}>
          {children}
        </ContentRender>
      </div>
    </>
  )
}

export default Layout
