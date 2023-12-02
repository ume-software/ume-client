import dynamic from 'next/dynamic'

const BannerManagerRender = dynamic(() => import('~/containers/banner-manager-page'), {
  ssr: false,
})

const BannerManagerPage = (props) => {
  return <BannerManagerRender {...props} />
}

export default BannerManagerPage
