import dynamic from 'next/dynamic'

const SigninRender = dynamic(() => import('~/containers/signin-page/signin-page'), {
  ssr: false,
})

const SigninPage = (props) => {
  return <SigninRender {...props} />
}

export default SigninPage
