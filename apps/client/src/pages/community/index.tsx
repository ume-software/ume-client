import dynamic from 'next/dynamic'

const CommunityRender = dynamic(() => import('~/containers/community-page/communit-page.container'), {
  ssr: false,
})

const CommunityPage = (props) => {
  return <CommunityRender {...props} />
}
export default CommunityPage
