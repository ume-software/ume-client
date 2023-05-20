import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailUser = dynamic(() => import('~/containers/detail-player-page/detail-player.container'), {
  ssr: false,
})

const DetailUserPage = (props) => {
  const router = useRouter()
  const playerID = router.query.playerID

  console.log(playerID)

  return <DetailUser {...props} />
}
export default DetailUserPage
