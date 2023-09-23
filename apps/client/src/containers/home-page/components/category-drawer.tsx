import { CustomDrawer } from '@ume/ui'

import React, { useContext } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { DrawerContext } from '~/components/layouts/app-layout/app-layout'
import { CategoryGridSkeleton } from '~/components/skeleton-load'

function CategoryDrawer({ data, loadingService }) {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)

  const handleAllServiceOpen = () => {
    setChildrenDrawer(
      <>
        {loadingService ? (
          <CategoryGridSkeleton />
        ) : (
          <div className="w-full h-full px-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-5 pb-5 place-items-center ">
              {data.map((category, index) => (
                <div key={category.id} className="my-8">
                  <Link href={`/filter-service/${category.name}?serviceId=${category.id}`}>
                    <div className="relative w-[170px] h-[230px]">
                      <Image
                        className="mb-4 rounded-lg pointer-events-none object-cover"
                        layout="fill"
                        src={category.imageUrl}
                        alt={category.name}
                      />
                    </div>
                    <span className="font-bold">{category.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </>,
    )
  }
  return (
    <>
      <CustomDrawer
        drawerTitle="Tất cả dịch vụ"
        customOpenBtn="p-2 mr-2 rounded-xl cursor-pointer justify-self-end font-semibold active:bg-gray-200 hover:bg-gray-500"
        openBtn={<div onClick={handleAllServiceOpen}>Tất cả dịch vụ</div>}
      >
        {childrenDrawer}
      </CustomDrawer>
    </>
  )
}

export default CategoryDrawer
