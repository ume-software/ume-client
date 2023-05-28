import { FilterProviderResponse } from 'ume-booking-service-openapi'

import { PromoteCard } from './promoteCard'

import { trpc } from '~/utils/trpc'

export interface Promotion {}

export const Promotion = () => {
  let listProvider: FilterProviderResponse[] | undefined
  const { data: providers, isLoading: loadingProvider, isFetching } = trpc.useQuery(['booking.getProviders'])
  if (loadingProvider) {
    return <></>
  }
  listProvider = providers?.data?.row
  return (
    <div className="container mx-auto">
      <p className="block pt-8 text-3xl font-semibold text-white">Ume</p>
      <div className="grid gap-6 mt-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {!isFetching &&
          listProvider?.map((provider) => (
            <PromoteCard
              id={provider?.id}
              image={provider?.avatarurl}
              name={provider?.name}
              key={provider.id}
              rating={5}
              totalVote={5}
              description={provider.description}
              coin={provider.cost}
            />
          ))}
      </div>
    </div>
  )
}
