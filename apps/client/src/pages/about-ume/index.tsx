import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const AboutUmeRender = dynamic(() => import('~/containers/about-ume/about-ume.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const AboutUmePage = (props) => {
  return <AboutUmeRender {...props} />
}
export default AboutUmePage
