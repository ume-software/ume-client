import Link from 'next/link'

import PromoteCard from './promoteCard'

import { trpc } from '~/utils/trpc'

const HotProvider = () => {
  let listHotProvider: any

  const {
    data: hotProviders,
    isLoading: loadingHotProvider,
    isFetching: isFetchingHotProviders,
  } = trpc.useQuery(['booking.getHotProviders'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })
  if (loadingHotProvider) {
    return <></>
  }
  listHotProvider = hotProviders?.data?.row
  return (
    <>
      <p className="text-2xl font-semibold text-white">Hot Player</p>
      <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {!isFetchingHotProviders &&
          listHotProvider?.map((provider) => (
            <Link key={provider?.id} href={`/player/${provider?.slug || provider?.id}`}>
              <PromoteCard data={provider} />
            </Link>
          ))}
      </div>
    </>
  )
}
export default HotProvider
