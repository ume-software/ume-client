import { ArrowRight } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { uploadImage } from '~/apis/upload-media'
import { GenderEnum } from '~/enumVariable/enumVariable'

import { FormEvent, useState } from 'react'

import { DatePicker, Select, Steps, notification, theme } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import { UserSendKYCRequest } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

type KYCFormStepProps = {
  handleClose: () => void
  setIsModalVertificationVisible: (value: boolean) => void
  setSelectedImage: (value: any) => void
  handleImageChange: (event, index: number) => void
  selectedImage: any
}

interface IFormValues extends UserSendKYCRequest {}

const steps = [
  {
    title: <div className="text-white">Thông tin người xác thực</div>,
    description: <div className="text-xs text-slate-300">Nhập thông tin trên CCCD/Passport</div>,
  },
  {
    title: <div className="text-white">Ảnh CCCD/Passport</div>,
    description: <div className="text-xs text-slate-300">Tải ảnh CCCD/Passport</div>,
  },
]

const validate = (values: IFormValues): FormikErrors<IFormValues> => {
  const errors: FormikErrors<IFormValues> = {}
  if (values.citizenId === '') {
    errors.citizenId = 'Vui lòng nhập số CCCD/Passport.'
  } else if (isNaN(Number(values.citizenId))) {
    errors.citizenId = 'Số CCCD/Passport phải là một số.'
  } else if (values.citizenId.length > 13) {
    errors.citizenId = 'Số CCCD/Passport không vượt quá 13 kí tự.'
  }

  if (values.citizenName === '') {
    errors.citizenName = 'Vui lòng nhập họ tên đầy đủ'
  }

  if (values.citizenDob === '') {
    errors.citizenDob = 'Vui lòng nhập ngày sinh'
  }

  if (values.citizenGender.toString() === '') {
    errors.citizenGender = 'Vui lòng chọn giới tính'
  }

  return errors
}

export const KYCFormStep = ({
  handleClose,
  handleImageChange,
  selectedImage,
  setSelectedImage,
  setIsModalVertificationVisible,
}: KYCFormStepProps) => {
  const [current, setCurrent] = useState(0)
  const utils = trpc.useContext()
  const userKYC = trpc.useMutation(['identity.userKYC'])

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const form = useFormik({
    initialValues: {
      citizenId: '',
      citizenName: '',
      citizenDob: '',
      citizenGender: '',
      frontSideCitizenIdImageUrl: '',
      backSideCitizenIdImageUrl: '',
      portraitImageUrl: '',
    },
    validate,
    onSubmit: (values) => {},
  })

  const handleUploadImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    if (selectedImage.frontVertificationImage && selectedImage.backVertificationImage && selectedImage.faceImage) {
      try {
        const responseData = await uploadImage(formData)
        if (responseData?.data?.data?.results) {
          userKYC.mutate(
            {
              frontSideCitizenIdImageUrl: responseData.data.data.results[0],
              backSideCitizenIdImageUrl: responseData.data.data.results[1],
              portraitImageUrl: responseData.data.data.results[2],
              citizenDob: new Date(form.values.citizenDob).toISOString(),
              citizenGender: form.values.citizenGender as any,
              citizenId: form.values.citizenId,
              citizenName: form.values.citizenName,
            },
            {
              onSuccess() {
                setSelectedImage((image) => ({
                  ...image,
                  frontVertificationImage: undefined,
                  backVertificationImage: undefined,
                  faceImage: undefined,
                }))
                setIsModalVertificationVisible(false)
                utils.invalidateQueries('identity.identityInfo')
                notification.success({
                  message: 'Cập nhật thông tin thành công',
                  description: 'Thông tin vừa được cập nhật',
                  placement: 'bottomLeft',
                })
              },
              onError() {
                notification.error({
                  message: 'Cập nhật thông tin thất bại',
                  description: 'Có lỗi trong quá trình cập nhật thông tin. Vui lòng thử lại sau!',
                  placement: 'bottomLeft',
                })
              },
            },
          )
        } else {
          notification.error({
            message: 'File ảnh bị lỗi',
            description: 'File ảnh bị lỗi. Vui lòng thử lại!',
            placement: 'bottomLeft',
          })
        }
      } catch (error) {
        notification.error({
          message: 'Cập nhật thông tin thất bại',
          description: 'Có lỗi trong quá trình cập nhật thông tin. Vui lòng thử lại sau!',
          placement: 'bottomLeft',
        })
      }
    } else {
      notification.warning({
        message: 'Thiếu ảnh',
        description: 'Vui lòng cung cấp đủ hình ảnh!',
        placement: 'bottomLeft',
      })
    }
  }

  return (
    <div className="mt-10 max-h-[95%] flex flex-col px-5 pb-5 gap-5 overflow-y-auto custom-scrollbar">
      <Steps current={current} className="mb-4" items={steps} />
      <div>
        <form onSubmit={handleUploadImage}>
          {current === 0 && (
            <div className="mt-5 flex flex-col max-h-[70%] gap-10 overflow-y-auto text-md custom-scrollbar">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col">
                  <div className="text-white">Số CCCD/Passport</div>
                  <FormInput
                    name="citizenId"
                    value={form.values.citizenId}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={!!form.errors.citizenId && form.touched.citizenId}
                    errorMessage={form.errors.citizenId}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-white">Họ và tên</div>
                  <FormInput
                    name="citizenName"
                    value={form.values.citizenName}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={!!form.errors.citizenName && form.touched.citizenName}
                    errorMessage={form.errors.citizenName}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-white">Ngày tháng năm sinh</div>
                  <DatePicker
                    onChange={(date, dateString) => {
                      form.setFieldValue('citizenDob', dateString)
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-white">Giới tính</div>
                  <Select
                    defaultValue={''}
                    onChange={(value) => {
                      form.setFieldValue('citizenGender', value)
                    }}
                    options={[
                      { value: GenderEnum.FEMALE, label: 'Nữ' },
                      { value: GenderEnum.MALE, label: 'Nam' },
                    ]}
                  />
                </div>
              </div>
              <div className="flex justify-around mt-0 mb-[15%]">
                <Button
                  type="button"
                  isActive={false}
                  isOutlinedButton={true}
                  customCSS="w-[150px] text-xl p-2 rounded-xl hover:scale-105"
                  onClick={() => handleClose()}
                >
                  Hủy
                </Button>
                <Button
                  customCSS={`w-[200px] text-xl p-2 rounded-xl ${
                    !!form.errors.citizenId ||
                    !!form.errors.citizenName ||
                    !!form.errors.citizenDob ||
                    !!form.errors.citizenGender ||
                    !form.values.citizenId ||
                    !form.values.citizenName ||
                    !form.values.citizenDob ||
                    !form.values.citizenGender
                      ? 'opacity-20 cursor-not-allowed hover:scale-100 '
                      : 'hover:scale-105'
                  }'}`}
                  type="button"
                  isActive={true}
                  isOutlinedButton={true}
                  isDisable={
                    !!form.errors.citizenId ||
                    !!form.errors.citizenName ||
                    !!form.errors.citizenDob ||
                    !!form.errors.citizenGender ||
                    !form.values.citizenId ||
                    !form.values.citizenName ||
                    !form.values.citizenDob ||
                    !form.values.citizenGender
                  }
                  onClick={() => {
                    if (
                      !form.errors.citizenId &&
                      !form.errors.citizenName &&
                      !form.errors.citizenDob &&
                      !form.errors.citizenGender &&
                      form.values.citizenId &&
                      form.values.citizenName &&
                      form.values.citizenDob &&
                      form.values.citizenGender
                    ) {
                      next()
                    }
                  }}
                >
                  Bước kế tiếp <ArrowRight className="ml-2" theme="outline" size="28" fill="#fff" />
                </Button>
              </div>
            </div>
          )}
          {current === 1 && (
            <div>
              <div className="flex flex-col gap-10 overflow-y-auto text-white text-md custom-scrollbar">
                <div>
                  <label>Ảnh mặt trước</label>
                  <p className="text-sm text-red-500 opacity-70 text-end">*Ảnh trên 2Mb có thể bị lỗi</p>
                  <div className="relative">
                    <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                      {!selectedImage.frontVertificationImage && (
                        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full border-2 border-white border-dashed rounded-xl">
                          <p className="text-4xl font-bold text-white">+</p>
                        </div>
                      )}
                      <Image
                        className="rounded-lg"
                        layout="fill"
                        objectFit="scale-down"
                        src={
                          selectedImage.frontVertificationImage ? selectedImage.frontVertificationImage : ImgForEmpty
                        }
                        alt="Personal Image"
                      />
                    </div>
                    <input
                      className="absolute top-0 left-0 z-20 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      name="files"
                      onChange={(e) => handleImageChange(e, 1)}
                    />
                  </div>
                </div>
                <div>
                  <label>Ảnh mặt sau</label>
                  <p className="text-sm text-red-500 opacity-70 text-end">*Ảnh trên 2Mb có thể bị lỗi</p>
                  <div className="relative">
                    <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full border-2 border-white border-dashed rounded-xl">
                        <p className="text-4xl font-bold text-white">+</p>
                      </div>
                      <Image
                        className="rounded-lg"
                        layout="fill"
                        objectFit="scale-down"
                        src={selectedImage.backVertificationImage ? selectedImage.backVertificationImage : ImgForEmpty}
                        alt="Personal Image"
                      />
                    </div>
                    <input
                      className="absolute top-0 left-0 z-20 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      name="files"
                      onChange={(e) => handleImageChange(e, 2)}
                    />
                  </div>
                </div>
                <div>
                  <label>Ảnh khuôn mặt</label>
                  <p className="text-sm text-red-500 opacity-70 text-end">*Ảnh trên 2Mb có thể bị lỗi</p>
                  <div className="relative">
                    <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full border-2 border-white border-dashed rounded-xl">
                        <p className="text-4xl font-bold text-white">+</p>
                      </div>
                      <Image
                        className="rounded-lg"
                        layout="fill"
                        objectFit="scale-down"
                        src={selectedImage.faceImage ? selectedImage.faceImage : ImgForEmpty}
                        alt="Personal Image"
                      />
                    </div>
                    <input
                      className="absolute top-0 left-0 z-20 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      name="files"
                      onChange={(e) => handleImageChange(e, 3)}
                    />
                  </div>
                </div>
              </div>
              <div className="min-h-[100px] flex justify-around items-start mt-9">
                <Button
                  type="button"
                  isActive={false}
                  isOutlinedButton={true}
                  customCSS="w-[100px] text-xl py-2 px-7 rounded-xl hover:scale-105"
                  onClick={() => handleClose()}
                >
                  Hủy
                </Button>

                <Button
                  customCSS={`"w-[150px] text-xl py-2 px-7 rounded-xl ${
                    selectedImage.frontVertificationImage &&
                    selectedImage.backVertificationImage &&
                    selectedImage.faceImage
                      ? 'hover:scale-105'
                      : 'opacity-20 cursor-not-allowed hover:scale-100 '
                  }"`}
                  isActive={true}
                  isOutlinedButton={true}
                >
                  Xác minh
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
