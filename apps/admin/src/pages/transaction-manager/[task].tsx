import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const TransactionManagerRender = dynamic(() => import('~/containers/transaction-manager-page'), {
  ssr: false,
})

const TransactionManager = ({ props }) => {
  const router = useRouter()
  const task = router.query.task

  return <TransactionManagerRender task={task} />
}

export default TransactionManager
