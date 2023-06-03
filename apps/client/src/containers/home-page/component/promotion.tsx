import { CustomDrawer } from '@ume/ui'

import { useContext } from 'react'

import Link from 'next/link'
import { FilterProviderResponse } from 'ume-booking-service-openapi'

import { FilterModal } from './filterModal'
import { PromoteCard } from './promoteCard'

import { drawerContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

export interface Promotion {}

export const Promotion = () => {
  const { childrenDrawer, setChildrenDrawer } = useContext(drawerContext)
  let listProvider: FilterProviderResponse[] | undefined
  const { data: providers, isLoading: loadingProvider, isFetching } = trpc.useQuery(['booking.getProviders'])
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
    <div className="container mx-auto">
      <div className="flex justify-between items-end gap-5 pt-10 pb-5">
        <p className="text-4xl font-semibold text-white">Ume PLayer</p>
        <CustomDrawer
          customOpenBtn="rounded-xl text-white bg-purple-700 py-1 px-4 font-nunito font-semibold text-2xl hover:scale-105"
          openBtn={<div onClick={handleFilterOpen}>Lọc</div>}
          drawerTitle="Lọc người chơi"
        >
          {childrenDrawer}
        </CustomDrawer>
      </div>
      <div className="grid gap-6 mt-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {!isFetching &&
          listProvider?.map((provider) => (
            <Link key={provider?.id} href={`/user/${provider?.slug || provider?.id}`}>
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
  )
}
