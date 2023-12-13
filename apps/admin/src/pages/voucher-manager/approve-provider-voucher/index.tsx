import dynamic from 'next/dynamic'

const VoucherManagerRender = dynamic(() => import('~/containers/voucher-manager-page'), {
  ssr: false,
})

const ApproveProviderVoucherPage = () => {
  return <VoucherManagerRender task={'approve-provider-voucher'} />
}

export default ApproveProviderVoucherPage
