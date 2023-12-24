import dynamic from 'next/dynamic'

const ContactUsRender = dynamic(() => import('~/containers/contact-us/contact-us.container'), {
  ssr: false,
})

const ContactUsPage = (props) => {
  return <ContactUsRender {...props} />
}
export default ContactUsPage
