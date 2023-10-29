/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from '@headlessui/react'
import { Check, CloseSmall, Down } from '@icon-park/react'
import { Button, FormInput, FormInputWithAffix, Modal } from '@ume/ui'
import coin from 'public/coin-icon.png'
import { ActionEnum } from '~/enumVariable/enumVariable'

import { Fragment, useEffect, useState } from 'react'

import { notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import { UserPaymentSystemRequestPlatformEnum, UserPaymentSystemResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import ConfirmForm from '~/components/confirm-form/confirmForm'

import { trpc } from '~/utils/trpc'

interface PlatformProps {
  key: string
  label: string
}

const platforms: PlatformProps[] = [
  { key: UserPaymentSystemRequestPlatformEnum.Momo, label: 'Momo' },
  { key: UserPaymentSystemRequestPlatformEnum.Bidv, label: 'BIDV' },
  { key: UserPaymentSystemRequestPlatformEnum.Tpb, label: 'TPBank' },
  { key: UserPaymentSystemRequestPlatformEnum.Vnpay, label: 'VNPay' },
  { key: UserPaymentSystemRequestPlatformEnum.Zalopay, label: 'ZaloPay' },
]

const UserPaymentPlatform = (props: {
  handleCloseUserPaymentPlatform: () => void
  paymentAccount: UserPaymentSystemResponse | undefined
}) => {
  const [actionModal, setActionModal] = useState(ActionEnum.CREATE)
  const createUserPaymentSystem = trpc.useMutation('identity.createUserPaymentSystem')
  const utils = trpc.useContext()
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)

  const form = useFormik({
    initialValues: {
      platform: '',
      platformAccount: '',
      beneficiary: '',
      withdrawMoney: 1,
    },
    validationSchema: Yup.object({
      platform: Yup.string().test('is-valid-platform', 'Nền tảng không hợp lệ', (value) => {
        return platforms.some((platform) => platform.key === value)
      }),
      platformAccount: Yup.string().required('Số tài khoản là yêu cầu'),
      beneficiary: Yup.string().required('Tên người nhận là yêu cầu'),
      withdrawMoney: Yup.number()
        .lessThan(10001, 'Số tiền rút phải ít hơn 10.000')
        .moreThan(0, 'Số tiền rút không được âm'),
    }),
    onSubmit() {
      setIsModalConfirmationVisible(true)
    },
  })

  useEffect(() => {
    if (props.paymentAccount) {
      form.setValues({
        platform: props.paymentAccount.platform,
        platformAccount: props.paymentAccount.platformAccount,
        beneficiary: props.paymentAccount.beneficiary,
        withdrawMoney: 1,
      })
    }
  }, [props.paymentAccount])

  const handleCreateUserPaymentSystem = () => {
    createUserPaymentSystem.mutate(
      {
        platform: form.values.platform as UserPaymentSystemRequestPlatformEnum,
        platformAccount: form.values.platformAccount,
        beneficiary: form.values.beneficiary,
      },
      {
        onSuccess() {
          props.handleCloseUserPaymentPlatform()
          utils.invalidateQueries(['identity.getUserPaymentSystems'])
          notification.success({
            message: 'Thêm tài khoản rút tiền thành công',
            description: 'Tài khoản rút tiền vừa được thêm',
            placement: 'bottomLeft',
          })
        },
        onError() {
          notification.error({
            message: 'Thêm tài khoản rút tiền thất bại',
            description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        },
      },
    )
  }

  const handleWithdraw = () => {
    console.log(actionModal)
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Thay đổi thông tin cá nhân"
          description="Bạn có chấp nhận thay đổi thông tin cá nhân hay không?"
          onClose={handleClose}
          onOk={() => {
            actionModal == ActionEnum.CREATE ? handleCreateUserPaymentSystem() : handleWithdraw()
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
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
  })
  return (
    <>
      {isModalConfirmationVisible && confirmModal}
      <form onSubmit={form.handleSubmit} className="text-white flex flex-col gap-7 p-10">
        <div className="space-y-2">
          <label>Nền tảng</label>
          <div>
            <FormInputWithAffix
              name="platform"
              className={`${
                props.paymentAccount && form.values.platform == props.paymentAccount?.platform
                  ? 'bg-zinc-800'
                  : 'bg-gray-700'
              } rounded border border-white border-opacity-30`}
              styleInput={`${
                props.paymentAccount && form.values.platform == props.paymentAccount?.platform
                  ? 'bg-zinc-800'
                  : 'bg-gray-700'
              } border-none focus:border-none outline-none`}
              value={form.values.platform}
              onChange={(e) => form.handleChange(e)}
              onBlur={form.handleBlur}
              error={!!form.errors.platform && form.touched.platform}
              errorMessage={''}
              autoComplete="off"
              position={'right'}
              component={<Down theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
              onClick={() => setIsMenuShow(true)}
            />
            <div className="relative w-full">
              <Menu>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-400"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-400"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  show={isMenuShow}
                >
                  <Menu.Items
                    className="absolute right-0 left-0 p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[150px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar"
                    style={{ zIndex: 5 }}
                  >
                    <div
                      className="flex flex-col gap-2"
                      style={{ zIndex: 10 }}
                      onMouseLeave={() => setIsMenuShow(false)}
                    >
                      {platforms
                        .filter(
                          (platform) =>
                            platform.key.toLowerCase().includes(form.values.platform.toLowerCase()) ||
                            platform.label.toLowerCase().includes(form.values.platform.toLowerCase()),
                        )
                        .map((platform) => (
                          <>
                            <div
                              className={`flex gap-5 items-center ${
                                form.values.platform == platform.key ? 'bg-gray-700' : ''
                              } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                              onClick={() => {
                                form.setFieldValue('platform', platform.key)
                              }}
                            >
                              <p className="font-semibold text-mg">{platform.label}</p>
                              <div>
                                {form.values.platform == platform.key ? (
                                  <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </>
                        ))}

                      {!(
                        platforms.filter(
                          (platform) =>
                            platform.key.toLowerCase().includes(form.values.platform.toLowerCase()) ||
                            platform.label.toLowerCase().includes(form.values.platform.toLowerCase()),
                        ).length > 0
                      ) && <p className="text-md font-normal">Không có kết quả</p>}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            {!!form.errors.platform && form.touched.platform && (
              <p className="text-xs text-red-500">{form.errors.platform}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label>Tài khoản nhận tiền</label>
          <FormInput
            name="platformAccount"
            className={`${
              props.paymentAccount && form.values.platformAccount == props.paymentAccount?.platformAccount
                ? 'bg-zinc-800'
                : 'bg-gray-700'
            } border border-white border-opacity-30`}
            value={form.values.platformAccount}
            onChange={(e) => form.handleChange(e)}
            onBlur={form.handleBlur}
            error={!!form.errors.platformAccount && form.touched.platformAccount}
            errorMessage={''}
            autoComplete="off"
          />
          {!!form.errors.platformAccount && form.touched.platformAccount && (
            <p className="text-xs text-red-500">{form.errors.platformAccount}</p>
          )}
        </div>
        <div className="space-y-2">
          <label>Tên người nhận</label>
          <FormInput
            name="beneficiary"
            className={`${
              props.paymentAccount && form.values.beneficiary == props.paymentAccount?.beneficiary
                ? 'bg-zinc-800'
                : 'bg-gray-700'
            } border border-white border-opacity-30`}
            value={form.values.beneficiary}
            onChange={(e) => form.handleChange(e)}
            onBlur={form.handleBlur}
            error={!!form.errors.beneficiary && form.touched.beneficiary}
            errorMessage={''}
            autoComplete="off"
          />
          {!!form.errors.beneficiary && form.touched.beneficiary && (
            <p className="text-xs text-red-500">{form.errors.beneficiary}</p>
          )}
        </div>
        {props.paymentAccount?.id &&
          !(
            form.values.platform != props.paymentAccount?.platform ||
            form.values.platformAccount != props.paymentAccount?.platformAccount ||
            form.values.beneficiary != props.paymentAccount?.beneficiary
          ) && (
            <div className="space-y-2">
              <label>Số tiền rút</label>
              <FormInputWithAffix
                name="withdrawMoney"
                type="number"
                className={`${
                  props.paymentAccount && form.values.platform == props.paymentAccount?.platform
                    ? 'bg-zinc-800'
                    : 'bg-gray-700'
                } rounded border border-white border-opacity-30`}
                styleInput={`${
                  props.paymentAccount && form.values.platform == props.paymentAccount?.platform
                    ? 'bg-zinc-800'
                    : 'bg-gray-700'
                } border-none focus:border-none outline-none`}
                value={form.values.withdrawMoney}
                onChange={(e) => form.handleChange(e)}
                onBlur={form.handleBlur}
                error={!!form.errors.withdrawMoney && form.touched.withdrawMoney}
                errorMessage={''}
                autoComplete="off"
                position={'right'}
                component={<Image src={coin} width={30} height={30} alt="coin" />}
              />
              {!!form.errors.withdrawMoney && form.touched.withdrawMoney && (
                <p className="text-xs text-red-500">{form.errors.withdrawMoney}</p>
              )}
            </div>
          )}

        <div className="flex justify-center gap-5 mt-5">
          <Button
            isActive={false}
            isOutlinedButton={true}
            type="button"
            customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
            onClick={props.handleCloseUserPaymentPlatform}
          >
            Hủy
          </Button>

          {form.values.platform != props.paymentAccount?.platform ||
          form.values.platformAccount != props.paymentAccount?.platformAccount ||
          form.values.beneficiary != props.paymentAccount?.beneficiary ? (
            <Button
              customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
              type="submit"
              isActive={true}
              isOutlinedButton={true}
              onClick={() => {
                props.paymentAccount?.id ? setActionModal(ActionEnum.UPDATE) : setActionModal(ActionEnum.CREATE)
              }}
            >
              Lưu
            </Button>
          ) : (
            <Button
              customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
              type="submit"
              isActive={true}
              isOutlinedButton={true}
              onClick={() => setActionModal(ActionEnum.WITHDRAW)}
            >
              Rút tiền
            </Button>
          )}
        </div>
      </form>
    </>
  )
}
export default UserPaymentPlatform
