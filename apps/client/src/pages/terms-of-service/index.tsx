import dynamic from 'next/dynamic'

const TermsOfServiceRender = dynamic(() => import('~/containers/terms-of-service/terms-of-service.container'), {
  ssr: false,
})

const TermsOfServicePage = (props) => {
  return <TermsOfServiceRender {...props} />
}
export default TermsOfServicePage
