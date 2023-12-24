import dynamic from 'next/dynamic'

const DetailPlayerRender = dynamic(() => import('~/containers/detail-profile-page/detail-profile-page.container'), {
  ssr: false,
})

const DetailPlayerPage = (props) => {
  return <DetailPlayerRender />
}
export default DetailPlayerPage
