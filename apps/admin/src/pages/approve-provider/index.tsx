import dynamic from 'next/dynamic'

const ApproveProviderRender = dynamic(() => import('~/containers/approve-provider'), {
  ssr: false,
})

const ApproviderManage = (props) => {
  return <ApproveProviderRender {...props} />
}

export default ApproviderManage
