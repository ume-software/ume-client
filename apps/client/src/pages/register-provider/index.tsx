import dynamic from 'next/dynamic'

const RegisterProviderRender = dynamic(
  () => import('~/containers/register-provider-page/register-provoder-page.container'),
  {
    ssr: false,
  },
)

const RegisterProviderPage = (props) => {
  return <RegisterProviderRender {...props} />
}
export default RegisterProviderPage
