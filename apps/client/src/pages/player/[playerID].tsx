import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailPlayer = dynamic(() => import('~/containers/detail-player-page/detail-player.container'), {
  ssr: false,
})

const DetailPlayerPage = (props) => {
  const router = useRouter()
  const playerID = router.query.playerID

  return <DetailPlayer {...props} />
}
export default DetailPlayerPage
