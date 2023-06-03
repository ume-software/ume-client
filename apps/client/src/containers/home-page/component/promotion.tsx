import { isEmpty } from 'lodash'
import Link from 'next/link'

import { FilterModal } from './filterModal'
import { PromoteCard } from './promoteCard'

import { trpc } from '~/utils/trpc'

export interface Promotion {}

export const Promotion = () => {
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

  const handleFilter = (filterData) => {
    console.log(filterData)
  }
  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-center gap-5 pt-10">
        <FilterModal handleFilter={handleFilter} />
        <p className="text-3xl font-semibold text-white">Ume</p>
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
