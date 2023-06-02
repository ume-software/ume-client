import { GetProfieProviderBySlugResponse } from 'ume-booking-service-openapi'

import PlayerInformation from './components/player-information'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const DetailUser = (props) => {
  let providerBySlug: GetProfieProviderBySlugResponse | undefined
  const {
    data: provider,
    isLoading: loadingProvider,
    isFetching,
  } = trpc.useQuery(['booking.getProviderBySlug', props.providerId as string])
  if (loadingProvider) {
    return <></>
  }
  providerBySlug = provider?.data

  return (
    <>
      <AppLayout {...props}>
        <PlayerInformation key={props.providerId} data={providerBySlug} />
      </AppLayout>
    </>
  )
}
export default DetailUser