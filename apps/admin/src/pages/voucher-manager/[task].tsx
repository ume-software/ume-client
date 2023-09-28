import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const VoucherManagerRender = dynamic(() => import('~/containers/voucher-manager-page'), {
  ssr: false,
})

const VoucherManager = ({ props }) => {
  const router = useRouter()
  const task = router.query.task

  return <VoucherManagerRender task={task} />
}

export default VoucherManager
