import dynamic from 'next/dynamic'

const ProviderManagerRender = dynamic(() => import('~/containers/provider-manager-page'), {
  ssr: false,
})

const UserManager = (props) => {
  return <ProviderManagerRender {...props} />
}

export default UserManager
