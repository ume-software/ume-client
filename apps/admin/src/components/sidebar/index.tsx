import WhiteLogo from 'public/32x32/ume-logo-white.png'
import WhiteTextLogo from 'public/ume-logo-2.png'
import useWindowDimensions from '~/hooks/windownDimensions'

import Image from 'next/legacy/image'

import SideBarDropdown from './SideBarDropdown'
import { SidebarNavigation } from './SidebarNavigation'

export interface ISideBarProps {
  handleOpen?: any
  openSideBar?: boolean
  openPopupSideBar?: boolean
  setOpenPopupSideBar?: any
}
const Sidebar = ({ handleOpen, openSideBar, openPopupSideBar, setOpenPopupSideBar }: ISideBarProps) => {
  const { width } = useWindowDimensions()
  if (width >= 900) {
    if (width >= 1200 && openSideBar) {
      return (
        <div className="fixed top-0 w-[19rem] z-50 h-[100%] bg-umeHeader px-2">
          <div className="pt-3 w-full flex justify-center px-4 mb-4">
            <Image width={150} height={50} src={WhiteTextLogo} alt="logo" />
          </div>
          <SideBarDropdown />
        </div>
      )
    } else {
      return (
        <div onClick={handleOpen} className="fixed top-0 w-[7%] z-40 h-[100%] bg-umeHeader">
          <div className="pt-3 w-full flex justify-center px-4 mb-4">
            <Image width={50} height={50} src={WhiteLogo} alt="logo" />
          </div>
          <div className="h-full overflow-auto pt-2 pb-28 side-bar cursor-pointer">
            {SidebarNavigation.map((item) => {
              return (
                <div key={item.key} className="mb-14 mt-5 flex justify-center items-center">
                  <div className="relative inline-block">
                    <div className="w-fit rounded-full p-3 hover:bg-[#7463f0] ">{item.icon}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  } else {
    return (
      <>
        {openPopupSideBar && (
          <div
            onMouseLeave={() => {
              setOpenPopupSideBar(false)
            }}
            className="absolute shadow-lg shadow-gray-700 top-[4.1rem] left-5 rounded-lg bg-umeHeader z-50 h-[70%]"
          >
            <SideBarDropdown />
          </div>
        )}
      </>
    )
  }
}

export default Sidebar
