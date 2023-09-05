import dynamic from 'next/dynamic'

const DashboardRender = dynamic(() => import('~/containers/dashboard-page'), {
  ssr: false,
})

const DashboardPage = (props) => {
  return <DashboardRender {...props} />
}

export default DashboardPage
