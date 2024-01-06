import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const VideoCallRender = dynamic(() => import('~/components/video-room/video-room'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const VideoCallPage = (props) => {
  return <VideoCallRender {...props} />
}
export default VideoCallPage
