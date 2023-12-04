import { Plus } from '@icon-park/react'
import { Button, TextArea } from '@ume/ui'
import { uploadWithdrawalImage } from '~/api/upload-media'

import React, { useRef, useState } from 'react'

import { Select, Spin, notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import * as Yup from 'yup'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

interface IWithdrawTransactionProps {
  id: string
  closeFunction: any | undefined
  openValue: boolean
}
const WithdrawalTransactionModal = ({ id, openValue, closeFunction }: IWithdrawTransactionProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const utils = trpc.useContext()
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const approveWithdrawRequest = trpc.useMutation(['transaction.approveWithdrawRequest'])
  const [withdrawalDetails, setWithdrawalDetails] = useState<any>()
  const SELECT = ['$all', { requester: ['$all'], userPaymentSystem: ['$all'] }]

  const form = useFormik({
    initialValues: {
      billImageUrl: '',
      feedback: '',
      status: 'COMPLETED',
      selectedImage: null,
    },
    validationSchema: Yup.object({
      billImageUrl: Yup.string().required('Tên là bắt buộc'),
      feedback: Yup.string().required('Nội dung là bắt buộc'),
    }),
    onSubmit: () => {
      openConfirmModal()
    },
  })

  const { isLoading } = trpc.useQuery(
    [
      'transaction.getWithdrawalDetails',
      {
        id: id,
        select: JSON.stringify(SELECT),
      },
    ],
    {
      onSuccess(data) {
        setWithdrawalDetails(data?.data as any)
      },
    },
  )

  function openCancelConfirmHandle() {
    setOpenConfirm(true)
  }
  function closeComfirmFormHandle() {
    setIsUpdate(false)
    setOpenConfirm(false)
  }

  function openConfirmModal() {
    setIsUpdate(true)
    setOpenConfirm(true)
  }
  function clearData() {
    form.resetForm()
  }
  function cancelConfirmHandle() {
    setOpenConfirm(false)
    clearData()
    setTimeout(function () {
      setIsUpdate(false)
      closeFunction()
    }, 50)
  }

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        form.setFieldValue('selectedImage', file)
        form.setFieldValue('billImageUrl', URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }
  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }
  function handleChangeStatus(status) {
    form.setFieldValue('status', status)
  }
  function isDisableButton() {
    return !form.isValid || form.values.status == ''
  }
  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (form.values.selectedImage) {
        const formData = new FormData()
        formData.append('image', form.values.selectedImage)
        const responseData = await uploadWithdrawalImage(formData)
        if (responseData?.data?.data?.results) {
          responseData?.data?.data?.results.map((image) => {
            imageUrl = image
          })
        }
      }
    } catch (error) {
      notification.error({
        message: 'Tạo thất bại!',
        description: 'Lưu ảnh tài khoản không thành công.',
      })
      console.error('Error uploading image:', error)
      cancelConfirmHandle()
      return null
    }
    return { imageUrl }
  }

  async function submitHandle() {
    const imgURL = await uploadImage()
    try {
      if (imgURL) {
        const action = {
          billImageUrl: form.values.billImageUrl,
          feedback: form.values.feedback,
          status: form.values.status,
        }
        approveWithdrawRequest.mutate(
          { id, action },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Cập nhật thành công!',
                  description: 'Trạng thái cập nhật thành công.',
                })
                utils.invalidateQueries('transaction.getWithdrawRequest')
                cancelConfirmHandle()
              }
            },
            onError: () => {
              notification.error({
                message: 'Cập nhật thất bại!',
                description: 'Trạng thái cập nhật không thành công.',
              })
              cancelConfirmHandle()
            },
          },
        )
      }
    } catch (error) {
      console.error('Failed to patch voucher:', error)
    }
  }

  return (
    <ModalBase
      width={'60%'}
      titleValue="Yêu cầu rút tiền"
      openValue={openValue}
      closeFunction={openCancelConfirmHandle}
      className="w-auto bg-black"
    >
      <div className="flex justify-center items-center text-white m-4">
        {isLoading ? (
          <Spin />
        ) : (
          <div className="w-full">
            {withdrawalDetails && (
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">Thông tin giao dịch</span>
                <div className="border-2 border-white grid grid-cols-2 gap-2 rounded-lg py-3 px-5 min-w-[60%]">
                  <span className="font-bold"> Người thụ hưởng: </span>
                  <span> {withdrawalDetails.userPaymentSystem?.beneficiary}</span>
                  <span className="font-bold"> Số tiền rút: </span>
                  <span> {`${withdrawalDetails.amountMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ`}</span>
                  <span className="font-bold"> Nền tảng giao dịch: </span>
                  <span> {withdrawalDetails.userPaymentSystem?.platform}</span>
                  <span className="font-bold"> Số tài khoản: </span>
                  <span> {withdrawalDetails.userPaymentSystem?.platformAccount}</span>
                  <span className="font-bold"> Nội dung giao dịch: </span>
                  <span> &ldquo;Rút tiền từ Ume system&rdquo;</span>
                </div>
                <div className="border-2 border-gray-400 w-full my-5"></div>
                <div className="flex flex-col min-w-[80%] items-center">
                  <span className="font-bold text-lg">Xác minh trạng thái giao dịch</span>
                  <div className="rounded-lg p-3 w-[90%]">
                    <form
                      autoComplete="off"
                      onSubmit={(e) => {
                        e.preventDefault()
                      }}
                      className="text-white grid grid-cols-3 gap-4"
                    >
                      <label className="font-bold col-span-1" htmlFor="status">
                        Trạng thái:
                      </label>
                      <div className=" col-span-2">
                        <Select
                          placeholder="Trạng thái"
                          defaultValue={form.values.status}
                          value={form.values.status}
                          onChange={handleChangeStatus}
                          optionLabelProp="label"
                          style={{
                            maxWidth: '8rem',
                          }}
                          options={[
                            {
                              value: 'COMPLETED',
                              label: 'Thành công',
                            },
                            {
                              value: 'REJECTED',
                              label: 'Thất bại',
                            },
                          ]}
                        />
                      </div>

                      <label className="font-bold col-span-1" htmlFor="billImageUrl">
                        Ảnh xác minh:
                      </label>
                      <div className=" col-span-2">
                        <div
                          className={`w-36 h-48 overflow-hidden rounded-md bg-[#413F4D] ${
                            !form.values.billImageUrl &&
                            ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'
                          }`}
                          onClick={handleImageClick}
                        >
                          {form.values.billImageUrl && (
                            <Image
                              className="overflow-hidden"
                              width={144}
                              height={208}
                              src={form.values.billImageUrl}
                              alt=""
                              objectFit="cover"
                            />
                          )}
                          {!form.values.billImageUrl && (
                            <div className="flex items-center justify-center w-full h-full hover:scale-150">
                              <Plus className="" theme="filled" size="24" fill="#ffffff" />
                            </div>
                          )}
                          <input
                            className="w-0 opacity-0"
                            type="file"
                            name="files"
                            accept="image/*"
                            ref={imageInputRef}
                            onChange={(e) => handleMediaChange(e)}
                            multiple
                          />
                        </div>
                      </div>
                      <label className="font-bold col-span-1" htmlFor="feedback">
                        Nội dung:
                      </label>
                      <TextArea
                        name="feedback"
                        className={`bg-[#413F4D] border-2 w-4/5 max-h-[140px] col-span-2 ${
                          form.errors.feedback && form.touched.feedback ? 'placeholder:text-red-500' : ''
                        }`}
                        rows={5}
                        value={form.values.feedback}
                        onChange={form.handleChange}
                      />
                      <div className="col-span-3 flex justify-center pb-4 mt-10">
                        <Button
                          isActive={false}
                          onClick={openCancelConfirmHandle}
                          customCSS={`mx-6 px-4 py-1 border-2 hover:scale-110 bg-red-500 border-red-500`}
                        >
                          Hủy
                        </Button>
                        <Button
                          isActive={false}
                          customCSS={`mx-6 px-4 py-1 border-2  ${
                            !isDisableButton() && 'hover:scale-110 bg-blue-500 border-blue-500'
                          }`}
                          onClick={(e) => {
                            openConfirmModal()
                          }}
                          type="submit"
                          isDisable={isDisableButton()}
                        >
                          Xác minh
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={openConfirm}
          isComfirmFunction={isUpdate ? submitHandle : cancelConfirmHandle}
          titleValue={isUpdate ? 'Xác minh giao dịch' : 'Xác nhận hủy'}
        >
          <div className="text-white m-4">
            {isUpdate ? (
              <div>
                Xác nhận giao dịch{' '}
                {form.values.status == 'COMPLETED' ? (
                  <span className="text-green-500">thành công</span>
                ) : (
                  <span className="text-red-500">thất bại</span>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        </ComfirmModal>
      )}
    </ModalBase>
  )
}

export default WithdrawalTransactionModal
