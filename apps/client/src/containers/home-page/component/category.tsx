import CategoryDrawer from './category-drawer'
import CategorySlide from './category-slide'

import { trpc } from '~/utils/trpc'

const Category = () => {
  let listSkils: any
  const { data: skills, isLoading: loadingSkill, isFetching } = trpc.useQuery(['booking.getListSkill'])
  if (loadingSkill) {
    return <></>
  }
  listSkils = skills?.data.row

  return (
    <>
      {skills && (
        <div className="flex-col items-center w-full ">
          <div className="grid grid-cols-2 my-8 text-white">
            <h2 className="block text-3xl font-semibold">Dịch vụ</h2>
            <CategoryDrawer data={listSkils} />
          </div>
          <CategorySlide skills={listSkils} />
        </div>
      )}
    </>
  )
}
export default Category
