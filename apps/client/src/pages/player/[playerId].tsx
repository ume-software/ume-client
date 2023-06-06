import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailPlayer = dynamic(() => import('~/containers/detail-player-page/detail-player.container'), {
  ssr: false,
})

const DetailPlayerPage = (props) => {
  const router = useRouter()
  const providerId = router.query.playerId

  return <DetailPlayer providerId={providerId} />
}
export default DetailPlayerPage
