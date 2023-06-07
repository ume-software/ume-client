import dynamic from 'next/dynamic'

const HomeRender = dynamic(() => import('~/containers/home-page/home-page.container'), {
  ssr: false,
})

const HomePage = (props) => {
  return <HomeRender {...props} />
}
export default HomePage
