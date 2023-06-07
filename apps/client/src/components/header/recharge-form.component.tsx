import { Disclosure } from '@headlessui/react'
import { CloseSmall } from '@icon-park/react'
import { Button, FieldLabel, FormInput, Modal } from '@ume/ui'
import momo from 'public/momo-logo.png'

import { useState } from 'react'

import { Formik, FormikErrors } from 'formik'
import Image from 'next/image'

import { trpc } from '~/utils/trpc'

interface IRechargeModalProps {
  showRechargeModal: boolean
  setShowRechargeModal: any
}

interface IFormValue {
  balance: string
}

const validate = (value: IFormValue): FormikErrors<IFormValue> => {
  const errors: FormikErrors<IFormValue> = {}
  if (!value.balance) {
    errors.balance = ''
  }
  return errors
}

export const RechargeModal = ({ setShowRechargeModal, showRechargeModal }: IRechargeModalProps) => {
  const [qrContent, setQRContent] = useState<string>('')
  const [isSubmiting, setSubmiting] = useState(false)
  const [openTabMomo, setOpenTabMomo] = useState(false)
  const handleClose = () => {
    setShowRechargeModal(false)
  }
  const requestRecharge = trpc.useMutation(['identity.request-recharge'])
  const RechargeForm = () => {
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-4 my-2 text-white">
        <div className="w-full">
          <button
            onClick={() => setOpenTabMomo(!openTabMomo)}
            className="flex justify-between hover:bg-[#334155] w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 "
          >
            <div className="flex flex-1 ">
              <span>
                <Image src={momo} alt="logo-momo" width={20} height={20} />
              </span>
              <span>Nạp tiền qua momo</span>
            </div>
          </button>
          {openTabMomo && (
            <div className="px-4 pb-2">
              <div className="flex flex-col justify-center">
                <Formik
                  initialValues={{
                    balance: '',
                  }}
                  onSubmit={(values) => {
                    setSubmiting(true)
                    requestRecharge.mutate(
                      {
                        total: values.balance,
                        platform: 'MOMO',
                      },
                      {
                        onSuccess: (data) => {
                          console.log(data)
                        },
                        onError: (error) => {
                          console.log(error)
                        },
                      },
                    )
                  }}
                  validate={validate}
                >
                  {({ handleSubmit, handleChange, handleBlur, values, errors, isSubmitting }) => (
                    <form>
                      <FieldLabel labelName="Nhập số tiền cần nạp" className="text-xs text-slate-400" />
                      <FormInput
                        className="text-black"
                        value={values.balance}
                        name="balance"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.balance}
                        errorMessage={errors.balance}
                      />
                      <Button
                        customCSS="bg-[#37354F] py-1 mt-2 hover:bg-slate-700 !rounded-3xl max-h-10 w-full text-[15px] hover:ease-in-out"
                        type="button"
                        onClick={() => {
                          handleSubmit()
                        }}
                      >
                        Xác nhận
                      </Button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const rechargeModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: showRechargeModal,
    form: <RechargeForm />,
    backgroundColor: '#15151b',
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
    closeWhenClickOutSide: false,
  })
  return <>{rechargeModal}</>
}
