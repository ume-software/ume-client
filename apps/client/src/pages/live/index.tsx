import dynamic from 'next/dynamic'

const LiveRender = dynamic(() => import('~/containers/live-page/live-page.container'), {
  ssr: false,
})

const LivePage = (props) => {
  return <LiveRender {...props} />
}
export default LivePage
