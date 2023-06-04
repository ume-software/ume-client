import dynamic from 'next/dynamic'

const HomeRender = dynamic(() => import('~/containers/home-page/home.container'), {
  ssr: true,
})

const HomePage = (props) => {
  return <HomeRender {...props} />
}
export default HomePage
