import { CheckOne, CloseSmall } from '@icon-park/react'
import { Button, FieldLabel, FormInput, Modal } from '@ume/ui'
import coin from 'public/coin-icon.png'
import momo from 'public/momo-logo.png'

import { useState } from 'react'

import { QRCode } from 'antd'
import { Formik, FormikErrors } from 'formik'
import { values } from 'lodash'
import Image from 'next/image'
import { StaticImageData } from 'next/legacy/image'
import * as Yup from 'yup'

import { trpc } from '~/utils/trpc'

interface IRechargeModalProps {
  showRechargeModal: boolean
  setShowRechargeModal: any
}

interface IFormValue {
  platform: string
  balance: string
}
interface paymentPlatformArrayProps {
  paymentPlatform: string
  imgSrc: StaticImageData | string
  isChoose: boolean
}

// const validate = (value: IFormValue): FormikErrors<IFormValue> => {
//   const errors: FormikErrors<IFormValue> = {}
//   if (!value.balance) {
//     errors.balance = 'Xin hãy nhập số tiền'
//   }
//   if (!value.platform) {
//     errors.platform = 'Xin hãy chọn phương thức thanh toán'
//   }
//   return errors
// }

const coinRechangeValue: number[] = [10000, 20000, 50000, 100000, 200000, 500000]
const paymentPlatformArray: paymentPlatformArrayProps[] = [{ paymentPlatform: 'MOMO', imgSrc: momo, isChoose: false }]

export const RechargeModal = ({ setShowRechargeModal, showRechargeModal }: IRechargeModalProps) => {
  const [qrContent, setQRContent] = useState<any>()
  const [isSubmiting, setSubmiting] = useState(false)
  const handleClose = () => {
    setShowRechargeModal(false)
    // setTimeout(() => setOpenTabMomo(false), 1000)
    setTimeout(() => setQRContent(null), 1000)
  }

  const validationSchema = Yup.object().shape({
    balance: Yup.string().required('Xin hãy nhập số tiền'),
    platform: Yup.string().required('Xin hãy chọn phương thức thanh toán'),
  })

  const requestRecharge = trpc.useMutation(['identity.request-recharge'])
  const RechargeForm = () => {
    return (
      <div className="px-4 pb-4 my-2 text-white">
        <div className="w-full">
          <div className="px-4 pb-2">
            <div className="flex flex-col justify-center">
              {!qrContent && (
                <Formik
                  initialValues={{
                    balance: '',
                    platform: '',
                  }}
                  onSubmit={(values) => {
                    setSubmiting(true)
                    requestRecharge.mutate(
                      {
                        total: values.balance,
                        platform: values.platform,
                      },
                      {
                        onSuccess: (data) => {
                          setQRContent(data.data)
                          setSubmiting(false)
                        },
                        onError: (error) => {
                          console.log(error)
                        },
                      },
                    )
                  }}
                  validationSchema={validationSchema}
                >
                  {({ handleSubmit, handleChange, handleBlur, values, errors, isSubmitting, setValues }) => (
                    <form>
                      <div className="w-full grid grid-cols-6 place-items-center mb-5">
                        {coinRechangeValue.map((price, index) => (
                          <>
                            <div
                              key={index}
                              className={`w-[130px] col-span-6 md:col-span-3 lg:col-span-2 py-1 px-5 mb-3 bg-[#413F4D] ${
                                Number(values.balance) == price / 1000 ? 'border-purple-700 border-2' : ''
                              } rounded-xl cursor-pointer`}
                              onClick={() =>
                                setValues({ balance: (price / 1000).toString(), platform: values.platform }, true)
                              }
                            >
                              <div className="flex justify-start items-center">
                                <p>{price / 1000}</p>
                                <Image src={coin} width={40} height={40} alt="coin" />
                              </div>
                              <div className="flex items-center">
                                <p>
                                  {(price + price * 0.001).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'VND',
                                  })}
                                </p>
                                <span className="text-xs italic"> VND</span>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      <div>
                        <div className="flex flex-col gap-1 mb-2">
                          <FieldLabel labelName="Nhập số lượng ume coin cần nạp" className="text-sm text-slate-400" />
                          <FormInput
                            className="bg-[#413F4D] text-white"
                            type="number"
                            min={1}
                            value={values.balance}
                            name="balance"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.balance}
                            errorMessage={errors.balance}
                            autoComplete="off"
                          />
                        </div>
                        <div>
                          {!!errors.platform ? <div className="text-sm text-red-500">{errors.platform}</div> : ''}
                          <div
                            className={`flex ${
                              errors.platform ? 'border-red-500 border-2 rounded-xl' : ''
                            } cursor-pointer`}
                          >
                            {paymentPlatformArray.map((item, index) => (
                              <div
                                key={index}
                                className={`flex justify-between my-3  hover:bg-[#334155] ${
                                  item.paymentPlatform == values.platform ? 'border-purple-700 border-2' : ''
                                } w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 `}
                                onClick={() =>
                                  setValues({ balance: values.balance, platform: item.paymentPlatform }, true)
                                }
                              >
                                <div className="flex justify-start gap-2">
                                  <span>
                                    <Image src={item.imgSrc} alt="logo-momo" width={20} height={20} />
                                  </span>
                                  <span>Nạp tiền qua {item.paymentPlatform}</span>
                                </div>
                                {item.paymentPlatform == values.platform ? (
                                  <CheckOne theme="filled" size="20" fill="#7e22ce" strokeLinejoin="bevel" />
                                ) : (
                                  ''
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          customCSS="bg-[#37354F] py-1 mt-2 hover:bg-slate-700 !rounded-3xl max-h-10 w-full text-[15px] hover:ease-in-out"
                          type="button"
                          onClick={() => {
                            handleSubmit()
                          }}
                          disabled={isSubmitting}
                        >
                          Xác nhận
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </div>

            <div>
              {qrContent && (
                <div>
                  <div className="flex justify-between flex-1 gap-3 scale-100">
                    <div className="text-center">
                      <div className="text-base font-semibold">Vui lòng quét mã QR</div>
                      <QRCode bordered={true} value={qrContent?.qrString} color="#FFF" />
                    </div>
                    <div className="flex flex-col items-start gap-4 mt-8">
                      <div>
                        <span className="font-semibold">Số tiền:</span>
                        <span className="ml-1">
                          {qrContent?.amountMoney?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: qrContent?.unitCurrency,
                          })}
                          <span className="text-xs italic"> {qrContent?.unitCurrency}</span>
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Người nhận:</span>
                        <span className="ml-1">{qrContent?.beneficiary}</span>
                      </div>
                      <div className="inline-flex flex-wrap">
                        <span className="w-20 font-semibold">Nội dung:</span>
                        <span className="ml-1 truncate">{qrContent?.transactionCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div>
                      <Button
                        customCSS="bg-[#37354F] py-1 mt-2 hover:bg-slate-700 !rounded-3xl max-h-10 w-full text-[15px] hover:ease-in-out"
                        type="button"
                        onClick={handleClose}
                      >
                        Xác nhận đã nạp tiền
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
