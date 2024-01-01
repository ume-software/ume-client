import dynamic from 'next/dynamic'

import { PageLoading } from '~/components/skeleton-load'

const ContactUsRender = dynamic(() => import('~/containers/contact-us/contact-us.container'), {
  ssr: false,
  loading: () => <PageLoading />,
})

const ContactUsPage = (props) => {
  return <ContactUsRender {...props} />
}
export default ContactUsPage
