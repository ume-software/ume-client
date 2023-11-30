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
    if (width >= 1200 && openSideBar) {
      return <div className={`pl-[22%] mt-16 w-full pr-[2%] py-5 min-h-screen bg-[#15151b] text-white`}>{children}</div>
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
    if (width <= 1024) {
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
