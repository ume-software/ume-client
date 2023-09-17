import { useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetProfileProviderBySlugResponse } from 'ume-service-openapi'

import PlayerInformation from './components/player-information'

import { trpc } from '~/utils/trpc'

const DetailPlayerContainer = () => {
  const router = useRouter()
  const slug = router.query

  const [providerBySlug, setProviderBySlug] = useState<GetProfileProviderBySlugResponse | undefined>(undefined)
  const { isLoading: loadingProvider, isFetching } = trpc.useQuery(
    ['booking.getProviderBySlug', slug.playerId!.toString()],
    {
      onSuccess(data) {
        setProviderBySlug(data.data)
      },
    },
  )

  return <>{loadingProvider ? <></> : <PlayerInformation data={providerBySlug!} />}</>
}
export default DetailPlayerContainer
