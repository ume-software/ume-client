import dynamic from 'next/dynamic'

const AdminManagerRender = dynamic(() => import('~/containers/admin-manager-page'), {
  ssr: false,
})

const AdminManagerPage = () => {
  return <AdminManagerRender />
}

export default AdminManagerPage
