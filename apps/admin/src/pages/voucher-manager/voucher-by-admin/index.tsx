import dynamic from 'next/dynamic'

const VoucherManagerRender = dynamic(() => import('~/containers/voucher-manager-page'), {
  ssr: false,
})

const AdminVoucherManagerPage = () => {
  return <VoucherManagerRender task={'voucher-by-admin'} />
}

export default AdminVoucherManagerPage
