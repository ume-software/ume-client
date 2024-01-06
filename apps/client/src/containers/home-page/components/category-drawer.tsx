import { CustomDrawer } from '@ume/ui'

import React, { useContext } from 'react'

import AllService from './all-service'

import { DrawerContext } from '~/components/layouts/app-layout/app-layout'

function CategoryDrawer({ data, loadingService }) {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)

  const handleAllServiceOpen = () => {
    setChildrenDrawer(<AllService data={data} loadingService={loadingService} />)
  }
  return (
    <CustomDrawer
      drawerTitle="Tất cả dịch vụ"
      customOpenBtn="mr-2 rounded-xl cursor-pointer justify-self-end font-semibold active:bg-gray-200 hover:bg-blue-500 "
      openBtn={
        <div className="w-full h-full p-2" onClick={handleAllServiceOpen} onKeyDown={() => {}}>
          Tất cả dịch vụ
        </div>
      }
    >
      {childrenDrawer}
    </CustomDrawer>
  )
}

export default CategoryDrawer
