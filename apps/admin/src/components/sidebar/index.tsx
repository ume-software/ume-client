import { Logout } from '@icon-park/react'
import { Button } from '@ume/ui'

import Image from 'next/legacy/image'

interface ISidebar {}
const Sidebar = ({}: ISidebar) => {
  return (
    <div className="fixed top-0 w-20 h-screen bg-slate-200">
      <div className="flex flex-col items-center justify-between w-full h-full">
        <div>
          <Image src={''} alt="logo" />
          <div></div>
        </div>
        <div className="items-center mb-4 text-center align-middle`">
          <Button customCSS="px-2 pt-1 border bg-ume-blue hover:bg-ume-error w-full h-full">
            <Logout
              className="self-center mb-1"
              theme="outline"
              size="24"
              fill="#fff"
              strokeLinejoin="miter"
              strokeLinecap="square"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
