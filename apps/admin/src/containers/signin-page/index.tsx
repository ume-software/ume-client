import { Button, FieldLabel, FormInput } from '@ume/ui'

import { useState } from 'react'

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
              <div>
                <Button
                  name="submit"
                  type="submit"
                  customCSS="bg-blue-500 hover:opacoty-90 px-2 py-1
            hover:bg-ume-primary focus:bg-ume-primary active:bg-ume-primary/90"
                  isDisabled={!(form.values.username || form.values.password) || isSubmiting}
                  isLoading={isSubmiting}
                >
                  Login
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
