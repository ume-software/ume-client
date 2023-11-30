import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const KYCManagerRender = dynamic(() => import('~/containers/kyc-provider-page'), {
  ssr: false,
})

const KYCManager = ({ props }) => {
  const router = useRouter()
  const task = router.query.task

  return <KYCManagerRender task={task} />
}

export default KYCManager
