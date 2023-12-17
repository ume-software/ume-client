import dynamic from 'next/dynamic'

const AboutUmeRender = dynamic(() => import('~/containers/about-ume/about-ume.container'), {
  ssr: false,
})

const AboutUmePage = (props) => {
  return <AboutUmeRender {...props} />
}
export default AboutUmePage
