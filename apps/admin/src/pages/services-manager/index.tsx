import dynamic from 'next/dynamic'

const ServicesManagerRender = dynamic(() => import('~/containers/services-manager-page'), {
  ssr: false,
})

const ServicesManager = (props) => {
  return <ServicesManagerRender {...props} />
}

export default ServicesManager
