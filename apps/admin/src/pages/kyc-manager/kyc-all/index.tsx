import dynamic from 'next/dynamic'

const KYCManagerRender = dynamic(() => import('~/containers/kyc-provider-page'), {
  ssr: false,
})

const AllKYCManagerPage = ({ props }) => {
  return <KYCManagerRender task={'kyc-all'} />
}

export default AllKYCManagerPage
