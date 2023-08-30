import { useState } from 'react'

import Head from 'next/head'
import { GetProfileProviderBySlugResponse } from 'ume-openapi-booking'

import PlayerInformation from './components/player-information'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const DetailPlayer = (props) => {
  const [providerBySlug, setProviderBySlug] = useState<GetProfileProviderBySlugResponse | undefined>(undefined)
  const {
    data: provider,
    isLoading: loadingProvider,
    isFetching,
  } = trpc.useQuery(['booking.getProviderBySlug', props.providerId as string], {
    onSuccess(data) {
      setProviderBySlug(data.data)
    },
  })

  return (
    <>
      <Head>
        <title>UME | Provider</title>
      </Head>
      <AppLayout {...props}>
        {loadingProvider ? <></> : <PlayerInformation key={props.providerId} data={providerBySlug} />}
      </AppLayout>
    </>
  )
}
export default DetailPlayer
