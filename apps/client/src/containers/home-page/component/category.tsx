import img1 from 'public/categories_pic/league_of_legends.jpg'

import { CreateSkillRequest } from 'ume-booking-service-openapi'

import CategoryDrawer from './category-drawer'
import CategorySlide from './category-slide'

import { trpc } from '~/utils/trpc'

const Category = () => {
  let listSkils: any
  const { data: skills, isLoading: loadingSkill, isFetching } = trpc.useQuery(['booking.getListSkill'])
  if (loadingSkill) {
    return <></>
  }
  listSkils = (skills as any).data.row

  return (
    <>
      <div className="flex-col items-center w-full ">
        <div className="grid grid-cols-2 my-8 text-white">
          <h2 className="block text-3xl font-semibold">Dịch vụ</h2>
          <CategoryDrawer data={categories} />
        </div>
        <CategorySlide skills={listSkils} />
      </div>
    </>
  )
}
export default Category

const categories = [
  {
    id: 1,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 2,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 3,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 4,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 5,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 6,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 7,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 8,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 9,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
  {
    id: 10,
    cateId: 123,
    cateName: 'League of Legend',
    cateImg: img1,
  },
]
