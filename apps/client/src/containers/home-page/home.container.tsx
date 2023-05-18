import { useEffect } from 'react'

import Category from './component/category'
import Cover from './component/cover'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const HomePage = (props) => {
  const response = trpc.useQuery(['booking.getListSkill'])
  console.log(response)
  return (
    <AppLayout {...props}>
      <div className="flex flex-1">
        <Cover />
      </div>
      <div>
        <p className="block mx-20 my-10 text-3xl font-semibold text-white ">Danh mục</p>
      </div>
    </AppLayout>
  )
}

export default HomePage
