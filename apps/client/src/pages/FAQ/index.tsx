import dynamic from 'next/dynamic'

const FAQRender = dynamic(() => import('~/containers/FAQ/FAQ-page'), {
  ssr: false,
})

const FAQPage = (props) => {
  return <FAQRender {...props} />
}
export default FAQPage
