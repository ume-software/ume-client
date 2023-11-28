import { CloseSmall } from '@icon-park/react'
import { Button, InputWithAffix, Modal, TextArea } from '@ume/ui'

import { useState } from 'react'

import { notification } from 'antd'
import { parse } from 'cookie'
import { Formik } from 'formik'
import * as Yup from 'yup'

import ConfirmForm from '~/components/confirm-form/confirm-form'

import { trpc } from '~/utils/trpc'

interface DonateProps {
  donateValue: string
  donateContent?: string
}

const DonateModal = ({ isModalDonationVisible, setIsModalDonationVisible, providerId }) => {
  const accessToken = parse(document.cookie).accessToken

  const [donationValues, setDonationValues] = useState<DonateProps>({ donateValue: '1,000' })

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)

  const balance = trpc.useQuery(['identity.account-balance'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: !!accessToken,
  })

  const donationForRecipient = trpc.useMutation(['booking.donationForRecipient'])

  const utils = trpc.useContext()

  const handleCloseDonationModal = () => {
    setIsModalDonationVisible(false)
  }
  const handleCloseComfirmModal = () => {
    setIsModalConfirmationVisible(false)
  }
  const validationSchema = Yup.object().shape({
    donateValue: Yup.string().required('Xin hãy nhập số tiền').min(1).max(7, 'Chỉ được nhập nhiều nhất 7 chữ số'),
  })

  const donateModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseDonationModal,
    title: <p className="text-white">Tặng quà</p>,
    show: isModalDonationVisible,
    form: (
      <>
        <Formik
          initialValues={{
            donateValue: '1,000',
            donateContent: undefined,
          }}
          onSubmit={(values) => {
            setDonationValues({ donateValue: values.donateValue, donateContent: values.donateContent })
          }}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
            <div className="flex flex-col gap-5 p-10 text-white">
              <div className="space-y-2">
                <label>Tiền quà: </label>
                <InputWithAffix
                  placeholder="Tiền donate"
                  value={values.donateValue}
                  name="donateValue"
                  type="text"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/,/g, '')
                    const numericValue = parseFloat(inputValue)
                    const formattedValue = isNaN(numericValue) ? '0' : numericValue.toLocaleString()

                    setFieldValue('donateValue', formattedValue)
                  }}
                  className="w-full max-h-[50px] bg-zinc-800 border border-white border-opacity-30 rounded-xl my-2"
                  styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                  position="right"
                  component={<span className="text-xs italic"> đ</span>}
                  autoComplete="off"
                  onBlur={handleBlur}
                />
                {!!errors.donateValue && <p className="pl-3 text-xs text-red-500">{errors.donateValue}</p>}
              </div>
              <div className="space-y-2">
                <label>Nội dung: </label>
                <TextArea
                  name="donateContent"
                  className="bg-zinc-800 w-full max-h-[140px]"
                  rows={5}
                  value={values.donateContent}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full text-center">
                <Button
                  customCSS={`text-md py-2 px-5 rounded-xl ${
                    !errors.donateValue ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'
                  }`}
                  type="button"
                  isActive={!errors.donateValue}
                  isOutlinedButton={true}
                  onClick={() => {
                    if (
                      (balance.data?.data.totalBalanceAvailable ?? 0) > Number(values.donateValue.replace(/,/g, ''))
                    ) {
                      handleSubmit()
                      setIsModalConfirmationVisible(true)
                    } else {
                      notification.warning({
                        message: 'Tài khoản không đủ',
                        description: 'Bạn không có đủ tiền. Vui lòng nạp thêm!',
                        placement: 'bottomLeft',
                      })
                    }
                  }}
                >
                  Chấp nhận
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleCloseDonationModal}
        onKeyDown={() => {}}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseComfirmModal,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title={`Donate cho nhà cung cấp `}
          description={`Bạn có chấp nhận donate cho nhà cung cấp này hay không?`}
          onClose={handleCloseComfirmModal}
          onOk={() => {
            donationForRecipient.mutate(
              {
                recipientId: providerId,
                amount: Number(donationValues.donateValue.replace(/,/g, '')),
                message: donationValues.donateContent,
              },
              {
                onSuccess() {
                  notification.success({
                    message: 'Donate thành công!',
                    description: 'Nhà cung cấp đã nhận được tấm lòng của bạn :>',
                    placement: 'bottomLeft',
                  })
                  utils.invalidateQueries('identity.account-balance')
                  handleCloseComfirmModal()
                  handleCloseDonationModal()
                },
                onError() {
                  notification.error({
                    message: 'Donate thất bại!',
                    description: 'Có lỗi trong hệ thống của chúng tôi. Vui lòng thử lại sau :<',
                    placement: 'bottomLeft',
                  })
                },
              },
            )
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleCloseComfirmModal}
        onKeyDown={(e) => e.key === 'Enter' && handleCloseComfirmModal()}
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
      {isModalConfirmationVisible && confirmModal} {donateModal}
    </>
  )
}
export default DonateModal
