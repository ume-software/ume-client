import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailUser = dynamic(() => import('~/containers/detail-player-page/detail-player.container'), {
  ssr: false,
})

const DetailUserPage = (props) => {
  const router = useRouter()
  const providerId = router.query.userId

  return <DetailUser providerId={providerId} />
}
export default DetailUserPage
