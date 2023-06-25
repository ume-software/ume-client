import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailLiveStream = dynamic(() => import('~/containers/detail-live-page/detail-live-page.container'), {
  ssr: false,
})

const DetailLiveStreamPage = (props) => {
  const router = useRouter()
  const slug = router.query.slug

  return <DetailLiveStream slug={slug} />
}
export default DetailLiveStreamPage
