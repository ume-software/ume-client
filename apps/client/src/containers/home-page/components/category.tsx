import { useState } from 'react'

import CategoryDrawer from './category-drawer'
import CategorySlide from './category-slide'

import { SliderSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const Category = () => {
  const [listSkils, setListSkils] = useState<any>([])
  const { data: services, isLoading: loadingService } = trpc.useQuery(['booking.getListService'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListSkils(data?.data?.row)
    },
  })

  return (
    <>
      {loadingService ? (
        <SliderSkeletonLoader />
      ) : (
        <>
          {services && (
            <div className="flex-col items-center w-full ">
              <div className="grid grid-cols-2 my-5 text-white">
                <h2 className="block text-3xl font-bold">Dịch vụ</h2>
                <CategoryDrawer data={listSkils} loadingService={loadingService} />
              </div>
              <CategorySlide services={listSkils} />
            </div>
          )}
        </>
      )}
    </>
  )
}
export default Category
