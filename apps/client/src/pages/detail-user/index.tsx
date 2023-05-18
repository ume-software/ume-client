import dynamic from 'next/dynamic';

const DetailUser = dynamic(() => import('~/containers/detail-user-page/detail-user.container'), {
  ssr: false
})

const DetailUserPage = (props) => {
  return (
    <DetailUser {...props} />
  )
}
export default DetailUserPage
