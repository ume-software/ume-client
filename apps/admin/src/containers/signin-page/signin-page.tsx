import { Button, FieldLabel, FormInput } from '@ume/ui'

import { useState } from 'react'

import { FormikErrors, useFormik } from 'formik'
import Head from 'next/head'

import { MISSING_REQUIRED_FIELD_MESSAGE } from '~/utils/constant'

interface IFormValues {
  email: string
  password: string
}

const validate = (values: IFormValues): FormikErrors<IFormValues> => {
  const errors: FormikErrors<IFormValues> = {}
  if (!values.email) {
    errors.email = MISSING_REQUIRED_FIELD_MESSAGE
  }

  if (!values.password) {
    errors.password = MISSING_REQUIRED_FIELD_MESSAGE
  }
  return errors
}

const SigninPage = () => {
  const [isSubmiting, setSubmiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      console.log(values)
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
                <FieldLabel labelName="Email" />
                <FormInput
                  name="email"
                  disabled={false}
                  value={form.values.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={!!form.errors.email && form.touched.email}
                  errorMessage={form.errors.email}
                  placeholder="Enter Email Address."
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
                  isDisabled={!(form.values.email || form.values.password) || isSubmiting}
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
