import { useState } from 'react'

import CategoryDrawer from './category-drawer'
import CategorySlide from './category-slide'

import { SliderSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const Category = () => {
  const [listSkils, setListSkils] = useState<any>([])
  const {
    data: skills,
    isLoading: loadingSkill,
    isFetching,
  } = trpc.useQuery(['booking.getListSkill'], {
    onSuccess(data) {
      setListSkils(data?.data?.row)
    },
  })

  return (
    <>
      {loadingSkill ? (
        <>
          <SliderSkeletonLoader />
        </>
      ) : (
        <>
          {skills && (
            <div className="flex-col items-center w-full ">
              <div className="grid grid-cols-2 my-5 text-white">
                <h2 className="block text-3xl font-bold">Dịch vụ</h2>
                <CategoryDrawer data={listSkils} />
              </div>
              <CategorySlide skills={listSkils} />
            </div>
          )}
        </>
      )}
    </>
  )
}
export default Category
