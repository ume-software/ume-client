import dynamic from 'next/dynamic'

const KYCManagerRender = dynamic(() => import('~/containers/kyc-provider-page'), {
  ssr: false,
})

const PendingKYCManagerPage = ({ props }) => {
  return <KYCManagerRender task={'kyc-pending'} />
}

export default PendingKYCManagerPage
