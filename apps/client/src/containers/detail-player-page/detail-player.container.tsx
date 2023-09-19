import { useRouter } from 'next/router'

import PlayerInformation from './components/player-information'

import { trpc } from '~/utils/trpc'

const DetailPlayerContainer = () => {
  const router = useRouter()
  const slug = router.query

  const providerBySlug = trpc.useQuery(['booking.getProviderBySlug', slug.playerId!.toString()]) || undefined

  return (
    <>{providerBySlug && providerBySlug.isLoading ? <></> : <PlayerInformation data={providerBySlug.data?.data!} />}</>
  )
}
export default DetailPlayerContainer
