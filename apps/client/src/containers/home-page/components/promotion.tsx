import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { FilterProviderPagingResponse } from 'ume-service-openapi'

import PromoteCard from './promoteCard'

import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

export interface IPromotion {}

export const Promotion = () => {
  const [page, setPage] = useState<string>('1')
  const [listHotProvider, setListHotProvider] = useState<FilterProviderPagingResponse['row']>([])
  const [listProvider, setListProvider] = useState<FilterProviderPagingResponse['row']>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

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
    isFetching: isFetchingProviders,
  } = trpc.useQuery(['booking.getProviders', { limit: '20', page: page, order: '[]' }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setListProvider((prevData) => [...(prevData ?? []), ...(data?.data?.row ?? [])])
    },
  })

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = useCallback(() => {
    const { scrollY } = window
    setScrollPosition(scrollY)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight } = containerRef.current
      const isAtEnd = scrollPosition >= scrollHeight

      if (isAtEnd && Number(providers?.data.count) > 20 * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      {(loadingProvider ?? loadingHotProvider) && !isFetchingProviders && !isFetchingHotProviders ? (
        <>
          <PlayerSkeletonLoader />
        </>
      ) : (
        <>
          <div ref={containerRef} className="container mx-auto my-10">
            <div className="flex flex-col gap-5">
              <p className="text-3xl font-bold text-white">Hot Player</p>
              <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                {listHotProvider?.map((provider) => (
                  <Link
                    key={provider?.id}
                    href={`/profile/${provider?.slug ?? provider?.id}?tab=information&service=${
                      provider.serviceSlug || provider.serviceId
                    }`}
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
                    href={`/profile/${provider?.slug ?? provider?.id}?tab=information&service=${
                      provider.serviceSlug || provider.serviceId
                    }`}
                  >
                    <PromoteCard data={provider} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {isFetchingProviders && <PlayerSkeletonLoader />}
    </>
  )
}
