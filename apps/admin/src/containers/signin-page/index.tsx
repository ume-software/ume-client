import { FieldLabel, FormInput } from '@ume/ui'
import { useAuth } from '~/contexts/auth'
import { getItem, setItem } from '~/hooks/localHooks'

import { useEffect, useState } from 'react'

import { Button } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { trpc } from '~/utils/trpc'

interface IFormValues {
  username: string
  password: string
}

const validate = (values: IFormValues): FormikErrors<IFormValues> => {
  const errors: FormikErrors<IFormValues> = {}
  return errors
}

const SigninPage = () => {
  const [isSubmiting, setSubmiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const signin = trpc.useMutation(['auth.signin'])
  const { login } = useAuth()
  const router = useRouter()

  const form = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      setSubmiting(true)
      signin.mutate(values, {
        onSuccess: (response) => {
          login(response.data.admin)
          setItem('user', response.data.admin)
          setSubmiting(false)
          router.push('/dashboard')
        },
        onError: (error) => {
          setSubmiting(false)
          setErrorMessage(error.message)
        },
      })
    },
  })

  const adminInfo = getItem('user')
  useEffect(() => {
    if (adminInfo) {
      router.push('/dashboard')
    }
  }, [adminInfo, router])

  return (
    <>
      <Head>
        <title>Admin | LOGIN</title>
      </Head>
      <div className="flex flex-col justify-center w-full h-screen">
        <div className="mx-auto mb-48 w-96">
          <div className="text-2xl font-semibold text-center text-black">UME ADMIN</div>
          <div>
            <form onSubmit={form.handleSubmit} className="flex flex-col mb-4 gap-y-4">
              <div>
                <FieldLabel labelName="Username" />
                <FormInput
                  name="username"
                  disabled={false}
                  value={form.values.username}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={!!form.errors.username && form.touched.username}
                  errorMessage={form.errors.username}
                  placeholder="Enter Username."
                />
              </div>
              <div>
                <FieldLabel labelName="Password" />
                <FormInput
                  name="password"
                  type="password"
                  disabled={false}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  value={form.values.password}
                  error={!!form.errors.password && form.touched.password}
                  errorMessage={form.errors.password}
                  placeholder="Enter Password."
                />
              </div>
              {errorMessage && <p className="text-xs text-ume-error">{errorMessage}</p>}
              <div className="flex justify-center max-w-full">
                <Button
                  name="submit"
                  type="primary"
                  className="w-full bg-blue-300"
                  loading={isSubmiting}
                  disabled={!(form.values.username || form.values.password)}
                  onClick={() => form.handleSubmit()}
                >
                  <span className={`${form.values.username || form.values.password} ?? text-white `}>Đăng nhập</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default SigninPage
