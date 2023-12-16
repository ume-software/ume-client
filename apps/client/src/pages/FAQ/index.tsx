import dynamic from 'next/dynamic'

const FAQRender = dynamic(() => import('~/containers/faq/faq-page'), {
  ssr: false,
})

const FAQPage = (props) => {
  return <FAQRender {...props} />
}
export default FAQPage
