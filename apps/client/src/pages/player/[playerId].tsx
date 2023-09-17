import dynamic from 'next/dynamic'

const DetailPlayerRender = dynamic(() => import('~/containers/detail-player-page/detail-player-page.container'), {
  ssr: false,
})

const DetailPlayerPage = (props) => {
  return <DetailPlayerRender />
}
export default DetailPlayerPage
