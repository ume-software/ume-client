import { CheckOne, CloseSmall } from '@icon-park/react'
import { Button, FieldLabel, FormInput, Modal } from '@ume/ui'
import momo from 'public/momo-logo.png'
import vnpay from 'public/vnpay-logo.png'
import { RechargeEnum } from '~/enumVariable/enumVariable'

import { useId, useState } from 'react'

import { QRCode } from 'antd'
import { Formik } from 'formik'
import Image from 'next/image'
import { StaticImageData } from 'next/legacy/image'
import * as Yup from 'yup'

import { trpc } from '~/utils/trpc'

interface IRechargeModalProps {
  showRechargeModal: boolean
  setShowRechargeModal: any
}

interface PaymentPlatformArrayProps {
  paymentPlatform: string
  imgSrc: StaticImageData | string
  tax: number
  type: string
}

const coinRechangeValue: number[] = [10000, 20000, 50000, 100000, 200000, 500000]
const paymentPlatformArray: PaymentPlatformArrayProps[] = [
  { paymentPlatform: 'MOMO', imgSrc: momo, tax: 0.01, type: 'QR' },
  { paymentPlatform: 'VNPAY', imgSrc: vnpay, tax: 0.01, type: 'VNPAY' },
]

interface ReachargeFromProps {
  handleClose: () => void
  qrContent: any
  setQRContent: any
}

const RechargeForm = ({ handleClose, qrContent, setQRContent }: ReachargeFromProps) => {
  const index = useId()
  const [platform, setPlatform] = useState<PaymentPlatformArrayProps>(paymentPlatformArray[0])
  const validationSchema = Yup.object().shape({
    balance: Yup.string().required('Xin hãy nhập số tiền').min(1).max(9, 'Chỉ được nhập nhiều nhất 9 chữ số'),
  })

  const requestRecharge = trpc.useMutation(['identity.request-recharge'])
  return (
    <div className="px-4 pb-4 my-2 text-white">
      <div className="w-full">
        <div className="px-4 pb-2">
          <div className="flex flex-col justify-center">
            <div>
              {paymentPlatformArray.map((item) => (
                <div
                  key={index}
                  className={`flex justify-between my-3  hover:bg-[#334155] ${
                    item.paymentPlatform == platform.paymentPlatform ? 'border-purple-700 border-2' : ''
                  } w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 cursor-pointer`}
                  onClick={() => setPlatform(item)}
                  onKeyDown={() => {}}
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
                  balance: '10,000',
                }}
                onSubmit={(values, { setErrors, setFieldError }) => {
                  if (Number(values.balance.replace(/,/g, '')) >= 10000) {
                    requestRecharge.mutate(
                      {
                        total: Number(values.balance.replace(/,/g, '')),
                        platform: platform.paymentPlatform,
                      },
                      {
                        onSuccess: (data) => {
                          if (data.data.dataStringType == RechargeEnum.REDIRECT_URL) {
                            handleClose()
                            window.open(`${data.data.dataString}`, '_blank')
                          } else if (data.data.dataStringType == RechargeEnum.QR) {
                            setQRContent(data.data)
                          }
                        },
                      },
                    )
                  } else {
                    setErrors({
                      balance: 'Số tiền tối thiểu là 10,000 VND',
                    })
                    setFieldError('balance', 'Số tiền tối thiểu là 10,000 VND')
                  }
                }}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, handleBlur, values, errors, isSubmitting, setValues, setFieldValue }) => (
                  <form>
                    <div className="grid w-full grid-cols-6 mb-5 place-items-center">
                      {coinRechangeValue.map((price) => (
                        <div
                          key={index}
                          className={`w-[135px] col-span-2 py-1 px-5 mb-3 bg-[#413F4D] ${
                            Number(values.balance.replace(/,/g, '')) == price ? 'border-purple-700 border-2' : ''
                          } rounded-xl cursor-pointer`}
                          onClick={() =>
                            setValues(
                              {
                                balance: price
                                  .toLocaleString('en-US', {
                                    currency: 'VND',
                                  })
                                  .toString(),
                              },
                              true,
                            )
                          }
                          onKeyDown={() => {}}
                        >
                          <div className="flex items-center justify-center text-lg font-semibold">
                            <p>
                              {price.toLocaleString('en-US', {
                                currency: 'VND',
                              })}
                            </p>
                            <span className="text-xs italic"> đ</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <p>Giá: </p>
                            <div className="flex items-center">
                              <p>
                                {(price + price * platform.tax).toLocaleString('en-US', {
                                  currency: 'VND',
                                })}
                              </p>
                              <span className="text-xs italic"> đ</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex flex-col gap-1 mb-2">
                        <FieldLabel labelName="Nhập số tiền cần nạp" className="text-sm text-slate-400" />
                        <FormInput
                          className="bg-[#413F4D] text-white"
                          type="text"
                          value={values.balance}
                          name="balance"
                          onChange={(e) => {
                            const inputValue = e.target.value.replace(/,/g, '')
                            const numericValue = parseFloat(inputValue)
                            const formattedValue = isNaN(numericValue) ? '0' : numericValue.toLocaleString()

                            setFieldValue('balance', formattedValue)
                          }}
                          onBlur={handleBlur}
                          error={!!errors.balance}
                          errorMessage={errors.balance}
                          autoComplete="off"
                        />
                      </div>
                      <div className="my-5">
                        <p className="text-end text-xs font-semibold text-red-500">
                          {/* Phí nạp là {platform.tax * 100}% + 2,000đ */}
                          Đã bao gồm phụ phí
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold">Tổng:</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xl font-semibold">
                              {(
                                Number(values.balance.replace(/,/g, '')) +
                                Number(values.balance.replace(/,/g, '')) * platform.tax +
                                2000
                              ).toLocaleString('en-US', {
                                currency: 'VND',
                              })}
                            </p>
                            <span className="text-xs italic"> VND</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        <div>
                          <Button
                            customCSS={`!rounded-2xl w-full !text-white py-2 px-8 font-semibold text-lg text-center ${
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
                      </div>
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

export const RechargeModal = ({ setShowRechargeModal, showRechargeModal }: IRechargeModalProps) => {
  const [qrContent, setQRContent] = useState<any>()

  const handleClose = () => {
    setShowRechargeModal(false)
    setTimeout(() => setQRContent(null), 1000)
  }

  const rechargeModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: showRechargeModal,
    customModalCSS: 'top-32',
    form: <RechargeForm handleClose={handleClose} qrContent={qrContent} setQRContent={setQRContent} />,
    backgroundColor: '#15151b',
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
    closeWhenClickOutSide: false,
  })
  return <>{rechargeModal}</>
}
