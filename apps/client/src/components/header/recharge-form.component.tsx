import { CheckOne, CloseSmall } from '@icon-park/react'
import { Button, FieldLabel, FormInput, Modal } from '@ume/ui'
import coin from 'public/coin-icon.png'
import momo from 'public/momo-logo.png'
import vnpay from 'public/vnpay-logo.png'
import { RechargeEnum } from '~/enumVariable/enumVariable'

import { useState } from 'react'

import { QRCode } from 'antd'
import { Formik } from 'formik'
import Image from 'next/image'
import { StaticImageData } from 'next/legacy/image'
import { useRouter } from 'next/router'
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
  tax: number
  type: string
}

const coinRechangeValue: number[] = [10000, 20000, 50000, 100000, 200000, 500000]
const paymentPlatformArray: paymentPlatformArrayProps[] = [
  { paymentPlatform: 'MOMO', imgSrc: momo, tax: 0.01, type: 'QR' },
  { paymentPlatform: 'VNPAY', imgSrc: vnpay, tax: 0.03, type: 'VNPAY' },
]

export const RechargeModal = ({ setShowRechargeModal, showRechargeModal }: IRechargeModalProps) => {
  const [qrContent, setQRContent] = useState<any>()
  const [isSubmiting, setSubmiting] = useState(false)
  const [platform, setPlatform] = useState<paymentPlatformArrayProps>(paymentPlatformArray[0])
  const handleClose = () => {
    setShowRechargeModal(false)
    setTimeout(() => setQRContent(null), 1000)
  }

  const validationSchema = Yup.object().shape({
    balance: Yup.string()
      .required('Xin hãy nhập số tiền')
      .matches(/^[0-9]+$/)
      .min(1)
      .max(7, 'Chỉ được nhập nhiều nhất 7 chữ số'),
  })

  const requestRecharge = trpc.useMutation(['identity.request-recharge'])

  const RechargeForm = () => {
    return (
      <div className="px-4 pb-4 my-2 text-white">
        <div className="w-full">
          <div className="px-4 pb-2">
            <div className="flex flex-col justify-center">
              <div>
                {paymentPlatformArray.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between my-3  hover:bg-[#334155] ${
                      item.paymentPlatform == platform.paymentPlatform ? 'border-purple-700 border-2' : ''
                    } w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 cursor-pointer`}
                    onClick={() => setPlatform(item)}
                  >
                    <div className="flex justify-start gap-2">
                      <span>
                        <Image src={item.imgSrc} alt="logo-momo" width={20} height={20} />
                      </span>
                      <p>Nạp tiền qua {item.paymentPlatform}</p>
                    </div>
                    {item.paymentPlatform == platform.paymentPlatform ? (
                      <CheckOne theme="filled" size="20" fill="#7e22ce" strokeLinejoin="bevel" />
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </div>
              {!qrContent && (
                <Formik
                  initialValues={{
                    balance: '10',
                  }}
                  onSubmit={(values) => {
                    setSubmiting(true)
                    requestRecharge.mutate(
                      {
                        total: values.balance,
                        platform: platform.paymentPlatform,
                      },
                      {
                        onSuccess: (data) => {
                          setSubmiting(false)
                          if (data.data.dataStringType == RechargeEnum.REDIRECT_URL) {
                            handleClose()
                            window.open(`${data.data.dataString}`, '_blank')
                          } else if (data.data.dataStringType == RechargeEnum.QR) {
                            setQRContent(data.data)
                          }
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
                              onClick={() => setValues({ balance: (price / 1000).toString() }, true)}
                            >
                              <div className="flex justify-start items-center">
                                <p>{price / 1000}</p>
                                <Image src={coin} width={40} height={40} alt="coin" />
                              </div>
                              <div className="flex items-center">
                                <p>
                                  {(price + price * platform.tax).toLocaleString('en-US', {
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
                        <div className="my-5 flex justify-between items-center">
                          <p className="text-xl font-semibold">Tổng:</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xl font-semibold">
                              {((Number(values.balance) + Number(values.balance) * platform.tax) * 1000).toLocaleString(
                                'en-US',
                                {
                                  currency: 'VND',
                                },
                              )}
                            </p>
                            <span className="text-xs italic"> VND</span>
                          </div>
                        </div>
                        <Button
                          customCSS={`mt-10 !rounded-2xl w-full !text-white py-1 font-semibold text-lg text-center ${
                            values.balance && 'hover:scale-105'
                          }`}
                          type="button"
                          isActive={true}
                          isOutlinedButton={!!values.balance}
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
