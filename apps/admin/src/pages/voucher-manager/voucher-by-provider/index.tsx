import dynamic from 'next/dynamic'

const VoucherManagerRender = dynamic(() => import('~/containers/voucher-manager-page'), {
  ssr: false,
})

const ProviderVoucherManagerPage = () => {
  return <VoucherManagerRender task={'voucher-by-provider'} />
}

export default ProviderVoucherManagerPage
