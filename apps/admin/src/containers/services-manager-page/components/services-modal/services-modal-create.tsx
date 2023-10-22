import { DeleteOne, Plus } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'
import { uploadImageServices } from '~/api/upload-media'

import * as React from 'react'
import { useRef, useState } from 'react'

import { notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import {
  HandleServiceAttributeRequestHandleTypeEnum,
  HandleServiceAttributeValueRequestHandleTypeEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import ServiceAttributes from './services-attribute-childrend'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

export interface IServicesModalCreateProps {
  closeFunction: any
  openValue: boolean
}

export default function ServicesModalCreate({ closeFunction, openValue }: IServicesModalCreateProps) {
  const titleValue = 'Thêm dịch vụ'
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const [isSubmiting, setSubmiting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [children, setChildren] = useState<JSX.Element[]>([])
  const createService = trpc.useMutation(['services.createService'])
  const form = useFormik({
    initialValues: {
      name: '',
      viName: '',
      imageUrl: '',
      isActivated: true,
      serviceAttributes: [] as Array<Object>,
      selectedImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên dịch vụ bắt buộc'),
      viName: Yup.string(),
      imageUrl: Yup.string().required('Hình là bắt buộc'),
      serviceAttributes: Yup.array()
        .of(
          Yup.object({
            attribute: Yup.string().required('Thuộc tính là bắt buộc'),
            viAttribute: Yup.string(),
            isActivated: Yup.boolean(),
            serviceAttributeValues: Yup.array()
              .of(
                Yup.object({
                  value: Yup.string().required('Thuộc tính là bắt buộc'),
                  viValue: Yup.string(),
                  isActivated: Yup.boolean(),
                }),
              )
              .min(0, ''),
          }),
        )
        .min(0, ''),
    }),
    onSubmit: (values, { resetForm }) => {
      setSubmiting(true)
      openConfirmModal()
      resetForm()
    },
  })
  function closeHandleSmall() {
    openConfirmModalCancel()
  }
  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
  }
  function clearData() {
    form.resetForm()
  }
  function closeHandle() {
    setOpenConfirm(false)
    clearData()
    closeFunction()
  }
  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        form.setFieldValue('selectedImage', file)
        form.setFieldValue('imageUrl', URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const addChildComponent = () => {
    form.setFieldValue('serviceAttributes', [
      ...form.values.serviceAttributes,
      {
        attribute: '',
        viAttribute: '',
        isActivated: true,
        serviceAttributeValues: [],
        handleType: HandleServiceAttributeRequestHandleTypeEnum.Create,
      },
    ])
  }
  const removeChildComponent = (index) => {
    const updatedSubChildData = [...form.values.serviceAttributes]
    updatedSubChildData.splice(index, 1)
    form.setFieldValue(`serviceAttributes`, updatedSubChildData)
  }

  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (form.values.selectedImage) {
        const formData = new FormData()
        formData.append('image', form.values.selectedImage)
        const responseData = await uploadImageServices(formData)
        if (responseData?.data?.data?.results) {
          responseData?.data?.data?.results.map((image) => {
            imageUrl = image
          })
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
    return { imageUrl }
  }
  function checkFieldRequỉed() {
    if (form.values.name && form.values.imageUrl) {
      return true
    } else {
      return false
    }
  }
  async function submitHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
    if (await checkFieldRequỉed()) {
      const img = await uploadImage()
      if (img.imageUrl) {
        try {
          const req = {
            viName: form.values.viName,
            isActivated: form.values.isActivated,
            serviceAttributes: form.values.serviceAttributes,
          }
          let reqWithValuesNotNull = {
            name: form.values.name,
            imageUrl: img.imageUrl,
            handleType: HandleServiceAttributeValueRequestHandleTypeEnum.Create,
          }
          for (let key in req) {
            if (req[key]) {
              reqWithValuesNotNull[key] = req[key]
            }
          }
          createService.mutate(reqWithValuesNotNull, {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Tạo thành công!',
                  description: 'đã được tạo thành công.',
                })
                closeHandle()
              }
            },
            onError: () => {
              notification.error({
                message: 'Tạo thất bại!',
                description: 'Tạo không thành công.',
              })
            },
          })
        } catch (error) {
          console.error('Failed to create services:', error)
          notification.error({
            message: 'Tạo thất bại!',
            description: 'Tạo không thành công.',
          })
        }
      } else {
        console.error('Failed to to create services cause dont have image')
        notification.error({
          message: 'Tạo thất bại!',
          description: 'Tạo không thành công vì thiếu ảnh',
        })
      }
    }
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit} className="flex flex-col mb-4 gap-y-4">
        <ModalBase
          titleValue={titleValue}
          closeFunction={closeHandleSmall}
          openValue={openValue}
          className="w-auto bg-black"
          width={1100}
          isdestroyOnClose={true}
        >
          <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
            <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
              <div className="w-1/5 pr-4 mt-10">
                <div
                  className={`
                w-36 h-52 overflow-hidden rounded-2xl bg-[#413F4D]
                ${
                  !form.values.imageUrl && ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'
                }
                `}
                  onClick={handleImageClick}
                >
                  {form.values.imageUrl && (
                    <Image
                      className="overflow-hidden rounded-2xl"
                      width={144}
                      height={208}
                      src={form.values.imageUrl}
                      alt=""
                      objectFit="cover"
                    />
                  )}
                  {!form.values.imageUrl && (
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
              <div className="flex flex-col justify-center w-2/6 ">
                <div className="w-full h-24 text-white">
                  <div className="inline-block w-full h-8">Tên dịch vụ:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="name"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.name && form.touched.name ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={!!form.errors.name && form.touched.name ? form.errors.name : 'Tên dịch vụ bắt buộc '}
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.name}
                      error={!!form.errors.name && form.touched.name}
                      errorMessage={''}
                    />
                  </div>
                </div>
                <div className="h-12 text-white">
                  <div className="inline-block w-full h-8">Tên dịch vụ tiếng việt:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="viName"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.viName && form.touched.viName ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={
                        !!form.errors.viName && form.touched.viName ? form.errors.viName : 'Tên dịch vụ nếu có '
                      }
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.viName}
                      error={!!form.errors.viName && form.touched.viName}
                      errorMessage={''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* compent-child */}

          <div className="grid grid-cols-2 gap-4 px-4 pb-4 mt-6">
            {form.values.serviceAttributes.map((childData, index) => (
              <div className="col-span-1 " key={index}>
                <ServiceAttributes
                  index={index}
                  serviceAttributesData={childData}
                  setServiceAttributesData={(data) => {
                    const updatedSubChildData = [...form.values.serviceAttributes]
                    updatedSubChildData[index] = data
                    form.setFieldValue(`serviceAttributes[${index}]`, data)
                  }}
                  removeChildComponent={(index) => {
                    removeChildComponent(index)
                  }}
                />
              </div>
            ))}
            <div className="col-span-1 ">
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-40">
                  <Button
                    customCSS="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 hover:scale-110"
                    onClick={addChildComponent}
                  >
                    <Plus theme="outline" size="24" fill="#fff" />
                    Thêm thuộc tính
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* compent-child */}

          <div className="flex justify-center pb-4 mt-6 ">
            <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={openConfirmModalCancel}>
              Hủy
            </Button>
            <Button
              customCSS={`mx-6 px-4 py-1 border-2 ${
                form.isValid && form.values.name != '' && 'hover:scale-110 bg-[#7463F0] border-[#7463F0] '
              }
              `}
              onClick={(e) => {
                if (createService.isLoading) {
                  return
                } else {
                  e.preventDefault()
                  openConfirmModal()
                }
              }}
              isDisable={!form.isValid || form.values.name === ''}
              isLoading={createService.isLoading}
            >
              {'Tạo'}
            </Button>
          </div>
        </ModalBase>
      </form>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={isCreate ? submitHandle : closeHandle}
          titleValue={isCreate ? 'Xác nhận Tạo' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </div>
  )
}
