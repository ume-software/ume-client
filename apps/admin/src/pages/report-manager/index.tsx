import dynamic from 'next/dynamic'

const ReportManagerRender = dynamic(() => import('~/containers/report-manager-page'), {
  ssr: false,
})

const ReportManagerPage = (props) => {
  return <ReportManagerRender />
}

export default ReportManagerPage
