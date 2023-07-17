import { CustomDrawer } from '@ume/ui'

import { useContext, useState } from 'react'

import Link from 'next/link'
import { FilterProviderPagingResponse } from 'ume-booking-service-openapi'

import PromoteCard from './promoteCard'

import { DrawerContext } from '~/components/layouts/app-layout/app-layout'
import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

export interface Promotion {}

export const Promotion = () => {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  const [listHotProvider, setListHotProvider] = useState<FilterProviderPagingResponse['row']>([])
  const [listProvider, setListProvider] = useState<FilterProviderPagingResponse['row']>([])

  const {
    data: hotProviders,
    isLoading: loadingHotProvider,
    isFetching: isFetchingHotProviders,
  } = trpc.useQuery(['booking.getHotProviders'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListHotProvider(data?.data?.row)
    },
  })

  const {
    data: providers,
    isLoading: loadingProvider,
    isFetching,
  } = trpc.useQuery(['booking.getProviders'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListProvider(data?.data?.row)
    },
  })

  return (
    <>
      {loadingProvider || loadingHotProvider ? (
        <>
          <PlayerSkeletonLoader />
        </>
      ) : (
        <>
          <div className="container mx-auto my-10">
            <div className="flex flex-col gap-5">
              <p className="text-3xl font-bold text-white">Hot Player</p>
              <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                {listHotProvider?.map((provider) => (
                  <Link
                    key={provider?.id}
                    href={`/player/${provider?.slug || provider?.id}?gameId=${provider.skillid}`}
                  >
                    <PromoteCard data={provider} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-10 pb-5">
              <p className="text-3xl font-bold text-white">Ume Player</p>
              <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                {listProvider?.map((provider) => (
                  <Link
                    key={provider?.id}
                    href={`/player/${provider?.slug || provider?.id}?gameId=${provider.skillid}`}
                  >
                    <PromoteCard data={provider} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
