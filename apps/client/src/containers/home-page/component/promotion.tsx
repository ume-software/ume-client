import { CustomDrawer } from '@ume/ui'

import { useContext } from 'react'

import { isEmpty } from 'lodash'
import Link from 'next/link'

import { FilterModal } from './filterModal'
import HotProvider from './hotProvider'
import { PromoteCard } from './promoteCard'

import { drawerContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

export interface Promotion {}

export const Promotion = () => {
  const { childrenDrawer, setChildrenDrawer } = useContext(drawerContext)
  let listProvider: any

  const {
    data: providers,
    isLoading: loadingProvider,
    isFetching,
  } = trpc.useQuery(['booking.getProviders'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })
  if (loadingProvider) {
    return <></>
  }

  listProvider = providers?.data?.row

  const handleFilterOpen = () => {
    setChildrenDrawer(<FilterModal handleFilter={handleFilter} data={listProvider} />)
  }

  const handleFilter = (filterData) => {
    console.log(filterData)
  }
  return (
    <>
      <div className="container mx-auto my-5">
        <HotProvider />
        <div className="flex items-end justify-between gap-5 pt-10 pb-5">
          <p className="text-2xl font-semibold text-white">Ume Player</p>
          <CustomDrawer
            customOpenBtn="rounded-xl text-white bg-purple-700 py-1 px-4 font-semibold text-1xl hover:scale-105"
            openBtn={<div onClick={handleFilterOpen}>Lọc</div>}
            drawerTitle="Lọc người chơi"
          >
            {childrenDrawer}
          </CustomDrawer>
        </div>
        <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {!isFetching &&
            listProvider?.map((provider) => (
              <Link key={provider?.id} href={`/player/${provider?.slug || provider?.id}`}>
                <PromoteCard
                  id={provider?.id}
                  image={provider?.avatarurl}
                  name={provider?.name}
                  rating={5}
                  totalVote={5}
                  description={provider.description}
                  coin={provider.cost}
                />
              </Link>
            ))}
        </div>
      </div>
    </>
  )
}
