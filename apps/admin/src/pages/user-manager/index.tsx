import dynamic from 'next/dynamic'

const UserManagerRender = dynamic(() => import('~/containers/user-manager-page'), {
  ssr: false,
})

const UserManager = (props) => {
  return <UserManagerRender {...props} />
}

export default UserManager
