/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from '@headlessui/react'
import { Check, CloseSmall, Down } from '@icon-park/react'
import { Button, FormInputWithAffix, Modal } from '@ume/ui'

import { Fragment, useEffect, useState } from 'react'

import { notification } from 'antd'
import { useFormik } from 'formik'
import { UserPaymentSystemPagingResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import ConfirmForm from '~/components/confirm-form/confirm-form'

import { trpc } from '~/utils/trpc'

const UserRequestWithdraw = (props: {
  handleCloseUserPaymentPlatform: () => void
  userPaymentPlatformData: UserPaymentSystemPagingResponse['row']
}) => {
  const accountBalance = trpc.useQuery(['identity.account-balance'])
  const createWithdrawRequest = trpc.useMutation('identity.createWithdrawRequests')
  const utils = trpc.useContext()
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [userPaymentPlatformDataFilter, setUserPaymentPlatformDataFilter] = useState<
    UserPaymentSystemPagingResponse['row']
  >(props.userPaymentPlatformData)

  const form = useFormik({
    initialValues: {
      platformAccountId: '',
      platformAccount: '',
      withdrawMoney: '10,000',
    },
    validationSchema: Yup.object({
      platformAccountId: Yup.string().required('Số tài khoản là yêu cầu'),
      platformAccount: Yup.string().required('Số tài khoản là yêu cầu'),
      withdrawMoney: Yup.string().required('Xin hãy nhập số tiền').min(1).max(9, 'Chỉ được nhập nhiều nhất 9 chữ số'),
    }),
    onSubmit() {},
  })

  useEffect(() => {
    setUserPaymentPlatformDataFilter(
      props.userPaymentPlatformData?.filter(
        (item) =>
          item.platform.toLocaleLowerCase().includes(form.values.platformAccount.toLocaleLowerCase()) ||
          item.platformAccount.toLocaleLowerCase().includes(form.values.platformAccount.toLocaleLowerCase()) ||
          item.beneficiary.toLocaleLowerCase().includes(form.values.platformAccount.toLocaleLowerCase()),
      ) ?? [],
    )
  }, [form.values.platformAccountId, form.values.platformAccount])

  const handleWithdraw = () => {
    if (Number(form.values.withdrawMoney.replace(/,/g, '')) <= (accountBalance.data?.data.totalBalanceAvailable ?? 0)) {
      createWithdrawRequest.mutate(
        {
          userPaymentSystemId: form.values.platformAccountId,
          unitCurrency: 'VND',
          amountBalance: Number(form.values.withdrawMoney.replace(/,/g, '')),
        },
        {
          onSuccess() {
            props.handleCloseUserPaymentPlatform()
            utils.invalidateQueries(['identity.account-balance'])
            utils.invalidateQueries(['identity.getWithdrawRequests'])
            notification.success({
              message: 'Gửi yêu cầu rút tiền thành công',
              description: 'Yêu cầu rút tiền của bạn đã được gửi đi',
              placement: 'bottomLeft',
            })
          },
          onError() {
            notification.error({
              message: 'Gửi yêu cầu rút tiền thất bại',
              description: 'Yêu cầu rút tiền gửi thất bại. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    } else {
      notification.warning({
        message: 'Số dư không đủ',
        description: 'Số dư không đủ. Vui lòng kiểm tra lại!',
        placement: 'bottomLeft',
      })
    }
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    customModalCSS: 'top-32',
    form: (
      <>
        <ConfirmForm
          title="Tạo yêu cầu nạp tiền"
          description="Bạn có chấp nhận tạo yêu cầu nạp tiền hay không?"
          onClose={handleClose}
          isLoading={createWithdrawRequest.isLoading}
          onOk={() => {
            handleWithdraw()
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
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
  })

  return (
    <>
      {isModalConfirmationVisible && confirmModal}
      <form onSubmit={form.handleSubmit} className="text-white flex flex-col gap-7 p-10">
        <div className="space-y-2">
          <label>Nền tảng</label>
          <div>
            <FormInputWithAffix
              name="platformAccount"
              className={`bg-zinc-800 border border-white border-opacity-30`}
              styleInput={`bg-zinc-800 border-none focus:border-none outline-none`}
              value={form.values.platformAccount}
              onChange={(e) => {
                form.handleChange(e)
                setIsMenuShow(true)
              }}
              onBlur={form.handleBlur}
              error={!!form.errors.platformAccount && form.touched.platformAccount}
              errorMessage={''}
              autoComplete="off"
              position={'right'}
              component={<Down theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
              onClick={() => {
                setIsMenuShow(true)
                setUserPaymentPlatformDataFilter(
                  props.userPaymentPlatformData?.filter(
                    (item) =>
                      item.platform.toLocaleLowerCase().includes('') ||
                      item.platformAccount.toLocaleLowerCase().includes('') ||
                      item.beneficiary.toLocaleLowerCase().includes(''),
                  ) ?? [],
                )
              }}
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
                      {userPaymentPlatformDataFilter?.map((platform, index) => (
                        <div
                          key={index}
                          className={`flex gap-5 items-center ${
                            form.values.platformAccount.split('-')[0] == platform.platformAccount &&
                            form.values.platformAccount.split('-')[1] == platform.platform &&
                            form.values.platformAccount.split('-')[2] == platform.beneficiary
                              ? 'bg-gray-700'
                              : ''
                          } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                          onClick={() => {
                            form.setFieldValue(
                              'platformAccount',
                              `${platform.platformAccount}-${platform.platform}-${platform.beneficiary}`,
                            )
                            setIsMenuShow(false)
                          }}
                          onKeyDown={() => {}}
                        >
                          <p className="font-semibold text-mg">
                            {platform.platformAccount} - {platform.platform} - {platform.beneficiary}
                          </p>
                          <div>
                            {form.values.platformAccount.split('-')[0] == platform.platformAccount &&
                            form.values.platformAccount.split('-')[1] == platform.platform &&
                            form.values.platformAccount.split('-')[2] == platform.beneficiary ? (
                              <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      ))}

                      {!((userPaymentPlatformDataFilter ?? []).length > 0) && (
                        <p className="text-md font-normal">Không có kết quả</p>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            {!!form.errors.platformAccount && form.touched.platformAccount && (
              <p className="text-xs text-red-500">{form.errors.platformAccount}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label>Số tiền rút</label>
          <FormInputWithAffix
            name="withdrawMoney"
            type="text"
            className={`bg-zinc-800 rounded border border-white border-opacity-30`}
            styleInput={`bg-zinc-800 border-none focus:border-none outline-none`}
            value={form.values.withdrawMoney}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/,/g, '')
              const numericValue = parseFloat(inputValue)
              const formattedValue = isNaN(numericValue) ? '0' : numericValue.toLocaleString()

              form.setFieldValue('withdrawMoney', formattedValue)
            }}
            onBlur={form.handleBlur}
            error={!!form.errors.withdrawMoney && form.touched.withdrawMoney}
            errorMessage={''}
            autoComplete="off"
            position={'right'}
            component={<span className="h-5 text-xs italic"> đ</span>}
          />
          {!!form.errors.withdrawMoney && form.touched.withdrawMoney && (
            <p className="text-xs text-red-500">{form.errors.withdrawMoney}</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-end text-xs font-semibold text-red-500">Phí rút là 1% + 2,000đ</p>
          <div className="flex justify-between items-center text-2xl font-bold">
            <p>Tổng: </p>
            <span className="flex justify-start items-center gap-2">
              {Number(form.values.withdrawMoney.replace(/,/g, '')) -
                Number(form.values.withdrawMoney.replace(/,/g, '')) * 0.001 -
                1000 >
                0 &&
                (
                  Number(form.values.withdrawMoney.replace(/,/g, '')) -
                  Number(form.values.withdrawMoney.replace(/,/g, '')) * 0.001 -
                  1000
                ).toLocaleString('en-US', {
                  currency: 'VND',
                })}
              <p className="text-xs italic"> VND</p>
            </span>
          </div>
        </div>

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

          <Button
            customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
            type="button"
            isActive={true}
            isOutlinedButton={true}
            onClick={() => {
              const platformAcc = props.userPaymentPlatformData?.find(
                (platform) =>
                  form.values.platformAccount.split('-')[0] == platform.platformAccount &&
                  form.values.platformAccount.split('-')[1] == platform.platform &&
                  form.values.platformAccount.split('-')[2] == platform.beneficiary,
              )
              if (Number(form.values.withdrawMoney.replace(/,/g, '')) < 10000) {
                form.setFieldError('withdrawMoney', 'Số tiền rút phải lớn hơn 10,000')
              } else if (platformAcc) {
                form.setFieldValue('platformAccountId', platformAcc.id)
                setIsModalConfirmationVisible(true)
              } else {
                form.setFieldValue('platformAccountId', '')
                notification.warning({
                  message: 'Tài khoản không tồn tại',
                  description: 'Tài khoản không tồn tại. Vui lòng kiểm tra lại!',
                  placement: 'bottomLeft',
                })
              }
            }}
          >
            Rút tiền
          </Button>
        </div>
      </form>
    </>
  )
}
export default UserRequestWithdraw
